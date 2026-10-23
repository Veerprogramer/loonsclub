"use client";

import { useEffect, useId, useRef, useState } from "react";

type Size = { w: number; h: number };

// Timing (seconds). Two beats, overlapping:
// 1. the drawing develops outward from the face, like a print in the tray
const DEVELOP_START = 0.15;
const DEVELOP_TIME = 2.2;
// 2. the image's own colour (only the apple has any) blooms out from the apple last
const BLOOM_START = 1.9;
const BLOOM_TIME = 1.4;
// Surrounding content is cued as the drawing starts to develop
const CUE_AT = DEVELOP_START + 0.3;

// Where each beat radiates from, as fractions of the image
const FACE = { x: 0.4, y: 0.32 };
const APPLE = { x: 0.61, y: 0.44 };

// Radius from a point to the farthest corner, plus the soft edge, so a growing circle just covers the frame
function cover(p: { x: number; y: number }, w: number, h: number, soft: number) {
  return Math.hypot(Math.max(p.x, 1 - p.x) * w, Math.max(p.y, 1 - p.y) * h) + soft * 2.5;
}

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
  const reach = Math.hypot(w, h);
  const soft = w * 0.07;
  const id = (name: string) => `${uid}-${name}`;
  const wide = { filterUnits: "userSpaceOnUse", x: -reach, y: -reach, width: reach * 3, height: reach * 3 } as const;

  return (
    <figure className={`pencil ${className}`}>
      <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Pencil sketch portrait of Steve Jobs holding a red apple">
        <defs>
          <filter id={id("gray")} colorInterpolationFilters="sRGB">
            <feColorMatrix type="saturate" values="0" />
          </filter>

          {/* soft-edged circles that grow to cover the frame */}
          <filter id={id("blur")} {...wide}>
            <feGaussianBlur stdDeviation={soft} />
          </filter>
          <mask id={id("develop-mask")} maskUnits="userSpaceOnUse" x={0} y={0} width={w} height={h}>
            <circle className="develop" cx={w * FACE.x} cy={h * FACE.y} r={cover(FACE, w, h, soft)} fill="#fff" filter={`url(#${id("blur")})`} />
          </mask>
          <mask id={id("bloom-mask")} maskUnits="userSpaceOnUse" x={0} y={0} width={w} height={h}>
            <circle className="bloom" cx={w * APPLE.x} cy={h * APPLE.y} r={cover(APPLE, w, h, soft)} fill="#fff" filter={`url(#${id("blur")})`} />
          </mask>

          {/* dissolve the square edges of the drawing into the page */}
          <radialGradient id={id("vignette-fill")} cx="50%" cy="42%" r="62%">
            <stop offset="0.72" stopColor="#fff" />
            <stop offset="1" stopColor="#000" />
          </radialGradient>
          <mask id={id("vignette")} maskUnits="userSpaceOnUse" x={0} y={0} width={w} height={h}>
            <rect width={w} height={h} fill={`url(#${id("vignette-fill")})`} />
          </mask>
        </defs>

        {/* the colour layer covers the grey one; the whole svg multiplies onto the page so the paper's white disappears */}
        <g mask={`url(#${id("vignette")})`}>
          <image href={image} width={w} height={h} filter={`url(#${id("gray")})`} mask={`url(#${id("develop-mask")})`} />
          <image href={image} width={w} height={h} mask={`url(#${id("bloom-mask")})`} />
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
        svg :global(.develop),
        svg :global(.bloom) {
          transform-box: fill-box;
          transform-origin: center;
          transform: scale(0);
        }
        svg :global(.develop) {
          animation: grow ${DEVELOP_TIME}s cubic-bezier(0.45, 0, 0.3, 1) ${DEVELOP_START}s forwards;
        }
        svg :global(.bloom) {
          animation: grow ${BLOOM_TIME}s cubic-bezier(0.45, 0, 0.3, 1) ${BLOOM_START}s forwards;
        }
        @keyframes grow {
          to {
            transform: scale(1);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          svg :global(.develop),
          svg :global(.bloom) {
            animation: none;
            transform: none;
          }
        }
      `}</style>
    </figure>
  );
}
