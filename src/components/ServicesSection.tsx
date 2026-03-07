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
  { icon: Dumbbell, title: "Impact Zone Membership", desc: "Bergen County's biggest gym — 51,000 sq ft in Norwood, NJ. No contracts, world-class equipment, infrared saunas, cold plunges, hot yoga, and more. I'll get you set up.", price: "$139/mo", tag: "FITNESS" },
  { icon: Briefcase, title: "Brand Consulting", desc: "I'll break down your brand, your content, and your revenue strategy. No fluff — just what works. I've built 2THIRTY and Impact Zone from the ground up.", price: "Starting at $500", tag: "BUSINESS" },
  { icon: Droplets, title: "2THIRTY Wholesale", desc: "Want to stock 2THIRTY at your gym, studio, or store? Zero sugar, 5-in-1 hydration mixer. Let's talk bulk pricing and co-branded deals.", price: "Request a Quote", tag: "PARTNERSHIP" },
  { icon: Camera, title: "Influencer Collabs", desc: "If your brand fits my audience, let's create content that converts. I don't do weak partnerships.", price: "Starting at $250", tag: "CONTENT" },
  { icon: Handshake, title: "Paid Introductions", desc: "I know people across Bergen County and beyond. You need people. I'll connect you to the right person for your business or deal.", price: "$100–$500", tag: "NETWORK" },
  { icon: DollarSign, title: "Brand Clarity Calls", desc: "30-minute call where I rip apart your brand and tell you exactly what to fix. Direct, actionable, zero BS.", price: "$150 / 30 min", tag: "CONSULTING" },
];

const ServicesSection = () => (
  <section id="services" className="section-padding relative">
    <div className="container-tight">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: 80 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="h-px bg-primary mb-8"
        />
        <p className="text-primary font-display text-xs tracking-[0.4em] uppercase mb-4">[ 06 — Services ]</p>
        <h2 className="font-display font-bold text-4xl sm:text-6xl lg:text-7xl leading-[0.9] mb-6">
          Work With Me.
          <br />
          <span className="text-muted-foreground">Or I'll Introduce</span>
          <br />
          <span className="text-muted-foreground">You to Someone</span>
          <br />
          <span className="gradient-text">Who Can.</span>
        </h2>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((service, i) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
          >
            <TiltCard className="h-full" intensity={6}>
              <div className="glass-card p-7 flex flex-col h-full relative overflow-hidden border border-border/20 hover:border-primary/30 transition-all duration-500 group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                      <service.icon size={24} className="text-primary" />
                    </div>
                    <span className="text-[10px] font-display font-bold tracking-[0.2em] text-muted-foreground">{service.tag}</span>
                  </div>

                  <h3 className="font-display font-bold text-lg mb-3 group-hover:text-primary transition-colors">{service.title}</h3>
                  <p className="text-muted-foreground text-sm mb-6 flex-1 leading-relaxed">{service.desc}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-border/20">
                    <span className="text-primary font-display font-bold text-sm">{service.price}</span>
                    <button className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group/btn">
                      Inquire
                      <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
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
