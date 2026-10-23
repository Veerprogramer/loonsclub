"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { PartnerPopup } from "./FormPopups";

export type Audience = "schools" | "students";

export type Track = {
  key: Audience;
  label: string;
  headline: string;
  intro: string;
  facts: { label: string; value: string }[];
  formats: { program: string; how: string }[];
  steps: string[];
  // either a link, or a button that opens a popup form
  cta: { label: string } & ({ href: string } | { popup: "partner" });
};

const ctaClass =
  "group mt-10 inline-flex items-center justify-center gap-2 self-start rounded-full bg-white px-6 py-3 font-semibold text-ink transition hover:-translate-y-0.5 hover:bg-accent-light";

// One section, two audiences: a switch flips between "we come to your school" and "you come to us on weekends".
// Nav links to #schools / #students land here with the matching side selected.
export default function WaysToJoin({ tracks }: { tracks: Track[] }) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState<Audience>(tracks[0].key);
  const track = tracks.find((t) => t.key === active) ?? tracks[0];

  useEffect(() => {
    const pick = (hash: string) => {
      const key = hash.replace("#", "");
      if (tracks.some((t) => t.key === key)) setActive(key as Audience);
    };
    pick(window.location.hash);

    // Lenis handles anchor clicks itself and doesn't update the hash, so listen for the clicks too
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (a) pick(a.getAttribute("href") ?? "");
    };
    const onHash = () => pick(window.location.hash);
    document.addEventListener("click", onClick);
    window.addEventListener("hashchange", onHash);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", onHash);
    };
  }, [tracks]);

  return (
    <div>
      <div
        role="tablist"
        aria-label="Who is joining"
        className="mx-auto flex w-full max-w-md rounded-full bg-white p-1.5 shadow-[0_16px_40px_-24px_rgba(29,23,41,0.4)] ring-1 ring-ink/10"
      >
        {tracks.map((t) => {
          const selected = t.key === active;
          return (
            <button
              key={t.key}
              role="tab"
              id={`tab-${t.key}`}
              aria-selected={selected}
              aria-controls={`panel-${t.key}`}
              onClick={() => setActive(t.key)}
              className={`relative flex-1 rounded-full px-5 py-3 font-display text-sm font-semibold transition-colors sm:text-base ${
                selected ? "text-white" : "text-ink/60 hover:text-ink"
              }`}
            >
              {selected && (
                <motion.span
                  layoutId="audience-pill"
                  className="bg-accent-gradient absolute inset-0 rounded-full"
                  transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative">{t.label}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={track.key}
          role="tabpanel"
          id={`panel-${track.key}`}
          aria-labelledby={`tab-${track.key}`}
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_1fr]"
        >
          {/* left: the pitch and the facts at a glance */}
          <div className="rounded-4xl bg-white p-7 ring-1 ring-ink/5 sm:p-10 lg:p-12">
            <h3 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{track.headline}</h3>
            <p className="mt-4 text-lg leading-relaxed text-muted">{track.intro}</p>

            <dl className="mt-10 grid gap-px overflow-hidden rounded-2xl bg-ink/8 ring-1 ring-ink/8 sm:grid-cols-2">
              {track.facts.map((f) => (
                <div key={f.label} className="bg-white p-5">
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{f.label}</dt>
                  <dd className="mt-2 font-medium leading-snug">{f.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-10">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/40">How each program runs</p>
              <ul className="mt-4 space-y-3">
                {track.formats.map((f) => (
                  <li key={f.program} className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
                    <span className="shrink-0 font-display font-semibold tracking-tight sm:w-56">{f.program}</span>
                    <span className="text-muted">{f.how}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* right: what happens, step by step */}
          <div className="bg-night flex flex-col rounded-4xl p-7 text-white sm:p-10 lg:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-light">How it works</p>
            <ol className="mt-8 flex-1">
              {track.steps.map((step, i) => (
                <li key={step} className="relative flex gap-5 pb-7 last:pb-0">
                  {i < track.steps.length - 1 && (
                    <span aria-hidden className="bg-accent-gradient absolute bottom-0 left-4.75 top-10 w-px" />
                  )}
                  <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 font-display text-sm font-semibold ring-1 ring-white/25">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="pt-2 leading-relaxed text-white/85">{step}</p>
                </li>
              ))}
            </ol>
            {"popup" in track.cta ? (
              <PartnerPopup className={ctaClass}>
                {track.cta.label}
                <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
              </PartnerPopup>
            ) : (
              <a href={track.cta.href} className={ctaClass}>
                {track.cta.label}
                <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
