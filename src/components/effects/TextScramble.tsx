import { useEffect, useRef, useState } from "react";

interface TextScrambleProps {
  text: string;
  className?: string;
  delay?: number;
}

const chars = "ABCDEFGHJKLNPQRSTUVXYZ0123456789!@#$%&*";

const TextScramble = ({ text, className = "", delay = 0 }: TextScrambleProps) => {
  const [display, setDisplay] = useState(text.replace(/[^\s]/g, " "));
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setTimeout(() => setStarted(true), delay);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay, started]);

  useEffect(() => {
    if (!started) return;

    let frame = 0;
    const totalFrames = 20;

    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;

      const result = text
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          if (i / text.length < progress) return char;
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");

      setDisplay(result);

      if (frame >= totalFrames) {
        clearInterval(interval);
        setDisplay(text);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [started, text]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
};

export default TextScramble;
