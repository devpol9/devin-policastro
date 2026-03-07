const Footer = () => (
  <footer className="border-t border-border/10 py-10 px-4 mb-16 md:mb-0">
    <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="font-display font-bold text-lg tracking-tight">
        <span className="text-foreground">DEVIN</span>
        <span className="text-primary ml-1">P.</span>
      </p>
      <p className="text-muted-foreground text-sm">
        © {new Date().getFullYear()} Devin Policastro. Built different.
      </p>
    </div>
  </footer>
);

export default Footer;
