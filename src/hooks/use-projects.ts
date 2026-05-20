import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { toast } from "sonner";

export type Project = Tables<"projects">;
export type Subtask = Tables<"subtasks">;

const PROJECTS_KEY = ["projects"] as const;

export interface ProjectFilters {
  venture_id?: string | null;
  status?: string | string[];
  priority?: string | string[];
  search?: string;
}

const fetchProjects = async (filters?: ProjectFilters): Promise<Project[]> => {
  let q = supabase.from("projects").select("*");
  if (filters?.venture_id) q = q.eq("venture_id", filters.venture_id);
  if (filters?.status) {
    const arr = Array.isArray(filters.status) ? filters.status : [filters.status];
    q = q.in("status", arr);
  }
  if (filters?.priority) {
    const arr = Array.isArray(filters.priority) ? filters.priority : [filters.priority];
    q = q.in("priority", arr);
  }
  const { data, error } = await q
    .order("status", { ascending: true })
    .order("sort_order", { ascending: true });
  if (error) throw error;
  let rows = data ?? [];
  if (filters?.search?.trim()) {
    const s = filters.search.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.title.toLowerCase().includes(s) ||
        (r.description ?? "").toLowerCase().includes(s)
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

export const useProjects = (filters?: ProjectFilters) => {
  const query = useQuery({
    queryKey: [...PROJECTS_KEY, filters ?? {}],
    queryFn: () => fetchProjects(filters),
    ...baseOpts,
  });
  return { ...query, projects: query.data ?? [] };
};

export const useProject = (id: string | undefined) =>
  useQuery({
    queryKey: ["project", id],
    queryFn: async (): Promise<Project | null> => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
    ...baseOpts,
  });

export const useSubtasks = (projectId: string | undefined) =>
  useQuery({
    queryKey: ["subtasks", projectId],
    queryFn: async (): Promise<Subtask[]> => {
      if (!projectId) return [];
      const { data, error } = await supabase
        .from("subtasks")
        .select("*")
        .eq("project_id", projectId)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!projectId,
    ...baseOpts,
  });

export const invalidateProjects = (qc: ReturnType<typeof useQueryClient>) => {
  qc.invalidateQueries({ queryKey: PROJECTS_KEY });
  qc.invalidateQueries({ queryKey: ["project"] });
};

export const createProject = async (
  values: Omit<TablesInsert<"projects">, "user_id">
): Promise<Project | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    toast.error("Not signed in");
    return null;
  }
  const { data, error } = await supabase
    .from("projects")
    .insert({ ...values, user_id: user.id })
    .select()
    .single();
  if (error) {
    toast.error(error.message);
    return null;
  }
  return data;
};

export const updateProject = async (
  id: string,
  patch: TablesUpdate<"projects">
): Promise<boolean> => {
  const { error } = await supabase.from("projects").update(patch).eq("id", id);
  if (error) {
    toast.error(error.message);
    return false;
  }
  return true;
};

export const deleteProject = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) {
    toast.error(error.message);
    return false;
  }
  return true;
};

export const createSubtask = async (
  projectId: string,
  title: string,
  sortOrder: number
): Promise<Subtask | null> => {
  const { data, error } = await supabase
    .from("subtasks")
    .insert({ project_id: projectId, title, sort_order: sortOrder })
    .select()
    .single();
  if (error) {
    toast.error(error.message);
    return null;
  }
  return data;
};

export const updateSubtask = async (
  id: string,
  patch: TablesUpdate<"subtasks">
): Promise<boolean> => {
  const { error } = await supabase.from("subtasks").update(patch).eq("id", id);
  if (error) {
    toast.error(error.message);
    return false;
  }
  return true;
};

export const deleteSubtask = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from("subtasks").delete().eq("id", id);
  if (error) {
    toast.error(error.message);
    return false;
  }
  return true;
};

export const moveProjectStatus = async (
  id: string,
  status: string,
  sortOrder: number
): Promise<boolean> => {
  const { error } = await supabase
    .from("projects")
    .update({ status, sort_order: sortOrder })
    .eq("id", id);
  if (error) {
    toast.error("Move failed");
    return false;
  }
  return true;
};
