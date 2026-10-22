"use client";

import { useEffect, useId, useRef, useState } from "react";

type Size = { w: number; h: number };

// Timing (seconds): the painting is shaded in straight away, top to bottom.
const REVEAL_START = 0.15;
const REVEAL_TIME = 3.2;
// Surrounding content is cued once the sweep is roughly a third of the way down the canvas.
const CUE_AT = REVEAL_START + REVEAL_TIME * 0.35;
// A glint runs across the apple once the sketch is complete.
const GLINT_AT = REVEAL_START + REVEAL_TIME + 0.2;

// The apple in /jobs.jpg (1264×1264), traced around the fingers that overlap it.
const APPLE =
  "M740 490C762 477 786 458 815 457C850 457 872 479 879 515C883 535 883 549 878 556L862 560C856 570 855 587 856 596L832 594C812 594 794 603 793 617C792 630 801 635 812 634L836 636C828 654 800 661 770 662C736 663 713 652 701 640C681 620 665 590 664 560C663 531 672 512 691 502C709 493 724 490 740 490Z";

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
  className?: string;
  // Fires partway through the reveal, so surrounding content can follow it in
  onReveal?: () => void;
};

export default function PencilPortrait({ image = "/jobs.jpg", className = "", onReveal }: Props) {
  const [size, setSize] = useState<Size | null>(null);
  const onRevealRef = useRef(onReveal);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  useEffect(() => {
    onRevealRef.current = onReveal;
  }, [onReveal]);

  // Wait for the image itself so the sweep never paints over a blank frame
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
  const step = h / 21;
  const id = (name: string) => `${uid}-${name}`;

  return (
    <figure className={`pencil ${className}`}>
      <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Pencil sketch portrait of Steve Jobs holding an apple">
        <defs>
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

          {/* the apple is the one thing in colour: graphite tones mapped onto a glossy red */}
          <filter id={id("red")} colorInterpolationFilters="sRGB">
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncR type="table" tableValues="0.12 0.42 0.74 0.93 1" />
              <feFuncG type="table" tableValues="0.01 0.02 0.05 0.2 1" />
              <feFuncB type="table" tableValues="0.02 0.035 0.07 0.2 1" />
            </feComponentTransfer>
          </filter>
          <filter id={id("feather")} x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur stdDeviation={1.5} />
          </filter>
          <mask id={id("apple")} maskUnits="userSpaceOnUse" x={0} y={0} width={w} height={h}>
            <path d={APPLE} transform={`scale(${w / 1264} ${h / 1264})`} fill="#fff" filter={`url(#${id("feather")})`} />
          </mask>
          <radialGradient id={id("shine")}>
            <stop offset="0" stopColor="#fff" stopOpacity="0.75" />
            <stop offset="0.35" stopColor="#fff" stopOpacity="0.3" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={id("glint")} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.55" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
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
          <g mask={`url(#${id("reveal")})`}>
            <g mask={`url(#${id("apple")})`} transform={`scale(${w / 1264} ${h / 1264})`}>
              <image
                href={image}
                width={1264}
                height={1264}
                preserveAspectRatio="xMidYMid slice"
                filter={`url(#${id("red")})`}
              />
              <ellipse cx={812} cy={516} rx={34} ry={26} fill={`url(#${id("shine")})`} transform="rotate(-25 812 516)" />
              <ellipse cx={678} cy={565} rx={6} ry={32} fill={`url(#${id("shine")})`} transform="rotate(12 678 565)" />
              <g transform="rotate(20 770 560)">
                <rect className="glint" x={600} y={420} width={70} height={300} fill={`url(#${id("glint")})`} />
              </g>
            </g>
          </g>
        </g>
      </svg>

      <style jsx>{`
        .pencil { margin: 0 auto; position: relative; }
        svg { display: block; width: 100%; height: auto; }
        /* dash sits fully off the path until it starts, so round caps don't leave dots behind */
        svg :global(.sweep) {
          stroke-dasharray: 1 2;
          stroke-dashoffset: 1.05;
          animation: draw ${REVEAL_TIME}s cubic-bezier(0.45, 0, 0.25, 1) ${REVEAL_START}s forwards;
        }
        @keyframes draw { to { stroke-dashoffset: 0; } }
        svg :global(.glint) {
          opacity: 0;
          animation: glint 1.1s ease-in-out ${GLINT_AT}s;
        }
        @keyframes glint {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 1; transform: translateX(300px); }
        }
        @media (prefers-reduced-motion: reduce) {
          svg :global(.sweep) { animation: none; stroke-dashoffset: 0; }
          svg :global(.glint) { animation: none; }
        }
      `}</style>
    </figure>
  );
}
