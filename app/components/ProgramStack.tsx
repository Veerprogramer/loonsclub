"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type RefObject } from "react";

export type AgendaItem = { time?: string; title: string; detail: string };

// A card is either an image card (photo on top, copy below) or, when `agenda` is set, a timeline card
export type ProgramCard = {
  eyebrow: string;
  title: string;
  body: string;
  image?: string | null;
  imageAlt?: string;
  agenda?: AgendaItem[];
};

const STICKY_TOP = 80; 
export default function ProgramStack({ cards }: { cards: ProgramCard[] }) {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  return (
    <div className="space-y-[10vh]">
      {cards.map((card, i) => (
        <div
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className="sticky"
          style={{ top: STICKY_TOP }}
        >
          <StackedCard card={card} wrappers={refs} nextIndex={i < cards.length - 1 ? i + 1 : null} />
        </div>
      ))}
    </div>
  );
}

function StackedCard({
  card,
  wrappers,
  nextIndex,
}: {
  card: ProgramCard;
  wrappers: RefObject<(HTMLDivElement | null)[]>;
  nextIndex: number | null;
}) {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  const progress = useTransform(scrollY, () => {
    const el = nextIndex === null ? null : wrappers.current[nextIndex];
    if (!el) return 0;
    const vh = window.innerHeight;
    const top = el.getBoundingClientRect().top;
    return Math.min(1, Math.max(0, (vh - top) / (vh - STICKY_TOP)));
  });

  const rotateX = useTransform(progress, [0, 1], [0, 28]);
  const rotateZ = useTransform(progress, [0, 1], [0, -4]);
  const scale = useTransform(progress, [0, 1], [1, 0.72]);
  const y = useTransform(progress, [0, 1], [0, -60]);
  const opacity = useTransform(progress, [0, 0.6, 1], [1, 0.55, 0]);

  const motionStyle = reduceMotion || nextIndex === null ? {} : { rotateX, rotateZ, scale, y, opacity, transformPerspective: 1400 };

  return (
    <motion.article
      style={motionStyle}
      className="origin-[50%_0%] overflow-hidden rounded-4xl bg-white shadow-[0_40px_80px_-30px_rgba(29,23,41,0.4)] ring-1 ring-ink/5 will-change-transform md:h-[min(calc(100svh-7rem),48rem)]"
    >
      {card.agenda ? <AgendaContent card={card} agenda={card.agenda} /> : <ImageContent card={card} />}
    </motion.article>
  );
}

// Photo across the top with the title in its bottom-left corner, copy underneath
function ImageContent({ card }: { card: ProgramCard }) {
  return (
    <div className="flex h-full flex-col">
      <div className="relative aspect-video min-h-0 bg-linear-to-br from-ink-soft to-accent md:aspect-auto md:flex-1">
        {card.image ? (
          <Image src={card.image} alt={card.imageAlt ?? ""} fill sizes="(min-width: 1280px) 1216px, 100vw" className="object-cover" />
        ) : (
          <svg
            viewBox="0 0 24 24"
            className="absolute inset-0 m-auto h-20 w-20 text-white/25"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            aria-label={card.imageAlt}
            role="img"
          >
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <circle cx="9" cy="10" r="2" />
            <path d="M21 16l-5-5-9 9" />
          </svg>
        )}
        {/* fade keeps the title readable on any photo */}
        <div aria-hidden className="absolute inset-0 bg-linear-to-t from-ink/80 via-ink/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:px-14">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-light sm:text-sm">{card.eyebrow}</p>
          <h3 className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            {card.title}
          </h3>
        </div>
      </div>

      <div className="p-6 sm:p-10 lg:px-14">
        <p className="text-base leading-relaxed text-muted sm:text-lg">{card.body}</p>
      </div>
    </div>
  );
}

// Dark intro panel beside a vertical timeline that draws itself in when the card comes into view
function AgendaContent({ card, agenda }: { card: ProgramCard; agenda: AgendaItem[] }) {
  const reduceMotion = useReducedMotion();
  const inView = { once: true, amount: 0.4 } as const;

  return (
    <div className="grid h-full md:grid-cols-[2fr_3fr]">
      <div className="bg-night flex flex-col justify-end p-8 text-white sm:p-12 lg:p-14">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-light sm:text-sm">{card.eyebrow}</p>
        <h3 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-5xl">{card.title}</h3>
        <p className="mt-5 text-base leading-relaxed text-white/70 sm:text-lg">{card.body}</p>
      </div>

      <div className="flex min-h-0 items-center overflow-y-auto p-8 sm:p-12 lg:p-14">
        <ol className="w-full">
          {agenda.map((item, i) => (
            <motion.li
              key={item.title}
              className="relative flex gap-5 pb-6 last:pb-0 sm:gap-6"
              initial={reduceMotion ? false : { opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={inView}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 + i * 0.12 }}
            >
              {/* rail segment down to the next stop, drawn in sequence */}
              {i < agenda.length - 1 && (
                <motion.span
                  aria-hidden
                  className="bg-accent-gradient absolute bottom-0 left-4.75 top-10 w-px origin-top"
                  initial={reduceMotion ? false : { scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={inView}
                  transition={{ duration: 0.3, ease: "easeInOut", delay: 0.3 + i * 0.12 }}
                />
              )}
              <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white font-display text-sm font-semibold text-accent ring-1 ring-accent/30">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="pt-1.5">
                {item.time && (
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{item.time}</p>
                )}
                <p className="font-display text-lg font-semibold tracking-tight sm:text-xl">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted sm:text-base">{item.detail}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </div>
  );
}
