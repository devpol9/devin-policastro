import { motion } from "framer-motion";
import { Dumbbell, Briefcase, Droplets, Camera, Handshake, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Service {
  icon: React.ElementType;
  title: string;
  desc: string;
  price: string;
}

const services: Service[] = [
  { icon: Dumbbell, title: "Gym Membership Referrals", desc: "Get a deal at Impact Zone NJ — Bergen County's biggest gym. I'll make the intro and get you set up.", price: "Free Referral" },
  { icon: Briefcase, title: "Brand Consulting", desc: "I'll break down your brand, your content, and your revenue strategy. No fluff — just what works.", price: "Starting at $500" },
  { icon: Droplets, title: "2THIRTY Wholesale & Partnerships", desc: "Want to stock 2THIRTY at your gym, studio, or store? Let's talk bulk pricing and co-branded deals.", price: "Request a Quote" },
  { icon: Camera, title: "Influencer Collabs", desc: "If your brand fits my audience, let's create content that converts. I don't do weak partnerships.", price: "Starting at $250" },
  { icon: Handshake, title: "Paid Introductions", desc: "I know people. You need people. I'll connect you to the right person for your business, deal, or opportunity.", price: "$100–$500" },
  { icon: DollarSign, title: "Brand Clarity Calls", desc: "30-minute call where I rip apart your brand and tell you exactly what to fix. Direct, actionable, zero BS.", price: "$150 / 30 min" },
];

const ServicesSection = () => (
  <section id="services" className="section-padding">
    <div className="container-tight">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <p className="text-primary font-display text-sm tracking-[0.25em] uppercase mb-3">Work With Me</p>
        <h2 className="font-display font-bold text-3xl sm:text-5xl mb-4">
          Let's Build Something.
          <br />
          <span className="text-muted-foreground">Or I'll Introduce You to Someone Who Can.</span>
        </h2>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((service, i) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="glass-card-hover p-6 flex flex-col"
          >
            <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <service.icon size={22} className="text-primary" />
            </div>
            <h3 className="font-display font-semibold text-lg mb-2">{service.title}</h3>
            <p className="text-muted-foreground text-sm mb-4 flex-1 leading-relaxed">{service.desc}</p>
            <div className="flex items-center justify-between">
              <span className="text-primary font-display font-semibold text-sm">{service.price}</span>
              <Button variant="glass" size="sm">
                Inquire
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ServicesSection;
