"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react";

// `steps` lists the topics inside a longer stage, shown as small tags
export type AgendaItem = { time?: string; title: string; detail: string; steps?: string[] };

// Image on one side, the description and a numbered agenda on the other
export type ProgramCard = {
  eyebrow: string;
  title: string;
  body: string;
  // set to a path in /public; null shows a placeholder
  image: string | null;
  imageAlt: string;
  agenda: AgendaItem[];
  // the program's own page
  href?: string;
};

const STICKY_TOP = 80;
// space left under a tall card once it pins, so its last line isn't flush with the screen edge
const BOTTOM_GAP = 24;

// Cards pin and stack as you scroll. A card taller than the screen (on phones) pins by its bottom
// edge instead of its top, so all of it has been seen before the next card slides over it.
export default function ProgramStack({ cards }: { cards: ProgramCard[] }) {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const [tops, setTops] = useState<number[]>(() => cards.map(() => STICKY_TOP));
  // read from scroll callbacks, which shouldn't wait for a render
  const topsRef = useRef(tops);

  useLayoutEffect(() => {
    const measure = () => {
      const vh = window.innerHeight;
      const next = refs.current.map((el) =>
        el ? Math.min(STICKY_TOP, vh - el.offsetHeight - BOTTOM_GAP) : STICKY_TOP,
      );
      topsRef.current = next;
      setTops((prev) => (prev.every((t, i) => t === next[i]) ? prev : next));
    };
    measure();
    const ro = new ResizeObserver(measure);
    refs.current.forEach((el) => el && ro.observe(el));
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div className="space-y-[20vh] lg:space-y-[10vh]">
      {cards.map((card, i) => (
        <div
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className="sticky"
          style={{ top: tops[i] }}
        >
          <StackedCard card={card} wrappers={refs} tops={topsRef} nextIndex={i < cards.length - 1 ? i + 1 : null} />
        </div>
      ))}
    </div>
  );
}

function StackedCard({
  card,
  wrappers,
  tops,
  nextIndex,
}: {
  card: ProgramCard;
  wrappers: RefObject<(HTMLDivElement | null)[]>;
  tops: RefObject<number[]>;
  nextIndex: number | null;
}) {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  const progress = useTransform(scrollY, () => {
    const el = nextIndex === null ? null : wrappers.current[nextIndex];
    if (!el) return 0;
    // 0 as the next card enters the screen, 1 once it has pinned on top of this one
    const vh = window.innerHeight;
    const top = el.getBoundingClientRect().top;
    const pinAt = tops.current[nextIndex!] ?? STICKY_TOP;
    return Math.min(1, Math.max(0, (vh - top) / (vh - pinAt)));
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
      className="relative origin-[50%_0%] overflow-hidden rounded-4xl bg-white shadow-[0_40px_80px_-30px_rgba(29,23,41,0.4)] ring-1 ring-ink/5 will-change-transform lg:h-[clamp(36rem,calc(100svh-7rem),44rem)]"
    >
      {card.href ? (
        <CardLink href={card.href} title={card.title}>
          <CardContent card={card} />
        </CardLink>
      ) : (
        <CardContent card={card} />
      )}
    </motion.article>
  );
}

// The whole card opens the program
function CardLink({ href, title, children }: { href: string; title: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      aria-label={`Explore ${title}`}
      className="block h-full rounded-4xl outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-accent/50"
    >
      {children}
    </Link>
  );
}

// Photo with the title in its bottom-left corner, beside the description and a timeline that draws itself in
function CardContent({ card }: { card: ProgramCard }) {
  const reduceMotion = useReducedMotion();
  const inView = { once: true, amount: 0.4 } as const;

  return (
    <div className="grid h-full lg:grid-cols-[5fr_6fr]">
      <div className="relative aspect-video min-h-0 bg-linear-to-br from-ink-soft to-accent lg:aspect-auto">
        {card.image ? (
          <Image src={card.image} alt={card.imageAlt} fill sizes="(min-width: 1024px) 1100px, 100vw" className="object-cover" />
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
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-light sm:text-sm">{card.eyebrow}</p>
          <h3 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-5xl">{card.title}</h3>
        </div>
      </div>

      <div className="flex min-h-0 flex-col justify-center p-6 sm:p-10">
        <p className="leading-relaxed text-muted">{card.body}</p>
        <p className="mt-7 text-xs font-semibold uppercase tracking-[0.18em] text-ink/40">The agenda</p>
        <ol className="mt-4 w-full">
          {card.agenda.map((item, i) => (
            <motion.li
              key={item.title}
              className="relative flex gap-4 pb-4 last:pb-0"
              initial={reduceMotion ? false : { opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={inView}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 + i * 0.12 }}
            >
              {/* rail segment down to the next stop, drawn in sequence */}
              {i < card.agenda.length - 1 && (
                <motion.span
                  aria-hidden
                  className="bg-accent-gradient absolute bottom-0 left-4.25 top-9 w-px origin-top"
                  initial={reduceMotion ? false : { scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={inView}
                  transition={{ duration: 0.3, ease: "easeInOut", delay: 0.3 + i * 0.12 }}
                />
              )}
              <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white font-display text-xs font-semibold text-accent ring-1 ring-accent/30">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="pt-0.5">
                {item.time && (
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{item.time}</p>
                )}
                <p className="font-display font-semibold tracking-tight">{item.title}</p>
                <p className="text-sm leading-relaxed text-muted">{item.detail}</p>
                {item.steps && (
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {item.steps.map((step) => (
                      <li key={step} className="rounded-full bg-accent/8 px-2.5 py-1 text-xs font-medium text-ink/70 ring-1 ring-accent/15">
                        {step}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </div>
  );
}
