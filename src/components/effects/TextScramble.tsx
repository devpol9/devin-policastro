interface TextScrambleProps {
  text: string;
  className?: string;
  delay?: number;
}

// Tech "scramble" decoding effect removed — now renders plain text for a clean, modern look.
const TextScramble = ({ text, className = "" }: TextScrambleProps) => {
  return <span className={className}>{text}</span>;
};

export default TextScramble;
