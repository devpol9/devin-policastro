import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Paintbrush, Shield, Sun, Gauge, Sparkles, Car, ArrowRight, ExternalLink } from "lucide-react";
import ServiceInquiryDialog from "./ServiceInquiryDialog";

const COLOR = "0 85% 60%";

interface AutoService {
  icon: React.ElementType;
  name: string;
  desc: string;
  link: string;
}

const autoServices: AutoService[] = [
  {
    icon: Paintbrush,
    name: "Vinyl Wrap",
    desc: "Full or partial wraps in any color, finish, or texture. Complete vehicle transformation.",
    link: "https://nextgenautonj.com/vinyl-wrap/",
  },
  {
    icon: Shield,
    name: "Paint Protection Film (PPF)",
    desc: "Invisible armor against scratches, chips, and environmental damage. Preserve factory paint.",
    link: "https://nextgenautonj.com/paint-protection-film/",
  },
  {
    icon: Sparkles,
    name: "Ceramic Coating",
    desc: "Advanced nano-coating for unparalleled protection and a brilliant, lasting shine.",
    link: "https://nextgenautonj.com/ceramic-coating/",
  },
  {
    icon: Sun,
    name: "Window Tinting",
    desc: "Premium window films for privacy, UV protection, and a sleek look. Legal-compliant options.",
    link: "https://nextgenautonj.com/windows-tints/",
  },
  {
    icon: Gauge,
    name: "Tuning & Performance",
    desc: "ECU remapping, exhaust upgrades, and performance tuning. Unlock your vehicle's full potential.",
    link: "https://nextgenautonj.com/tuning-and-performance/",
  },
  {
    icon: Car,
    name: "Full Customization",
    desc: "Interior, exterior, wheels, lighting — full luxury customization for high-end vehicles.",
    link: "https://nextgenautonj.com/",
  },
];

interface AutomotiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AutomotiveDialog = ({ open, onOpenChange }: AutomotiveDialogProps) => {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>("");

  const openInquiry = (serviceName: string) => {
    setSelectedService(serviceName);
    setInquiryOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl bg-card border-border/30 p-0 overflow-hidden max-h-[85vh] overflow-y-auto">
          <div
            className="h-1 w-full"
            style={{ background: `linear-gradient(90deg, transparent, hsl(${COLOR}), transparent)` }}
          />
          <div className="p-6 sm:p-8">
            <DialogHeader className="mb-6">
              <DialogTitle className="font-display font-extrabold text-xl sm:text-2xl" style={{ color: `hsl(${COLOR})` }}>
                Automotive Services
              </DialogTitle>
              <p className="text-muted-foreground text-sm mt-1">
                Premium vehicle customization through NextGen Automotive — I'll connect you directly and make sure you're taken care of.
              </p>
            </DialogHeader>

            <div className="grid gap-3">
              {autoServices.map((service, i) => {
                const Icon = service.icon;
                return (
                  <motion.div
                    key={service.name}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                    className="group relative overflow-hidden rounded-lg transition-all duration-500 cursor-default"
                    style={{
                      background: `linear-gradient(145deg, hsl(225 20% 7% / 0.95) 0%, hsl(225 20% 5% / 0.8) 100%)`,
                      border: `1px solid hsl(${COLOR} / 0.15)`,
                    }}
                  >
                    <div
                      className="absolute top-0 left-0 right-0 h-[1px] opacity-40 group-hover:opacity-80 transition-opacity duration-500"
                      style={{ background: `linear-gradient(90deg, transparent, hsl(${COLOR}), transparent)` }}
                    />
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-[0.08] transition-opacity duration-700"
                      style={{ background: `radial-gradient(ellipse at 50% 0%, hsl(${COLOR}) 0%, transparent 70%)` }}
                    />

                    <div className="relative z-10 p-4 sm:p-5 flex items-center gap-4">
                      <div
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500"
                        style={{
                          background: `hsl(${COLOR} / 0.12)`,
                          border: `1px solid hsl(${COLOR} / 0.2)`,
                        }}
                      >
                        <Icon size={18} style={{ color: `hsl(${COLOR})` }} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-display font-bold text-sm" style={{ color: `hsl(${COLOR} / 0.9)` }}>
                          {service.name}
                        </h4>
                        <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed line-clamp-2">{service.desc}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={service.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                          style={{
                            background: `hsl(${COLOR} / 0.1)`,
                            border: `1px solid hsl(${COLOR} / 0.2)`,
                            color: `hsl(${COLOR} / 0.6)`,
                          }}
                        >
                          <ExternalLink size={13} />
                        </a>
                        <button
                          onClick={() => openInquiry(service.name)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] sm:text-xs font-display font-semibold tracking-wider uppercase transition-all duration-300 hover:scale-[1.02]"
                          style={{
                            background: `hsl(${COLOR})`,
                            color: `hsl(225 25% 3%)`,
                          }}
                        >
                          Inquire
                          <ArrowRight size={11} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-6 p-4 rounded-lg text-center" style={{ background: `hsl(${COLOR} / 0.06)`, border: `1px solid hsl(${COLOR} / 0.15)` }}>
              <p className="text-xs text-muted-foreground">
                All services through{" "}
                <a href="https://nextgenautonj.com" target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline" style={{ color: `hsl(${COLOR})` }}>
                  NextGen Automotive
                </a>{" "}
                — 563 Piermont Road, Closter, NJ
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ServiceInquiryDialog
        open={inquiryOpen}
        onOpenChange={setInquiryOpen}
        title={`${selectedService} Inquiry`}
        subtitle="I'll connect you with the NextGen team and make sure you're taken care of."
        color={COLOR}
        emailSubject={`Automotive Inquiry: ${selectedService}`}
        fields={[
          { key: "vehicle", label: "Vehicle (Year / Make / Model)", placeholder: "2024 BMW M4", type: "input", required: true },
          { key: "service-details", label: "What are you looking for?", placeholder: "Full body PPF, color change wrap, ceramic...", type: "textarea", rows: 3, required: true },
          { key: "budget", label: "Budget range", placeholder: "$1K-$3K, $3K-$5K, $5K+...", type: "input" },
          { key: "timeline", label: "When do you need this done?", placeholder: "ASAP, within a month, flexible...", type: "input" },
        ]}
      />
    </>
  );
};

export default AutomotiveDialog;
