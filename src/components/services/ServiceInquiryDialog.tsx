import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
}

const ServiceInquiryDialog = ({
  open,
  onOpenChange,
  title,
  subtitle,
  color,
  fields,
  emailSubject,
}: ServiceInquiryDialogProps) => {
  const [sending, setSending] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const initial: Record<string, string> = { name: "", email: "", phone: "" };
  fields.forEach((f) => {
    if (f.defaultValue) initial[f.key] = f.defaultValue;
  });
  const [formData, setFormData] = useState<Record<string, string>>(initial);

  const colorId = color.replace(/\s+/g, "-");

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

    try {
      const { data, error } = await supabase.functions.invoke("send-contact-email", {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: emailSubject,
          formData: customFields,
        },
      });

      if (error) throw error;
      toast.success("Inquiry sent! Devin will get back to you.");
      setFormData({ name: "", email: "", phone: "" });
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
        className="sm:max-w-lg bg-card border border-border/60 p-0 max-h-[92vh] overflow-y-auto rounded-2xl shadow-[0_30px_80px_-30px_hsl(30_20%_20%/0.35)]"
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
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-display font-semibold tracking-[0.14em] text-foreground/55 mb-1.5 block">
                  Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Your name"
                  required
                  maxLength={100}
                  className="bg-background border-border/60 h-11 text-sm rounded-lg"
                />
              </div>
              <div>
                <label className="text-[10px] font-display font-semibold tracking-[0.14em] text-foreground/55 mb-1.5 block">
                  Email *
                </label>
                <Input
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  type="email"
                  placeholder="you@email.com"
                  required
                  maxLength={255}
                  className="bg-background border-border/60 h-11 text-sm rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-display font-semibold tracking-[0.14em] text-foreground/55 mb-1.5 block">
                Phone
              </label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                placeholder="(201) 555-0123"
                maxLength={20}
                className="bg-background border-border/60 h-11 text-sm rounded-lg"
              />
            </div>

            {fields.map((field, i) => (
              <motion.div
                key={field.key}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <label className="text-[10px] font-display font-semibold tracking-[0.14em] text-foreground/55 mb-1.5 block">
                  {field.label}
                  {field.required ? " *" : ""}
                </label>
                {field.type === "textarea" ? (
                  <Textarea
                    value={formData[field.key] || ""}
                    onChange={(e) => setFormData((p) => ({ ...p, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    rows={field.rows || 3}
                    maxLength={500}
                    required={field.required}
                    className="bg-background border-border/60 resize-none text-sm rounded-lg"
                  />
                ) : field.type === "select" ? (
                  <select
                    value={formData[field.key] || ""}
                    onChange={(e) => setFormData((p) => ({ ...p, [field.key]: e.target.value }))}
                    required={field.required}
                    className="w-full bg-background border border-border/60 h-11 text-sm rounded-lg px-3 font-display text-foreground focus:outline-none"
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
                    placeholder={field.placeholder}
                    maxLength={200}
                    required={field.required}
                    className="bg-background border-border/60 h-11 text-sm rounded-lg"
                  />
                )}
              </motion.div>
            ))}

            <Button
              type="submit"
              disabled={sending}
              className="w-full h-12 font-display font-semibold tracking-wide text-sm mt-3 rounded-full bg-foreground text-background hover:bg-foreground/90"
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
