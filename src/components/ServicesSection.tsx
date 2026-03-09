import { motion } from "framer-motion";
import { Dumbbell, Briefcase, Droplets, Camera, Handshake, DollarSign, ArrowRight } from "lucide-react";
import TiltCard from "@/components/effects/TiltCard";

interface Service {
  icon: React.ElementType;
  title: string;
  desc: string;
  price: string;
  tag: string;
  color: string;
}

const services: Service[] = [
  { icon: Briefcase, title: "Brand Consulting", desc: "I'll break down your brand, your content, and your revenue strategy. No fluff — just what works.", price: "Starting at $500", tag: "BUSINESS", color: "265 80% 65%" },
  { icon: Droplets, title: "2THIRTY Wholesale", desc: "Stock 2THIRTY at your gym, studio, or store. Zero sugar, 5-in-1 hydration mixer. Bulk pricing available.", price: "Request a Quote", tag: "PARTNERSHIP", color: "195 90% 55%" },
  { icon: Camera, title: "Influencer Collabs", desc: "If your brand fits my audience, let's create content that converts.", price: "Starting at $250", tag: "CONTENT", color: "340 80% 62%" },
  { icon: Handshake, title: "Paid Introductions", desc: "I know people across Bergen County and beyond. I'll connect you to the right person.", price: "$100–$500", tag: "NETWORK", color: "155 75% 48%" },
  { icon: DollarSign, title: "Brand Clarity Calls", desc: "30-minute call where I rip apart your brand and tell you exactly what to fix.", price: "$150 / 30 min", tag: "CONSULTING", color: "18 90% 58%" },
];

const ServicesSection = () => (
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
        <p className="text-primary/80 font-display text-[10px] tracking-[0.5em] uppercase mb-4 sm:mb-5">[ 06 — Services ]</p>
        <h2 className="font-display font-extrabold text-3xl sm:text-6xl lg:text-7xl leading-[0.88] mb-6 sm:mb-8 tracking-[-0.02em]">
          Work With Me.
          <br />
          <span className="text-muted-foreground">Or I'll Introduce</span>
          <br />
          <span className="text-muted-foreground">You to Someone</span>
          <br />
          <span className="gradient-text">Who Can.</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {services.map((service, i) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.7 }}
          >
            <TiltCard className="h-full" intensity={6}>
              <div
                className="h-full flex flex-col relative overflow-hidden rounded-lg transition-all duration-500 group cursor-default"
                style={{
                  background: `linear-gradient(145deg, hsl(225 20% 7% / 0.95) 0%, hsl(225 20% 5% / 0.8) 100%)`,
                  border: `1px solid hsl(${service.color} / 0.15)`,
                  boxShadow: `0 4px 24px hsl(225 30% 2% / 0.6), inset 0 1px 0 hsl(${service.color} / 0.08)`,
                }}
              >
                {/* Top accent bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(90deg, transparent, hsl(${service.color}), transparent)` }}
                />

                {/* Ambient glow */}
                <div
                  className="absolute inset-0 opacity-[0.06] group-hover:opacity-[0.14] transition-opacity duration-700"
                  style={{ background: `radial-gradient(ellipse at 50% 0%, hsl(${service.color}) 0%, transparent 70%)` }}
                />

                {/* Hover border glow */}
                <div
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ boxShadow: `inset 0 0 0 1px hsl(${service.color} / 0.4), 0 0 30px hsl(${service.color} / 0.12)` }}
                />

                <div className="relative z-10 p-5 sm:p-7 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-5 sm:mb-6">
                    <div
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-500"
                      style={{
                        background: `linear-gradient(135deg, hsl(${service.color} / 0.2) 0%, hsl(${service.color} / 0.08) 100%)`,
                        border: `1px solid hsl(${service.color} / 0.25)`,
                        boxShadow: `0 0 20px hsl(${service.color} / 0.15)`,
                      }}
                    >
                      <service.icon
                        size={20}
                        style={{ color: `hsl(${service.color})`, filter: `drop-shadow(0 0 6px hsl(${service.color} / 0.6))` }}
                      />
                    </div>
                    <span
                      className="text-[8px] sm:text-[9px] font-display font-bold tracking-[0.3em] uppercase px-2.5 py-1 rounded-full"
                      style={{
                        color: `hsl(${service.color})`,
                        background: `hsl(${service.color} / 0.1)`,
                        border: `1px solid hsl(${service.color} / 0.2)`,
                      }}
                    >
                      {service.tag}
                    </span>
                  </div>

                  <h3
                    className="font-display font-bold text-sm sm:text-base mb-2 sm:mb-3 transition-colors duration-300"
                    style={{ color: `hsl(${service.color} / 0.9)` }}
                  >
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-xs sm:text-sm mb-4 sm:mb-6 flex-1 leading-[1.7]">{service.desc}</p>

                  <div
                    className="flex items-center justify-between pt-4 sm:pt-5"
                    style={{ borderTop: `1px solid hsl(${service.color} / 0.12)` }}
                  >
                    <span
                      className="font-display font-bold text-xs sm:text-sm"
                      style={{ color: `hsl(${service.color})` }}
                    >
                      {service.price}
                    </span>
                    <button
                      className="flex items-center gap-1.5 text-[10px] sm:text-xs font-display font-semibold tracking-wider uppercase transition-all duration-300 group/btn"
                      style={{ color: `hsl(${service.color} / 0.6)` }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = `hsl(${service.color})`)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = `hsl(${service.color} / 0.6)`)}
                    >
                      Inquire
                      <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ServicesSection;
