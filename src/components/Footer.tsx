const Footer = () => (
  <footer className="border-t border-border/10 py-8 sm:py-12 px-5 mb-24 md:mb-0">
    <div className="max-w-6xl mx-auto flex flex-col items-center gap-4 sm:gap-6 sm:flex-row sm:justify-between">
      <p className="font-display font-bold text-base tracking-tight">
        <span className="text-foreground/80">DEVIN</span>
        <span className="text-primary ml-1">P.</span>
      </p>
      <div className="flex items-center gap-4 sm:gap-8 text-muted-foreground/60 text-[9px] sm:text-[10px] font-display tracking-[0.15em] uppercase flex-wrap justify-center">
        <a href="https://impactzonenj.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors duration-300">Impact Zone</a>
        <a href="https://drink2thirty.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors duration-300">2THIRTY</a>
        <a href="https://instagram.com/devinpolicastro" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors duration-300">Instagram</a>
        <a href="https://tiktok.com/@devinpolicastro" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors duration-300">TikTok</a>
        <a href="https://youtube.com/@devinpolicastro" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors duration-300">YouTube</a>
        <a href="https://poplme.co/fFOVmkEx" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors duration-300">Popl</a>
      </div>
      <p className="text-muted-foreground/40 text-xs font-body">
        © {new Date().getFullYear()} Devin Policastro
      </p>
    </div>
  </footer>
);

export default Footer;