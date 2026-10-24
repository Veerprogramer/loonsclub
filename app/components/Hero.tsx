"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { useState } from "react";
import PencilPortrait from "./Pencilportrait";
import SiteNav, { type NavItem } from "./SiteNav";

// Badge, headline, subtext and CTA rise in one after another while the painting is still filling in.
const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export default function Hero({ nav }: { nav: NavItem[] }) {
  const reduceMotion = useReducedMotion();
  const [revealed, setRevealed] = useState(false);
  const shown = revealed || reduceMotion;

  return (
    <header className="relative flex min-h-svh flex-col overflow-hidden bg-white bg-[radial-gradient(ellipse_50%_60%_at_85%_45%,rgba(124,58,237,0.10),transparent_70%)] text-ink">
      <SiteNav items={nav} />

      <div className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-10 px-5 pb-12 sm:px-8 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
        {/* width is capped by viewport height so the whole portrait stays on screen */}
        <PencilPortrait
          className="w-full max-w-[min(30rem,60svh)] lg:max-w-[min(42rem,84svh)]"
          onReveal={() => setRevealed(true)}
        />

        <motion.div
          initial={reduceMotion ? false : "hidden"}
          animate={shown ? "shown" : "hidden"}
          transition={{ staggerChildren: 0.28 }}
          className="text-center lg:text-left"
        >
          <motion.h1
            variants={item}
            className="font-hero text-[clamp(2.5rem,1.6rem+3.4vw,4.5rem)] font-semibold leading-[1.1] tracking-[-0.02em]"
          >
            <span className="text-gradient block">Entrepreneurship</span>
            <span className="block">program for school students</span>
          </motion.h1>
          <motion.p variants={item} className="mt-10 flex flex-wrap items-baseline justify-center gap-x-3 lg:justify-start">
            <span className="font-hero text-[clamp(1.25rem,1rem+1vw,1.75rem)] font-light tracking-[-0.01em] text-ink/75">
              Here is to the
            </span>
            <span className="font-ransom text-[clamp(1.75rem,1.3rem+1.6vw,2.75rem)] leading-none">
              <span className="text-gradient">Crazy</span> Ones
            </span>
          </motion.p>
          <motion.a
            variants={item}
            href="#programs"
            className="group mt-12 inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-ink via-ink-soft to-accent px-8 py-4 text-base font-medium text-white transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-12px_rgba(124,58,237,0.7)]"
          >
            Explore Programs
            <span aria-hidden className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </motion.a>
        </motion.div>
      </div>
    </header>
  );
}
