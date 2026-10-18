"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import PencilPortrait from "./Pencilportrait";

type NavItem = { href: string; label: string };

// Headline, subtext and CTA wait for the sketch's border lines to finish, then slide up together while the shading fills in.
export default function Hero({ nav }: { nav: NavItem[] }) {
  const reduceMotion = useReducedMotion();
  const [revealed, setRevealed] = useState(false);
  const shown = revealed || reduceMotion;

  return (
    <header className="relative flex min-h-svh flex-col overflow-hidden bg-white bg-[radial-gradient(ellipse_50%_60%_at_85%_45%,rgba(124,58,237,0.10),transparent_70%)] text-ink">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8 sm:py-7">
        <a href="#" className="flex items-center gap-2.5 font-display text-xl font-semibold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-sm font-bold text-cream">
            L
          </span>
          Loons Club
        </a>
        <div className="flex items-center gap-7 text-sm">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="hidden text-ink/70 transition hover:text-ink sm:inline">
              {item.label}
            </a>
          ))}
          <a
            href="#enroll"
            className="rounded-full px-4 py-2 font-medium ring-1 ring-ink/25 transition hover:bg-ink hover:text-cream hover:ring-ink"
          >
            Apply
          </a>
        </div>
      </nav>

      <div className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-10 px-5 pb-12 sm:px-8 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
        {/* width is capped by viewport height so the whole portrait stays on screen */}
        <PencilPortrait
          className="w-full max-w-[min(30rem,60svh)] lg:max-w-[min(42rem,84svh)]"
          onOutlineDrawn={() => setRevealed(true)}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={shown ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: reduceMotion ? 0 : 0.6, ease: "easeOut" }}
          className="text-center lg:text-left"
        >
          <p className="inline-flex items-center gap-2 rounded-full bg-accent/8 px-3.5 py-1.5 text-xs font-medium text-accent ring-1 ring-accent/20">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
            Founder program · Chennai
          </p>
          <h1 className="mt-6">
            <span className="block font-hero text-[clamp(2.5rem,1.6rem+3.4vw,4.75rem)] font-light leading-none tracking-[-0.02em]">
              Here is to the
            </span>
            {/* "Ones" steps in from the left so the two words don't stack flush */}
            <span className="mt-5 block font-ransom text-[clamp(3.5rem,2.4rem+4.6vw,7rem)] leading-[1.05]">
              <span className="text-gradient block">Crazy</span>
              <span className="block pl-[0.9em] lg:pl-[1.3em]">Ones</span>
            </span>
          </h1>
          <p className="hero-copy mx-auto mt-7 max-w-md text-lg leading-relaxed text-ink/75 sm:text-xl lg:mx-0">
            Young minds exploring big ideas, guided by real founders.
          </p>
          <a
            href="#enroll"
            className="group mt-10 inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-ink via-ink-soft to-accent px-8 py-4 text-base font-medium text-white transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-12px_rgba(124,58,237,0.7)]"
          >
            Enroll Now
            <span aria-hidden className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </a>
        </motion.div>
      </div>
    </header>
  );
}
