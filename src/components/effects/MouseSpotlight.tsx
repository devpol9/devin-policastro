import { useEffect, useRef } from "react";

const MouseSpotlight = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (ref.current) {
        ref.current.style.setProperty("--mouse-x", `${e.clientX}px`);
        ref.current.style.setProperty("--mouse-y", `${e.clientY}px`);
      }
    };
    document.addEventListener("mousemove", handleMove);
    return () => document.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-0 pointer-events-none hidden lg:block"
      style={{
        background: `radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), hsl(210 100% 55% / 0.04), transparent 40%)`,
      }}
    />
  );
};

export default MouseSpotlight;
