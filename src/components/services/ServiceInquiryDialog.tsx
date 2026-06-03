import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";

interface InquiryField {
  key: string;
  label: string;
  placeholder: string;
  type: "input" | "textarea" | "select";
  required?: boolean;
  rows?: number;
  options?: string[];
  defaultValue?: string;
}

interface ServiceInquiryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle: string;
  color: string;
  fields: InquiryField[];
  emailSubject: string;
  defaultVenture?: string;
}

const VENTURE_OPTIONS = [
  { slug: "impact-zone", label: "Impact Zone NJ — Gym / fitness" },
  { slug: "2thirty", label: "2THIRTY — Hydration mixer" },
  { slug: "valence", label: "Valence — Gym SaaS" },
  { slug: "onlyshitz", label: "OnlyShitz — Social casino" },
  { slug: "creative-vision", label: "Creative Vision — Manufacturing / private label" },
  { slug: "personal", label: "Devin (personal brand / consulting)" },
  { slug: "new-projects", label: "Something new" },
];

const ServiceInquiryDialog = ({
  open,
  onOpenChange,
  title,
  subtitle,
  color,
  fields,
  emailSubject,
  defaultVenture,
}: ServiceInquiryDialogProps) => {
  const [sending, setSending] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const initial: Record<string, string> = { name: "", email: "", phone: "", venture_slug: defaultVenture ?? "" };
  fields.forEach((f) => {
    if (f.defaultValue) initial[f.key] = f.defaultValue;
  });
  const [formData, setFormData] = useState<Record<string, string>>(initial);

  const colorId = color.replace(/\s+/g, "-");

  useEffect(() => {
    if (open) {
      trackEvent("inquiry_open", { subject: emailSubject, title });
    }
  }, [open, emailSubject, title]);

  const emailValid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const errors: Record<string, string> = {};
  if (!formData.name?.trim()) errors.name = "Please enter your name.";
  if (!formData.email?.trim()) errors.email = "Email is required.";
  else if (!emailValid(formData.email)) errors.email = "Enter a valid email address.";
  fields.forEach((f) => {
    if (f.required && !formData[f.key]?.trim()) {
      errors[f.key] = `${f.label} is required.`;
    }
  });

  const isValid = Object.keys(errors).length === 0;

  const showError = (key: string) => touched[key] && errors[key];
  const markTouched = (key: string) => setTouched((p) => ({ ...p, [key]: true }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      const allTouched: Record<string, boolean> = { name: true, email: true };
      fields.forEach((f) => { if (f.required) allTouched[f.key] = true; });
      setTouched(allTouched);
      return;
    }
    setSending(true);

    const customFields: Record<string, string> = {};
    fields.forEach((f) => {
      if (formData[f.key]) customFields[f.label] = formData[f.key];
    });

    const ventureLabel =
      VENTURE_OPTIONS.find((v) => v.slug === formData.venture_slug)?.label ?? null;
    if (ventureLabel) customFields["Related to"] = ventureLabel;

    try {
      const { data, error } = await supabase.functions.invoke("send-contact-email", {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: emailSubject,
          formData: {
            ...customFields,
            venture_slug: formData.venture_slug || null,
          },
        },
      });

      if (error) throw error;
      toast.success("Inquiry sent! Devin will get back to you.");
      trackEvent("inquiry_submit", {
        subject: emailSubject,
        service: formData.service || null,
        venture: formData.venture_slug || null,
      });
      setFormData({ name: "", email: "", phone: "", venture_slug: defaultVenture ?? "" });
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to send. DM @devinpolicastro on Instagram instead.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-lenis-prevent
        className="sm:max-w-lg bg-card border border-border p-0 max-h-[92vh] overflow-y-auto rounded-2xl shadow-[0_30px_80px_-30px_hsl(30_20%_20%/0.35)]"
      >
        <style>{`
          .inquiry-${colorId} input:focus,
          .inquiry-${colorId} textarea:focus {
            border-color: hsl(${color} / 0.5) !important;
            box-shadow: 0 0 0 3px hsl(${color} / 0.08);
          }
        `}</style>

        {/* Hairline accent */}
        <div className="h-px w-full" style={{ background: `hsl(${color})` }} />

        <div className={`p-6 sm:p-8 inquiry-${colorId}`}>
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="h-px w-6" style={{ background: `hsl(${color})` }} />
              <span className="text-foreground/50 text-[10px] font-display font-medium tracking-[0.22em]">
                Private inquiry
              </span>
            </div>
            <DialogTitle className="font-display font-black text-xl sm:text-2xl leading-[1.05] tracking-[-0.02em] text-foreground">
              {title}
            </DialogTitle>
            <p className="text-muted-foreground text-[13px] sm:text-sm mt-2 leading-relaxed">
              {subtitle}
            </p>
            <a
              href="https://calendar.app.google/xXzaDYrcPvFHRCQ28"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-display text-foreground/60 md:hover:text-accent transition-colors underline-offset-4 md:hover:underline"
            >
              Prefer to talk? Book a 15-min virtual call →
            </a>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-display font-semibold tracking-[0.14em] text-foreground/85 mb-1.5 block">
                  Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  onBlur={() => markTouched("name")}
                  placeholder="Your name"
                  aria-invalid={!!showError("name")}
                  maxLength={100}
                  className={`bg-background h-11 text-sm rounded-lg ${showError("name") ? "border-destructive" : "border-border"}`}
                />
                {showError("name") && (
                  <p className="text-destructive text-[11px] font-display mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <label className="text-[11px] font-display font-semibold tracking-[0.14em] text-foreground/85 mb-1.5 block">
                  Email *
                </label>
                <Input
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  onBlur={() => markTouched("email")}
                  type="email"
                  placeholder="you@email.com"
                  aria-invalid={!!showError("email")}
                  maxLength={255}
                  className={`bg-background h-11 text-sm rounded-lg ${showError("email") ? "border-destructive" : "border-border"}`}
                />
                {showError("email") && (
                  <p className="text-destructive text-[11px] font-display mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-display font-semibold tracking-[0.14em] text-foreground/85 mb-1.5 block">
                Phone
              </label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                placeholder="(201) 555-0123"
                maxLength={20}
                className="bg-background border-border h-11 text-sm rounded-lg"
              />
            </div>

            <div>
              <label className="text-[11px] font-display font-semibold tracking-[0.14em] text-foreground/85 mb-1.5 block">
                Related to
              </label>
              <select
                value={formData.venture_slug || ""}
                onChange={(e) => setFormData((p) => ({ ...p, venture_slug: e.target.value }))}
                className="w-full bg-background border border-border h-11 text-sm rounded-lg px-3 font-display text-foreground focus:outline-none"
              >
                <option value="">Pick a venture (optional)</option>
                {VENTURE_OPTIONS.map((v) => (
                  <option key={v.slug} value={v.slug}>{v.label}</option>
                ))}
              </select>
            </div>



            {fields.map((field, i) => {
              const err = showError(field.key);
              const errCls = err ? "border-destructive" : "border-border";
              return (
                <motion.div
                  key={field.key}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <label className="text-[11px] font-display font-semibold tracking-[0.14em] text-foreground/85 mb-1.5 block">
                    {field.label}
                    {field.required ? " *" : ""}
                  </label>
                  {field.type === "textarea" ? (
                    <Textarea
                      value={formData[field.key] || ""}
                      onChange={(e) => setFormData((p) => ({ ...p, [field.key]: e.target.value }))}
                      onBlur={() => markTouched(field.key)}
                      placeholder={field.placeholder}
                      rows={field.rows || 3}
                      maxLength={500}
                      aria-invalid={!!err}
                      className={`bg-background resize-none text-sm rounded-lg ${errCls}`}
                    />
                  ) : field.type === "select" ? (
                    <select
                      value={formData[field.key] || ""}
                      onChange={(e) => {
                        const v = e.target.value;
                        setFormData((p) => ({ ...p, [field.key]: v }));
                        if (v) trackEvent("inquiry_select_change", { subject: emailSubject, field: field.key, value: v });
                      }}
                      onBlur={() => markTouched(field.key)}
                      aria-invalid={!!err}
                      className={`w-full bg-background border h-11 text-sm rounded-lg px-3 font-display text-foreground focus:outline-none ${errCls}`}
                    >
                      <option value="">{field.placeholder}</option>
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      value={formData[field.key] || ""}
                      onChange={(e) => setFormData((p) => ({ ...p, [field.key]: e.target.value }))}
                      onBlur={() => markTouched(field.key)}
                      placeholder={field.placeholder}
                      maxLength={200}
                      aria-invalid={!!err}
                      className={`bg-background h-11 text-sm rounded-lg ${errCls}`}
                    />
                  )}
                  {err && (
                    <p className="text-destructive text-[11px] font-display mt-1">{errors[field.key]}</p>
                  )}
                </motion.div>
              );
            })}

            <Button
              type="submit"
              disabled={sending || !isValid}
              className="w-full h-12 font-display font-semibold tracking-wide text-sm mt-3 rounded-full bg-foreground text-background md:hover:bg-foreground/90"
            >
              <Send size={14} />
              {sending ? "Sending…" : "Send inquiry"}
            </Button>

            <p className="text-foreground/40 text-[10px] font-display tracking-wide text-center pt-1">
              Replies within 24 hours. Direct from Devin.
            </p>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceInquiryDialog;
