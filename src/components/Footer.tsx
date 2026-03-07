const Footer = () => (
  <footer className="border-t border-border/10 py-10 px-4 mb-16 md:mb-0">
    <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="font-display font-bold text-lg tracking-tight">
        <span className="text-foreground">DEVIN</span>
        <span className="text-primary ml-1">P.</span>
      </p>
      <div className="flex items-center gap-6 text-muted-foreground text-xs flex-wrap justify-center">
        <a href="https://impactzonenj.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Impact Zone NJ</a>
        <a href="https://drink2thirty.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">2THIRTY</a>
        <a href="https://instagram.com/devinpolicastro" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Instagram</a>
        <a href="https://tiktok.com/@devinpolicastro" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">TikTok</a>
        <a href="https://youtube.com/@devinpolicastro" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">YouTube</a>
        <a href="https://poplme.co/fFOVmkEx" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Popl</a>
      </div>
      <p className="text-muted-foreground text-sm">
        © {new Date().getFullYear()} Devin Policastro. Built different.
      </p>
    </div>
  </footer>
);

export default Footer;
