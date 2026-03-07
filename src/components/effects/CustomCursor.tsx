import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      setHidden(false);
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
      if (followerRef.current) {
        followerRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    const addHover = () => setHovering(true);
    const removeHover = () => setHovering(false);
    const hideCursor = () => setHidden(true);

    document.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseleave", hideCursor);

    const interactiveElements = document.querySelectorAll("a, button, [role='button'], input, textarea, select");
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", addHover);
      el.addEventListener("mouseleave", removeHover);
    });

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", hideCursor);
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", addHover);
        el.removeEventListener("mouseleave", removeHover);
      });
    };
  }, []);

  return (
    <div className="hidden lg:block">
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 z-[9999] pointer-events-none transition-opacity duration-300 ${hidden ? "opacity-0" : "opacity-100"}`}
        style={{ willChange: "transform" }}
      >
        <div
          className={`-translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary transition-all duration-200 ${
            hovering ? "w-12 h-12 bg-primary/10" : "w-4 h-4 bg-primary"
          }`}
        />
      </div>
      <div
        ref={followerRef}
        className={`fixed top-0 left-0 z-[9998] pointer-events-none transition-all duration-[600ms] ease-out ${hidden ? "opacity-0" : "opacity-100"}`}
        style={{ willChange: "transform" }}
      >
        <div className={`-translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 ${hovering ? "w-20 h-20" : "w-10 h-10"} transition-all duration-500`} />
      </div>
    </div>
  );
};

export default CustomCursor;
