"use client";

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { JoinStep } from "../../lib/programs";

type Layout = { w: number; h: number; d: string; nodes: number[] };

// A ribbon that winds between the steps and draws itself as you scroll. A comet rides its tip,
// and each step lights up the moment the comet reaches it.
export default function JoinTimeline({ steps }: { steps: JoinStep[] }) {
  const reduceMotion = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const dots = useRef<(HTMLSpanElement | null)[]>([]);
  const path = useRef<SVGPathElement>(null);
  const [layout, setLayout] = useState<Layout | null>(null);
  const [reached, setReached] = useState(reduceMotion ? steps.length : 0);

  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start 60%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.0005 });
  const cometX = useMotionValue(0);
  const cometY = useMotionValue(0);

  // Trace a path through the centre of every step dot, swinging out alternately between them
  const measure = useCallback(() => {
    const el = wrap.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    const pts = dots.current.flatMap((dot) => {
      if (!dot) return [];
      const r = dot.getBoundingClientRect();
      return [{ x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top }];
    });
    if (!pts.length) return;
    const wide = box.width >= 1024;
    const swing = wide ? Math.min(140, box.width * 0.1) : 18;
    let d = `M${pts[0].x} 0L${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1];
      const b = pts[i];
      const dy = b.y - a.y;
      const s = i % 2 ? swing : -swing;
      d += `C${a.x + s} ${a.y + dy * 0.35} ${b.x + s} ${b.y - dy * 0.35} ${b.x} ${b.y}`;
    }
    d += `L${pts[pts.length - 1].x} ${box.height}`;
    setLayout({ w: box.width, h: box.height, d, nodes: pts.map((p) => p.y) });
  }, []);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (wrap.current) ro.observe(wrap.current);
    return () => ro.disconnect();
  }, [measure]);

  const follow = useCallback(
    (v: number) => {
      const p = path.current;
      if (!p || !layout) return;
      const pt = p.getPointAtLength(Math.min(1, Math.max(0, v)) * p.getTotalLength());
      cometX.set(pt.x);
      cometY.set(pt.y);
      const n = layout.nodes.filter((y) => y <= pt.y + 2).length;
      setReached((prev) => (prev === n ? prev : n));
    },
    [layout, cometX, cometY],
  );
  useMotionValueEvent(progress, "change", reduceMotion ? () => {} : follow);
  useEffect(() => {
    if (!reduceMotion) follow(progress.get());
  }, [follow, progress, reduceMotion]);

  const shown = reduceMotion ? steps.length : reached;

  return (
    <div ref={wrap} className="relative">
      {layout && (
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-visible"
          width={layout.w}
          height={layout.h}
          viewBox={`0 0 ${layout.w} ${layout.h}`}
        >
          <defs>
            <linearGradient id="join-ribbon" x1="0" y1="0" x2="0" y2={layout.h} gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#c4b5fd" />
              <stop offset="0.5" stopColor="#7c3aed" />
              <stop offset="1" stopColor="#a855f7" />
            </linearGradient>
            <filter id="join-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" />
            </filter>
          </defs>
          {/* dotted trail still to come */}
          <path d={layout.d} fill="none" stroke="rgba(36,18,74,0.14)" strokeWidth="2" strokeDasharray="1 9" strokeLinecap="round" />
          {/* soft glow under the drawn ribbon */}
          <motion.path
            d={layout.d}
            fill="none"
            stroke="url(#join-ribbon)"
            strokeWidth="10"
            strokeLinecap="round"
            opacity="0.35"
            filter="url(#join-glow)"
            style={{ pathLength: reduceMotion ? 1 : progress }}
          />
          <motion.path
            ref={path}
            d={layout.d}
            fill="none"
            stroke="url(#join-ribbon)"
            strokeWidth="3"
            strokeLinecap="round"
            style={{ pathLength: reduceMotion ? 1 : progress }}
          />
          {!reduceMotion && (
            <motion.g style={{ x: cometX, y: cometY }}>
              <circle r="16" fill="#a855f7" opacity="0.35" filter="url(#join-glow)" />
              <circle r="9" fill="#c4b5fd" opacity="0.6" className="comet-pulse" />
              <circle r="4.5" fill="#fff" stroke="#7c3aed" strokeWidth="2" />
            </motion.g>
          )}
        </svg>
      )}

      <ol className="relative">
        {steps.map((step, i) => {
          const on = i < shown;
          const left = i % 2 === 0;
          return (
            <li
              key={step.title}
              className="grid grid-cols-[2.75rem_1fr] items-center gap-x-5 pb-14 last:pb-0 lg:grid-cols-[1fr_5rem_1fr] lg:gap-x-10 lg:pb-24"
            >
              <span
                ref={(el) => {
                  dots.current[i] = el;
                }}
                className="relative z-10 col-start-1 row-start-1 flex h-11 w-11 items-center justify-center justify-self-center lg:col-start-2"
              >
                {on && !reduceMotion && <span aria-hidden className="ripple absolute inset-0 rounded-full ring-2 ring-accent" />}
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-full font-display text-sm font-bold transition-all duration-500 ${
                    on
                      ? "bg-accent-gradient scale-110 text-white shadow-[0_0_0_6px_rgba(124,58,237,0.12),0_10px_24px_-6px_rgba(124,58,237,0.7)]"
                      : "bg-white text-ink/30 ring-1 ring-ink/10"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </span>

              <motion.div
                className={`col-start-2 row-start-1 ${left ? "lg:col-start-1 lg:text-right" : "lg:col-start-3"}`}
                initial={false}
                animate={
                  on
                    ? { opacity: 1, x: 0, rotateY: 0, filter: "blur(0px)" }
                    : { opacity: 0, x: left ? -50 : 50, rotateY: left ? 35 : -35, filter: "blur(8px)" }
                }
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformPerspective: 900, transformOrigin: left ? "100% 50%" : "0% 50%" }}
              >
                <article
                  className={`group relative overflow-hidden rounded-3xl bg-white p-6 shadow-[0_30px_60px_-35px_rgba(36,18,74,0.45)] ring-1 ring-ink/5 transition duration-300 hover:-translate-y-1 hover:ring-accent/25 sm:p-8 ${
                    left ? "lg:ml-auto" : ""
                  } lg:max-w-md`}
                >
                  <div className={`flex items-center gap-3 ${left ? "lg:flex-row-reverse" : ""}`}>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Step {String(i + 1).padStart(2, "0")}</span>
                    <span aria-hidden className="h-px flex-1 bg-ink/10" />
                    <span className="rounded-full bg-accent/8 px-2.5 py-1 text-xs font-medium text-ink/70 ring-1 ring-accent/15">{step.meta}</span>
                  </div>
                  <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight">{step.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{step.detail}</p>
                </article>
              </motion.div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
