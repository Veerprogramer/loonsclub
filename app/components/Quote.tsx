"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type QuoteProps = {
  /** Drifts in word by word */
  lead: string;
  /** Typed out on its own line once the lead has landed */
  punchline: string;
  author: string;
};

const WORD_START = 150; // ms before the first word
const WORD_STEP = 80; // ms between words
const WORD_FADE = 900; // matches .quote-word transition
const TYPE_PAUSE = 300; // beat between the last word and the first keystroke
const TYPE_STEP = 55; // ms per character

export default function Quote({ lead, punchline, author }: QuoteProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [typed, setTyped] = useState(0);
  const words = lead.split(" ");
  const shownChars = reduceMotion ? punchline.length : typed;
  const typingDone = shownChars >= punchline.length;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || reduceMotion) return;
    let timer = 0;
    let i = 0;
    const tick = () => {
      i++;
      setTyped(i);
      // Slight jitter so it reads like real keystrokes
      if (i < punchline.length) timer = window.setTimeout(tick, TYPE_STEP + Math.random() * 40);
    };
    timer = window.setTimeout(tick, WORD_START + (words.length - 1) * WORD_STEP + WORD_FADE + TYPE_PAUSE);
    return () => window.clearTimeout(timer);
  }, [visible, reduceMotion, punchline, words.length]);

  return (
    <figure ref={ref} className={`mx-auto max-w-6xl text-center ${visible ? "is-visible" : ""}`}>
      <span aria-hidden className="text-gradient-light block [font-family:var(--font-clamp)] text-6xl leading-none sm:text-7xl">
        &ldquo;
      </span>
      <blockquote className="quote-text mt-2">
        <p className="text-balance">
          {words.map((word, i) => (
            <span key={i} className="quote-word" style={{ transitionDelay: `${WORD_START + i * WORD_STEP}ms` }}>
              {word}&nbsp;
            </span>
          ))}
        </p>
        <p className="mt-4 text-accent-light">
          <span className="sr-only">{punchline}</span>
          {/* Untyped text stays in the flow (transparent) so the line never reflows while typing */}
          <span aria-hidden>
            {punchline.slice(0, shownChars)}
            {visible && !typingDone && <span className="typewriter-caret" />}
            <span className="text-transparent">{punchline.slice(shownChars)}</span>
          </span>
        </p>
      </blockquote>
      <figcaption
        className={`mt-10 text-sm font-medium uppercase tracking-[0.22em] text-white/60 transition-opacity duration-700 ${
          typingDone && visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <span aria-hidden className="mr-3 inline-block h-px w-8 bg-accent-light/60 align-middle" />
        {author}
      </figcaption>
    </figure>
  );
}
