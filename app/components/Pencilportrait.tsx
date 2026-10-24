"use client";

import { useEffect, useId, useRef, useState } from "react";

type Size = { w: number; h: number };

// The grey sketch fades in, then the apple turns red
const FADE_START = 0.15;
const FADE_TIME = 1.4;
const COLOR_START = 1.5;
const COLOR_TIME = 1.2;
const CUE_AT = FADE_START + 0.3;

type Props = {
  image?: string;
  className?: string;
  // Fires partway through the reveal, so surrounding content can follow it in
  onReveal?: () => void;
};

export default function PencilPortrait({ image = "/jobs.png", className = "", onReveal }: Props) {
  const [size, setSize] = useState<Size | null>(null);
  const onRevealRef = useRef(onReveal);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  useEffect(() => {
    onRevealRef.current = onReveal;
  }, [onReveal]);

  // Wait for the image itself so nothing animates over a blank frame
  useEffect(() => {
    const img = new Image();
    img.onload = () => setSize({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = console.error;
    img.src = image;
  }, [image]);

  useEffect(() => {
    if (!size) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => onRevealRef.current?.(), reduce ? 0 : CUE_AT * 1000);
    return () => clearTimeout(t);
  }, [size]);

  if (!size) return <div className={className} style={{ aspectRatio: "1 / 1" }} aria-hidden />;

  const { w, h } = size;
  const id = (name: string) => `${uid}-${name}`;

  return (
    <figure className={`pencil ${className}`}>
      <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Pencil sketch portrait of Steve Jobs holding a red apple">
        <defs>
          <filter id={id("gray")} colorInterpolationFilters="sRGB">
            <feColorMatrix type="saturate" values="0" />
          </filter>

          {/* dissolve the square edges of the drawing into the page */}
          <radialGradient id={id("vignette-fill")} cx="50%" cy="42%" r="62%">
            <stop offset="0.72" stopColor="#fff" />
            <stop offset="1" stopColor="#000" />
          </radialGradient>
          <mask id={id("vignette")} maskUnits="userSpaceOnUse" x={0} y={0} width={w} height={h}>
            <rect width={w} height={h} fill={`url(#${id("vignette-fill")})`} />
          </mask>
        </defs>

        {/* the colour layer fades in over the grey one; only the apple differs. The whole svg multiplies onto the page so the paper's white disappears */}
        <g mask={`url(#${id("vignette")})`}>
          <image className="sketch" href={image} width={w} height={h} filter={`url(#${id("gray")})`} />
          <image className="color" href={image} width={w} height={h} />
        </g>
      </svg>

      <style jsx>{`
        .pencil {
          margin: 0 auto;
          position: relative;
        }
        svg {
          display: block;
          width: 100%;
          height: auto;
          mix-blend-mode: multiply;
        }
        svg :global(.sketch),
        svg :global(.color) {
          opacity: 0;
        }
        svg :global(.sketch) {
          animation: fade ${FADE_TIME}s ease-out ${FADE_START}s forwards;
        }
        svg :global(.color) {
          animation: fade ${COLOR_TIME}s ease-in-out ${COLOR_START}s forwards;
        }
        @keyframes fade {
          to {
            opacity: 1;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          svg :global(.sketch),
          svg :global(.color) {
            animation: none;
            opacity: 1;
          }
        }
      `}</style>
    </figure>
  );
}
