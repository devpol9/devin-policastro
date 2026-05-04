import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Briefcase, Camera, Handshake, Dumbbell,
  ArrowRight, Factory, Car, CreditCard,
  type LucideIcon,
} from "lucide-react";

interface ServiceTab {
  key: string;
  label: string;
  icon: LucideIcon;
  color: string;
  route: string;
}

const tabs: ServiceTab[] = [
  { key: "consulting", label: "Consulting", icon: Briefcase, color: "270 16% 50%", route: "/consulting" },
  { key: "manufacturing", label: "Manufacturing", icon: Factory, color: "270 16% 48%", route: "/manufacturing" },
  { key: "content", label: "Content", icon: Camera, color: "350 22% 55%", route: "/content" },
  { key: "automotive", label: "Automotive", icon: Car, color: "12 45% 48%", route: "/automotive" },
  { key: "financing", label: "Financing", icon: CreditCard, color: "210 22% 50%", route: "/financing" },
  { key: "networking", label: "Networking", icon: Handshake, color: "140 18% 42%", route: "/networking" },
  { key: "fitness", label: "Fitness", icon: Dumbbell, color: "24 32% 52%", route: "/fitness" },
];

const ServicesSection = () => {
  const navigate = useNavigate();

  return (
    <section id="services" className="section-padding relative">
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 sm:mb-20"
        >
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 60 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="h-px bg-primary/60 mb-8 sm:mb-10"
          />
          <p className="text-primary/80 font-display text-[10px] tracking-[0.5em] uppercase mb-4 sm:mb-5">Services</p>
          <h2 className="font-display font-extrabold text-3xl sm:text-6xl lg:text-7xl leading-[0.88] mb-6 sm:mb-8 tracking-[-0.02em]">
            Let's
            <br />
            <span className="gradient-text">Work.</span>
          </h2>
        </motion.div>

        {/* Service Navigation */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {tabs.map((tab, i) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate(tab.route)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-display font-semibold tracking-wide transition-all duration-300 hover:scale-[1.03]"
                style={{
                  background: `hsl(33 20% 92% / 0.6)`,
                  border: `1px solid hsl(30 14% 80% / 0.5)`,
                  color: `hsl(220 10% 55%)`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `hsl(${tab.color} / 0.2)`;
                  e.currentTarget.style.borderColor = `hsl(${tab.color} / 0.5)`;
                  e.currentTarget.style.color = `hsl(${tab.color})`;
                  e.currentTarget.style.boxShadow = `0 0 20px hsl(${tab.color} / 0.15)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `hsl(33 20% 92% / 0.6)`;
                  e.currentTarget.style.borderColor = `hsl(30 14% 80% / 0.5)`;
                  e.currentTarget.style.color = `hsl(220 10% 55%)`;
                  e.currentTarget.style.boxShadow = `none`;
                }}
              >
                <Icon size={14} />
                {tab.label}
                <ArrowRight size={11} className="opacity-50" />
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
