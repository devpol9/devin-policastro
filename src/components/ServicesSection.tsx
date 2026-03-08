import { motion } from "framer-motion";
import { Dumbbell, Briefcase, Droplets, Camera, Handshake, DollarSign, ArrowRight } from "lucide-react";
import TiltCard from "@/components/effects/TiltCard";

interface Service {
  icon: React.ElementType;
  title: string;
  desc: string;
  price: string;
  tag: string;
}

const services: Service[] = [
  { icon: Dumbbell, title: "Impact Zone Membership", desc: "Bergen County's biggest gym — 51,000 sq ft in Norwood, NJ. No contracts, world-class equipment, infrared saunas, cold plunges, hot yoga.", price: "$139/mo", tag: "FITNESS" },
  { icon: Briefcase, title: "Brand Consulting", desc: "I'll break down your brand, your content, and your revenue strategy. No fluff — just what works.", price: "Starting at $500", tag: "BUSINESS" },
  { icon: Droplets, title: "2THIRTY Wholesale", desc: "Stock 2THIRTY at your gym, studio, or store. Zero sugar, 5-in-1 hydration mixer. Bulk pricing available.", price: "Request a Quote", tag: "PARTNERSHIP" },
  { icon: Camera, title: "Influencer Collabs", desc: "If your brand fits my audience, let's create content that converts.", price: "Starting at $250", tag: "CONTENT" },
  { icon: Handshake, title: "Paid Introductions", desc: "I know people across Bergen County and beyond. I'll connect you to the right person.", price: "$100–$500", tag: "NETWORK" },
  { icon: DollarSign, title: "Brand Clarity Calls", desc: "30-minute call where I rip apart your brand and tell you exactly what to fix.", price: "$150 / 30 min", tag: "CONSULTING" },
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
              <div className="glass-card p-5 sm:p-7 flex flex-col h-full relative overflow-hidden hover:border-primary/20 transition-all duration-700 group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/4 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/8 flex items-center justify-center group-hover:bg-primary/15 group-hover:scale-105 transition-all duration-500">
                      <service.icon size={18} className="text-primary/70 group-hover:text-primary transition-colors duration-500" />
                    </div>
                    <span className="text-[8px] sm:text-[9px] font-display font-bold tracking-[0.3em] text-muted-foreground/60">{service.tag}</span>
                  </div>

                  <h3 className="font-display font-bold text-sm sm:text-base mb-2 sm:mb-3 group-hover:text-primary transition-colors duration-300">{service.title}</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm mb-4 sm:mb-6 flex-1 leading-[1.7]">{service.desc}</p>

                  <div className="flex items-center justify-between pt-4 sm:pt-5 border-t border-border/15">
                    <span className="text-primary font-display font-bold text-xs sm:text-sm">{service.price}</span>
                    <button className="flex items-center gap-1.5 text-[10px] sm:text-xs font-display font-medium tracking-wider text-muted-foreground hover:text-primary transition-colors duration-300 group/btn">
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