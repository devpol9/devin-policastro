import { useEffect } from "react";
import Lenis from "lenis";

const SmoothScroll = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Handle anchor clicks for smooth scrolling
    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"], button[data-scroll]');
      if (!anchor) return;
      
      const href = anchor.getAttribute("href") || anchor.getAttribute("data-scroll");
      if (!href?.startsWith("#")) return;
      
      const el = document.querySelector(href);
      if (el) {
        e.preventDefault();
        lenis.scrollTo(el as HTMLElement, { offset: -80 });
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      lenis.destroy();
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return null;
};

export default SmoothScroll;
