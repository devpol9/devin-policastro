import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, X } from "lucide-react";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    const fieldDetails = fields
      .map((f) => `${f.label}: ${formData[f.key] || "N/A"}`)
      .join("\n");

    try {
      const { data, error } = await supabase.functions.invoke("send-contact-email", {
        body: {
          name: formData.name,
          email: formData.email,
          subject: emailSubject,
          message: `Phone: ${formData.phone || "N/A"}\n\n${fieldDetails}`,
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
        {/* Header accent */}
        <div
          className="h-1 w-full"
          style={{ background: `linear-gradient(90deg, transparent, hsl(${color}), transparent)` }}
        />
        <div className="p-6 sm:p-8">
          <DialogHeader className="mb-6">
            <DialogTitle
              className="font-display font-extrabold text-xl sm:text-2xl"
              style={{ color: `hsl(${color})` }}
            >
              {title}
            </DialogTitle>
            <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-display font-semibold tracking-[0.3em] uppercase text-muted-foreground/70 mb-1.5 block">
                  Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Your name"
                  required
                  maxLength={100}
                  className="bg-background/50 border-border/20 focus:border-primary/30 h-11 text-sm"
                />
              </div>
              <div>
                <label className="text-[10px] font-display font-semibold tracking-[0.3em] uppercase text-muted-foreground/70 mb-1.5 block">
                  Email *
                </label>
                <Input
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  type="email"
                  placeholder="you@email.com"
                  required
                  maxLength={255}
                  className="bg-background/50 border-border/20 focus:border-primary/30 h-11 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-display font-semibold tracking-[0.3em] uppercase text-muted-foreground/70 mb-1.5 block">
                Phone
              </label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                placeholder="(201) 555-0123"
                maxLength={20}
                className="bg-background/50 border-border/20 focus:border-primary/30 h-11 text-sm"
              />
            </div>

            {fields.map((field, i) => (
              <motion.div
                key={field.key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <label className="text-[10px] font-display font-semibold tracking-[0.3em] uppercase text-muted-foreground/70 mb-1.5 block">
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
                    className="bg-background/50 border-border/20 focus:border-primary/30 resize-none text-sm"
                  />
                ) : (
                  <Input
                    value={formData[field.key] || ""}
                    onChange={(e) => setFormData((p) => ({ ...p, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    maxLength={200}
                    required={field.required}
                    className="bg-background/50 border-border/20 focus:border-primary/30 h-11 text-sm"
                  />
                )}
              </motion.div>
            ))}

            <Button
              type="submit"
              disabled={sending}
              className="w-full h-12 font-display font-semibold tracking-wide text-sm"
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
