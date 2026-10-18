"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

type RevealImageProps = {
  src: string;
  alt: string;
  /** Reveal length in seconds */
  duration?: number;
  className?: string;
  sizes?: string;
  onRevealComplete?: () => void;
};

const HIDDEN = { clipPath: "inset(0 0 100% 0)", opacity: 0.6, scale: 1.03 };
const SHOWN = { clipPath: "inset(0 0 0% 0)", opacity: 1, scale: 1 };

// Draws the image in top-to-bottom once it has loaded, like a sketch appearing on paper.
export default function RevealImage({
  src,
  alt,
  duration = 3.5,
  className = "",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  onRevealComplete,
}: RevealImageProps) {
  const reduceMotion = useReducedMotion();
  const [loaded, setLoaded] = useState(false);
  const revealed = loaded || reduceMotion;

  return (
    <motion.div
      className={`relative ${className}`}
      initial={HIDDEN}
      animate={revealed ? SHOWN : undefined}
      transition={reduceMotion ? { duration: 0 } : { duration, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={() => onRevealComplete?.()}
    >
      <Image
        src={src}
        alt={alt}
        fill
        preload
        sizes={sizes}
        onLoad={() => setLoaded(true)}
        className="object-contain mix-blend-multiply"
      />
    </motion.div>
  );
}
