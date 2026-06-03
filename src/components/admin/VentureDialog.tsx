import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { invalidateVentures, type Venture } from "@/hooks/use-ventures";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { VENTURE_ICON_NAMES, getVentureIcon } from "./ventureIcons";

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const schema = z.object({
  name: z.string().min(2, "Name too short"),
  slug: z.string().regex(/^[a-z0-9-]+$/, "lowercase letters, numbers, hyphens"),
  short_name: z.string().max(6, "Max 6 chars").optional().or(z.literal("")),
  description: z.string().max(200, "Max 200 chars").optional().or(z.literal("")),
  accent_color: z.string().min(3, "Required"),
  icon: z.string().min(1, "Pick an icon"),
  website_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  status: z.enum(["active", "paused", "archived", "idea"]),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  venture?: Venture;
}

const VentureDialog = ({ open, onOpenChange, venture }: Props) => {
  const isEdit = !!venture;
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [iconQuery, setIconQuery] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: venture?.name ?? "",
      slug: venture?.slug ?? "",
      short_name: venture?.short_name ?? "",
      description: venture?.description ?? "",
      accent_color: venture?.accent_color ?? "hsl(38 55% 58%)",
      icon: venture?.icon ?? "Sparkles",
      website_url: venture?.website_url ?? "",
      status: (venture?.status as FormValues["status"]) ?? "active",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: venture?.name ?? "",
        slug: venture?.slug ?? "",
        short_name: venture?.short_name ?? "",
        description: venture?.description ?? "",
        accent_color: venture?.accent_color ?? "hsl(38 55% 58%)",
        icon: venture?.icon ?? "Sparkles",
        website_url: venture?.website_url ?? "",
        status: (venture?.status as FormValues["status"]) ?? "active",
      });
      setSlugTouched(isEdit);
      setIconQuery("");
    }
  }, [open, venture, isEdit, form]);

  const nameValue = form.watch("name");
  useEffect(() => {
    if (!slugTouched && !isEdit) {
      form.setValue("slug", slugify(nameValue));
    }
  }, [nameValue, slugTouched, isEdit, form]);

  const accent = form.watch("accent_color");
  const iconName = form.watch("icon");

  const onSubmit = async (values: FormValues) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Not signed in");
      return;
    }
    const payload = {
      user_id: user.id,
      name: values.name,
      slug: values.slug,
      short_name: values.short_name || null,
      description: values.description || null,
      accent_color: values.accent_color,
      icon: values.icon,
      website_url: values.website_url || null,
      status: values.status,
    };

    if (isEdit && venture) {
      const { error } = await supabase
        .from("ventures").update(payload).eq("id", venture.id);
      if (error) {
        if (error.code === "23505") form.setError("slug", { message: "Slug already taken" });
        else toast.error(error.message);
        return;
      }
      invalidateVentures(qc);
      toast.success("Saved");
      onOpenChange(false);
    } else {
      const { data, error } = await supabase
        .from("ventures").insert(payload).select().single();
      if (error) {
        if (error.code === "23505") form.setError("slug", { message: "Slug already taken" });
        else toast.error(error.message);
        return;
      }
      invalidateVentures(qc);
      toast.success("Venture created");
      onOpenChange(false);
      if (data) navigate(`/hq/ventures/${data.slug}`);
    }
  };

  const filteredIcons = VENTURE_ICON_NAMES.filter((n) =>
    n.toLowerCase().includes(iconQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">
            {isEdit ? "Edit venture" : "New venture"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label>Name</Label>
              <Input {...form.register("name")} />
              {form.formState.errors.name && (
                <p className="text-xs text-destructive mt-1">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div>
              <Label>Slug</Label>
              <Input
                {...form.register("slug")}
                onChange={(e) => {
                  setSlugTouched(true);
                  form.setValue("slug", e.target.value);
                }}
              />
              {form.formState.errors.slug && (
                <p className="text-xs text-destructive mt-1">{form.formState.errors.slug.message}</p>
              )}
            </div>
            <div>
              <Label>Short name</Label>
              <Input {...form.register("short_name")} maxLength={6} />
            </div>
          </div>

          <div>
            <Label>Description</Label>
            <Textarea rows={2} {...form.register("description")} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Website URL</Label>
              <Input type="url" placeholder="https://…" {...form.register("website_url")} />
              {form.formState.errors.website_url && (
                <p className="text-xs text-destructive mt-1">{form.formState.errors.website_url.message}</p>
              )}
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={form.watch("status")}
                onValueChange={(v) => form.setValue("status", v as FormValues["status"])}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                  <SelectItem value="idea">Idea</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Accent color (HSL)</Label>
            <div className="flex items-center gap-2">
              <Input {...form.register("accent_color")} placeholder="hsl(38 55% 58%)" />
              <div
                className="w-9 h-9 rounded-md border border-border/60 shrink-0"
                style={{ background: accent }}
              />
            </div>
          </div>

          <div>
            <Label>Icon</Label>
            <Input
              value={iconQuery}
              onChange={(e) => setIconQuery(e.target.value)}
              placeholder="Search icons…"
              className="mb-2"
            />
            <div className="grid grid-cols-6 gap-2 max-h-44 overflow-y-auto p-1 border border-border/40 rounded-md">
              {filteredIcons.map((name) => {
                const Icon = getVentureIcon(name);
                const selected = iconName === name;
                return (
                  <button
                    type="button"
                    key={name}
                    onClick={() => form.setValue("icon", name)}
                    className="aspect-square flex items-center justify-center rounded-md border"
                    style={{
                      borderColor: selected ? accent : "hsl(var(--border) / 0.4)",
                      background: selected ? `color-mix(in oklch, ${accent} 14%, transparent)` : "transparent",
                      color: selected ? accent : "hsl(var(--foreground) / 0.6)",
                    }}
                    title={name}
                  >
                    <Icon size={18} />
                  </button>
                );
              })}
            </div>
            {form.formState.errors.icon && (
              <p className="text-xs text-destructive mt-1">{form.formState.errors.icon.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {isEdit ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VentureDialog;
