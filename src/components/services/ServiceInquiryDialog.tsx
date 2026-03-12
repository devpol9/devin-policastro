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
  type: "input" | "textarea";
  required?: boolean;
  rows?: number;
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
  const [formData, setFormData] = useState<Record<string, string>>({
    name: "",
    email: "",
    phone: "",
  });

  const colorId = color.replace(/\s+/g, "-");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      <DialogContent className="sm:max-w-lg bg-card border-border/30 p-0 overflow-hidden">
        <style>{`
          .inquiry-${colorId} input:focus,
          .inquiry-${colorId} textarea:focus {
            border-color: hsl(${color} / 0.4) !important;
            box-shadow: 0 0 0 1px hsl(${color} / 0.15);
          }
        `}</style>

        {/* Header accent */}
        <div
          className="h-1 w-full shrink-0"
          style={{ background: `linear-gradient(90deg, transparent, hsl(${color}), transparent)` }}
        />
        <div className={`p-5 sm:p-8 inquiry-${colorId}`}>
          <DialogHeader className="mb-5">
            <DialogTitle
              className="font-display font-extrabold text-lg sm:text-2xl"
              style={{ color: `hsl(${color})` }}
            >
              {title}
            </DialogTitle>
            <p className="text-muted-foreground text-xs sm:text-sm mt-1">{subtitle}</p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div>
                <label className="text-[9px] sm:text-[10px] font-display font-semibold tracking-[0.3em] uppercase text-muted-foreground/70 mb-1 block">
                  Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Your name"
                  required
                  maxLength={100}
                  className="bg-background/50 border-border/20 h-10 text-sm"
                />
              </div>
              <div>
                <label className="text-[9px] sm:text-[10px] font-display font-semibold tracking-[0.3em] uppercase text-muted-foreground/70 mb-1 block">
                  Email *
                </label>
                <Input
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  type="email"
                  placeholder="you@email.com"
                  required
                  maxLength={255}
                  className="bg-background/50 border-border/20 h-10 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-[9px] sm:text-[10px] font-display font-semibold tracking-[0.3em] uppercase text-muted-foreground/70 mb-1 block">
                Phone
              </label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                placeholder="(201) 555-0123"
                maxLength={20}
                className="bg-background/50 border-border/20 h-10 text-sm"
              />
            </div>

            {fields.map((field, i) => (
              <motion.div
                key={field.key}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <label className="text-[9px] sm:text-[10px] font-display font-semibold tracking-[0.3em] uppercase text-muted-foreground/70 mb-1 block">
                  {field.label}
                  {field.required ? " *" : ""}
                </label>
                {field.type === "textarea" ? (
                  <Textarea
                    value={formData[field.key] || ""}
                    onChange={(e) => setFormData((p) => ({ ...p, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    rows={field.rows || 2}
                    maxLength={500}
                    required={field.required}
                    className="bg-background/50 border-border/20 resize-none text-sm"
                  />
                ) : (
                  <Input
                    value={formData[field.key] || ""}
                    onChange={(e) => setFormData((p) => ({ ...p, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    maxLength={200}
                    required={field.required}
                    className="bg-background/50 border-border/20 h-10 text-sm"
                  />
                )}
              </motion.div>
            ))}

            <Button
              type="submit"
              disabled={sending}
              className="w-full h-11 font-display font-semibold tracking-wide text-sm mt-2"
              style={{
                background: `hsl(${color})`,
                color: "hsl(225 25% 3%)",
              }}
            >
              <Send size={14} />
              {sending ? "Sending..." : "Send Inquiry"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceInquiryDialog;
