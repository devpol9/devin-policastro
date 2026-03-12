import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Paintbrush, Shield, Sun, Gauge, Sparkles, Car, ArrowRight, ExternalLink, Disc, Sofa, Lightbulb } from "lucide-react";
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
    desc: "Full or partial wraps in any color, finish, or texture.",
    link: "https://nextgenautonj.com/vinyl-wrap/",
  },
  {
    icon: Shield,
    name: "Paint Protection Film (PPF)",
    desc: "Invisible armor against scratches, chips, and damage.",
    link: "https://nextgenautonj.com/paint-protection-film/",
  },
  {
    icon: Sparkles,
    name: "Ceramic Coating",
    desc: "Nano-coating with paint correction for lasting shine.",
    link: "https://nextgenautonj.com/ceramic-coating/",
  },
  {
    icon: Sun,
    name: "Window Tinting",
    desc: "Premium films — 99% UV block, privacy, sleek look.",
    link: "https://nextgenautonj.com/windows-tints/",
  },
  {
    icon: Gauge,
    name: "Tuning & Performance",
    desc: "ECU remapping, downpipes, exhaust. More power.",
    link: "https://nextgenautonj.com/tuning-and-performance/",
  },
  {
    icon: Disc,
    name: "Powder Coating",
    desc: "Wheels, calipers, metal surfaces. Durable finish.",
    link: "https://nextgenautonj.com/",
  },
  {
    icon: Sofa,
    name: "Custom Interiors",
    desc: "Luxury upholstery, stitching, trim, and materials.",
    link: "https://nextgenautonj.com/",
  },
  {
    icon: Lightbulb,
    name: "Exterior Styling",
    desc: "Aero kits, spoilers, diffusers, custom lighting.",
    link: "https://nextgenautonj.com/",
  },
  {
    icon: Car,
    name: "Full Build / Customization",
    desc: "Complete builds — wheels, suspension, body, interior.",
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
        <DialogContent className="sm:max-w-2xl bg-card border-border/30 p-0 overflow-hidden">
          <div
            className="h-1 w-full shrink-0"
            style={{ background: `linear-gradient(90deg, transparent, hsl(${COLOR}), transparent)` }}
          />
          <div className="p-4 sm:p-6">
            <DialogHeader className="mb-4">
              <DialogTitle className="font-display font-extrabold text-lg sm:text-2xl" style={{ color: `hsl(${COLOR})` }}>
                Automotive Services
              </DialogTitle>
              <p className="text-muted-foreground text-xs sm:text-sm mt-1">
                Premium vehicle customization through NextGen Automotive — I'll connect you directly.
              </p>
            </DialogHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {autoServices.map((service, i) => {
                const Icon = service.icon;
                return (
                  <motion.div
                    key={service.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                    className="group relative overflow-hidden rounded-lg transition-all duration-500"
                    style={{
                      background: `linear-gradient(145deg, hsl(225 20% 7% / 0.95) 0%, hsl(225 20% 5% / 0.8) 100%)`,
                      border: `1px solid hsl(${COLOR} / 0.15)`,
                    }}
                  >
                    <div
                      className="absolute top-0 left-0 right-0 h-[1px] opacity-30 group-hover:opacity-70 transition-opacity duration-500"
                      style={{ background: `linear-gradient(90deg, transparent, hsl(${COLOR}), transparent)` }}
                    />

                    <div className="relative z-10 p-3 sm:p-4">
                      <div className="flex items-start gap-3 mb-2">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{
                            background: `hsl(${COLOR} / 0.12)`,
                            border: `1px solid hsl(${COLOR} / 0.2)`,
                          }}
                        >
                          <Icon size={14} style={{ color: `hsl(${COLOR})` }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-display font-bold text-xs sm:text-sm leading-tight" style={{ color: `hsl(${COLOR} / 0.9)` }}>
                            {service.name}
                          </h4>
                          <p className="text-muted-foreground text-[10px] sm:text-xs mt-0.5 leading-snug">{service.desc}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 mt-2">
                        <a
                          href={service.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-7 h-7 rounded flex items-center justify-center transition-all duration-300 hover:scale-110"
                          style={{
                            background: `hsl(${COLOR} / 0.1)`,
                            border: `1px solid hsl(${COLOR} / 0.2)`,
                            color: `hsl(${COLOR} / 0.6)`,
                          }}
                        >
                          <ExternalLink size={11} />
                        </a>
                        <button
                          onClick={() => openInquiry(service.name)}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded text-[10px] sm:text-xs font-display font-semibold tracking-wider uppercase transition-all duration-300 hover:scale-[1.02]"
                          style={{
                            background: `hsl(${COLOR})`,
                            color: `hsl(225 25% 3%)`,
                          }}
                        >
                          Inquire
                          <ArrowRight size={10} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-4 p-3 rounded-lg text-center" style={{ background: `hsl(${COLOR} / 0.06)`, border: `1px solid hsl(${COLOR} / 0.15)` }}>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
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
          { key: "service-details", label: "What are you looking for?", placeholder: "Full body PPF, color change wrap, ceramic...", type: "textarea", rows: 2, required: true },
          { key: "budget", label: "Budget range", placeholder: "$1K-$3K, $3K-$5K, $5K+...", type: "input" },
          { key: "timeline", label: "When do you need this done?", placeholder: "ASAP, within a month, flexible...", type: "input" },
        ]}
      />
    </>
  );
};

export default AutomotiveDialog;
