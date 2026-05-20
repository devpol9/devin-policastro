import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { CONTENT_MEDIA_BUCKET } from "@/lib/content-constants";

export type ContentItem = Tables<"content_items">;
export type ContentAttachment = Tables<"content_attachments">;
export type ContentPillar = Tables<"content_pillars">;

const CONTENT_KEY = ["content_items"] as const;
const PILLARS_KEY = ["content_pillars"] as const;

export interface ContentFilters {
  venture_ids?: string[];
  platforms?: string[];
  pillars?: string[];
  statuses?: string[];
  project_id?: string;
  search?: string;
  scheduled_from?: string;
  scheduled_to?: string;
  exclude_archived?: boolean;
}

const fetchContent = async (filters?: ContentFilters): Promise<ContentItem[]> => {
  let q = supabase.from("content_items").select("*");
  if (filters?.venture_ids?.length) q = q.in("venture_id", filters.venture_ids);
  if (filters?.platforms?.length) q = q.in("platform", filters.platforms);
  if (filters?.pillars?.length) q = q.in("pillar", filters.pillars);
  if (filters?.statuses?.length) q = q.in("status", filters.statuses);
  if (filters?.project_id) q = q.eq("project_id", filters.project_id);
  if (filters?.exclude_archived) q = q.neq("status", "archived");
  if (filters?.scheduled_from) q = q.gte("scheduled_at", filters.scheduled_from);
  if (filters?.scheduled_to) q = q.lte("scheduled_at", filters.scheduled_to);

  const { data, error } = await q
    .order("scheduled_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (error) throw error;

  let rows = data ?? [];
  if (filters?.search?.trim()) {
    const s = filters.search.toLowerCase();
    rows = rows.filter((r) =>
      r.title.toLowerCase().includes(s) ||
      (r.caption ?? "").toLowerCase().includes(s) ||
      (r.hook ?? "").toLowerCase().includes(s) ||
      (r.notes ?? "").toLowerCase().includes(s)
    );
  }
  return rows;
};

const baseOpts = {
  staleTime: 30 * 1000,
  retry: 1,
  retryDelay: 500,
  refetchOnWindowFocus: false,
};

export const useContentItems = (filters?: ContentFilters) => {
  const q = useQuery({
    queryKey: [...CONTENT_KEY, filters ?? {}],
    queryFn: () => fetchContent(filters),
    ...baseOpts,
  });
  return { ...q, items: q.data ?? [] };
};

export const useContentItem = (id: string | undefined) =>
  useQuery({
    queryKey: ["content_item", id],
    queryFn: async (): Promise<ContentItem | null> => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("content_items").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
    ...baseOpts,
  });

export const useContentAttachments = (contentItemId: string | undefined) =>
  useQuery({
    queryKey: ["content_attachments", contentItemId],
    queryFn: async (): Promise<ContentAttachment[]> => {
      if (!contentItemId) return [];
      const { data, error } = await supabase
        .from("content_attachments")
        .select("*")
        .eq("content_item_id", contentItemId)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!contentItemId,
    ...baseOpts,
  });

export const useContentPillars = () => {
  const q = useQuery({
    queryKey: PILLARS_KEY,
    queryFn: async (): Promise<ContentPillar[]> => {
      const { data, error } = await supabase
        .from("content_pillars")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
  return { ...q, pillars: q.data ?? [] };
};

export const useScheduledThisWeek = () => {
  const from = new Date(); from.setHours(0, 0, 0, 0);
  const to = new Date(from); to.setDate(to.getDate() + 7);
  return useContentItems({
    scheduled_from: from.toISOString(),
    scheduled_to: to.toISOString(),
    exclude_archived: true,
  });
};

export const invalidateContent = (qc: ReturnType<typeof useQueryClient>) => {
  qc.invalidateQueries({ queryKey: CONTENT_KEY });
  qc.invalidateQueries({ queryKey: ["content_item"] });
};
export const invalidatePillars = (qc: ReturnType<typeof useQueryClient>) => {
  qc.invalidateQueries({ queryKey: PILLARS_KEY });
};

// =========================
// Mutations
// =========================
export const createContent = async (
  values: Omit<TablesInsert<"content_items">, "user_id">
): Promise<ContentItem | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { toast.error("Not signed in"); return null; }
  const { data, error } = await supabase
    .from("content_items")
    .insert({ ...values, user_id: user.id })
    .select().single();
  if (error) { toast.error(error.message); return null; }
  return data;
};

export const updateContent = async (
  id: string, patch: TablesUpdate<"content_items">
): Promise<boolean> => {
  const { error } = await supabase.from("content_items").update(patch).eq("id", id);
  if (error) { toast.error(error.message); return false; }
  return true;
};

export const deleteContent = async (id: string): Promise<boolean> => {
  // attempt to clean storage objects (best effort)
  const { data: atts } = await supabase
    .from("content_attachments")
    .select("storage_path")
    .eq("content_item_id", id);
  if (atts && atts.length > 0) {
    await supabase.storage.from(CONTENT_MEDIA_BUCKET).remove(atts.map((a) => a.storage_path));
  }
  const { error } = await supabase.from("content_items").delete().eq("id", id);
  if (error) { toast.error(error.message); return false; }
  return true;
};

export const moveContentStatus = async (id: string, status: string): Promise<boolean> => {
  return updateContent(id, { status });
};

export const scheduleContent = async (
  id: string, scheduledAt: string | null
): Promise<boolean> => {
  const patch: TablesUpdate<"content_items"> = { scheduled_at: scheduledAt };
  if (scheduledAt) patch.status = "scheduled";
  return updateContent(id, patch);
};

// Atomic-ish upload: storage put, then DB row
export const uploadAttachment = async (
  contentItem: { id: string; user_id: string },
  file: File,
  sortOrder: number
): Promise<ContentAttachment | null> => {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `content/${contentItem.user_id}/${contentItem.id}/${Date.now()}-${safeName}`;
  const { error: upErr } = await supabase
    .storage.from(CONTENT_MEDIA_BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (upErr) { toast.error(`Upload failed: ${upErr.message}`); return null; }
  const { data, error } = await supabase
    .from("content_attachments")
    .insert({
      content_item_id: contentItem.id,
      storage_path: path,
      mime_type: file.type || null,
      file_size_bytes: file.size,
      file_name: file.name,
      sort_order: sortOrder,
    })
    .select().single();
  if (error) {
    // rollback storage
    await supabase.storage.from(CONTENT_MEDIA_BUCKET).remove([path]);
    toast.error(error.message);
    return null;
  }
  return data;
};

export const deleteAttachment = async (att: ContentAttachment): Promise<boolean> => {
  await supabase.storage.from(CONTENT_MEDIA_BUCKET).remove([att.storage_path]);
  const { error } = await supabase.from("content_attachments").delete().eq("id", att.id);
  if (error) { toast.error(error.message); return false; }
  return true;
};

export const reorderAttachments = async (
  attachments: { id: string; sort_order: number }[]
): Promise<boolean> => {
  for (const a of attachments) {
    const { error } = await supabase
      .from("content_attachments")
      .update({ sort_order: a.sort_order })
      .eq("id", a.id);
    if (error) { toast.error(error.message); return false; }
  }
  return true;
};

export const getSignedUrl = async (path: string): Promise<string | null> => {
  const { data, error } = await supabase
    .storage.from(CONTENT_MEDIA_BUCKET)
    .createSignedUrl(path, 60 * 60);
  if (error) return null;
  return data?.signedUrl ?? null;
};

// =========================
// Pillars mutations
// =========================
export const createPillar = async (
  values: Omit<TablesInsert<"content_pillars">, "user_id">
): Promise<ContentPillar | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { toast.error("Not signed in"); return null; }
  const { data, error } = await supabase
    .from("content_pillars")
    .insert({ ...values, user_id: user.id })
    .select().single();
  if (error) { toast.error(error.message); return null; }
  return data;
};

export const updatePillar = async (
  id: string, patch: TablesUpdate<"content_pillars">
): Promise<boolean> => {
  const { error } = await supabase.from("content_pillars").update(patch).eq("id", id);
  if (error) { toast.error(error.message); return false; }
  return true;
};

export const deletePillar = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from("content_pillars").delete().eq("id", id);
  if (error) { toast.error(error.message); return false; }
  return true;
};
