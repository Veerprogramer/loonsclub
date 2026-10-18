"use client";

import { useEffect, useId, useRef, useState } from "react";

type Outline = { w: number; h: number; outline: string[] };

// Timing (seconds): the border lines draw on first, then the sketch is shaded in underneath them.
const OUTLINE_SPAN = 2.2;
const STROKE_TIME = 0.8;
const REVEAL_START = 1.6;
const REVEAL_TIME = 4.2;
// Once the shading is in, the traced lines step back so the sketch's own linework leads.
const SETTLE_START = REVEAL_START + REVEAL_TIME - 0.8;

// One continuous back-and-forth sweep, slanted like the sketch's own hatching, top to bottom.
function sweepPath(w: number, h: number, step: number) {
  const slant = w * 0.35;
  const pad = step * 2;
  const rows = Math.ceil((h + slant) / step) + 1;
  let d = "";
  for (let i = 0; i <= rows; i++) {
    const y = i * step - slant;
    const left = `${-pad} ${(y + slant).toFixed(0)}`;
    const right = `${w + pad} ${y.toFixed(0)}`;
    d += i === 0 ? `M${left}L${right}` : i % 2 ? `L${right}L${left}` : `L${left}L${right}`;
  }
  return d;
}

type Props = {
  image?: string;
  outlineSrc?: string;
  className?: string;
  // Fires once the outline pass has finished drawing, so surrounding content can follow it in
  onOutlineDrawn?: () => void;
};

export default function PencilPortrait({
  image = "/jobs.jpg",
  outlineSrc = "/jobs-outline.json",
  className = "",
  onOutlineDrawn,
}: Props) {
  const [data, setData] = useState<Outline | null>(null);
  const [run, setRun] = useState(0);
  const onOutlineDrawnRef = useRef(onOutlineDrawn);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  useEffect(() => {
    onOutlineDrawnRef.current = onOutlineDrawn;
  }, [onOutlineDrawn]);

  useEffect(() => {
    fetch(outlineSrc).then((r) => r.json()).then(setData).catch(console.error);
  }, [outlineSrc]);

  useEffect(() => {
    if (!data) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => onOutlineDrawnRef.current?.(), reduce ? 0 : (OUTLINE_SPAN + STROKE_TIME) * 1000);
    return () => clearTimeout(t);
  }, [data]);

  if (!data) return <div className={className} style={{ aspectRatio: "1 / 1" }} aria-hidden />;

  const { w, h } = data;
  const step = h / 21;
  const id = (name: string) => `${uid}-${name}`;

  return (
    <figure className={`pencil ${className}`}>
      <svg key={run} viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Pencil sketch portrait of Steve Jobs holding an apple">
        <defs>
          {/* subtle graphite wobble on the traced lines */}
          <filter id={id("wobble")} x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="3" />
            <feDisplacementMap in="SourceGraphic" scale="4" />
          </filter>
          {/* ragged, soft edge on the shading sweep so it reads as graphite, not a wipe */}
          <filter id={id("rough")} filterUnits="userSpaceOnUse" x={-step * 3} y={-step * 3} width={w + step * 6} height={h + step * 6}>
            <feTurbulence type="fractalNoise" baseFrequency="0.018 0.05" numOctaves="3" seed="8" />
            <feDisplacementMap in="SourceGraphic" scale={step * 0.9} xChannelSelector="R" yChannelSelector="G" />
            <feGaussianBlur stdDeviation={step * 0.12} />
          </filter>
          <mask id={id("reveal")} maskUnits="userSpaceOnUse" x={0} y={0} width={w} height={h}>
            <path
              className="sweep"
              d={sweepPath(w, h, step)}
              pathLength={1}
              fill="none"
              stroke="#fff"
              strokeWidth={step * 1.9}
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={`url(#${id("rough")})`}
            />
          </mask>
          {/* dissolve the square edges of the sketch into the page */}
          <radialGradient id={id("vignette-fill")} cx="50%" cy="42%" r="62%">
            <stop offset="0.72" stopColor="#fff" />
            <stop offset="1" stopColor="#000" />
          </radialGradient>
          <mask id={id("vignette")} maskUnits="userSpaceOnUse" x={0} y={0} width={w} height={h}>
            <rect width={w} height={h} fill={`url(#${id("vignette-fill")})`} />
          </mask>
        </defs>

        <g mask={`url(#${id("vignette")})`}>
          <image
            href={image}
            width={w}
            height={h}
            preserveAspectRatio="xMidYMid slice"
            mask={`url(#${id("reveal")})`}
            style={{ mixBlendMode: "multiply" }}
          />

        <g
          className="lines"
          filter={`url(#${id("wobble")})`}
          fill="none"
          stroke="#2b2b2b"
          strokeWidth={2.4}
          strokeOpacity={0.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {data.outline.map((d, i) => (
            <path
              key={i}
              d={d}
              pathLength={1}
              style={{ animationDelay: `${((i / data.outline.length) * OUTLINE_SPAN).toFixed(2)}s` }}
            />
          ))}
        </g>
        </g>
      </svg>

      <style jsx>{`
        .pencil { margin: 0 auto; position: relative; }
        svg { display: block; width: 100%; height: auto; }
        /* dash sits fully off the path until it starts, so round caps don't leave dots behind */
        svg :global(path) {
          stroke-dasharray: 1 2;
          stroke-dashoffset: 1.05;
          animation: draw ${STROKE_TIME}s ease-in-out forwards;
        }
        svg :global(.sweep) {
          animation: draw ${REVEAL_TIME}s ease-in-out ${REVEAL_START}s forwards;
        }
        svg :global(.lines) {
          animation: settle 1.4s ease-out ${SETTLE_START}s forwards;
        }
        @keyframes draw { to { stroke-dashoffset: 0; } }
        @keyframes settle { to { opacity: 0.4; } }
        @media (prefers-reduced-motion: reduce) {
          svg :global(path) { animation: none; stroke-dashoffset: 0; }
          svg :global(.lines) { animation: none; opacity: 0.4; }
        }
      `}</style>
    </figure>
  );
}
