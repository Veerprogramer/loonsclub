import Image from "next/image";
import EnrollForm from "./components/EnrollForm";
import Reveal from "./components/Reveal";
import Hero from "./components/Hero";
import ProgramStack, { type ProgramCard } from "./components/ProgramStack";
import WaysToJoin, { type Track } from "./components/WaysToJoin";
import Quote from "./components/Quote";


const NAV = [
  { href: "#offer", label: "Offer" },
  { href: "#programs", label: "Programs" },
  { href: "#schools", label: "Schools" },
  { href: "#students", label: "Students" },
  { href: "#enroll", label: "Enroll" },
];

// The stages every founder goes through, in order
const OFFERS = [
  {
    title: "Spot the problem",
    body: "Learn to notice what's broken around you and pick a problem worth solving.",
    icon: (
      <>
        <circle cx="11" cy="11" r="6.5" />
        <path d="M16 16l4.5 4.5" />
      </>
    ),
  },
  {
    title: "Shape the idea",
    body: "Turn that problem into a clear idea: who it's for, what it does and why it matters.",
    icon: (
      <>
        <path d="M9 18h6M10 21h4" />
        <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.8V16h5v-.3c0-.7.4-1.4 1-1.8A6 6 0 0 0 12 3z" />
      </>
    ),
  },
  {
    title: "Pitch your idea",
    body: "Tell the story behind your idea and present it to a panel of founders and investors.",
    icon: (
      <>
        <rect x="3" y="4" width="18" height="12" rx="1.5" />
        <path d="M12 16v4M8 20h8M7 12l3-3 2 2 5-5" />
      </>
    ),
  },
  {
    title: "Lead and grow",
    body: "See how founders build teams, make hard calls and keep going when things get tough.",
    icon: (
      <>
        <path d="M4 20h16" />
        <path d="M5 16l5-5 3 3 6-6" />
        <path d="M15 8h4v4" />
      </>
    ),
  },
];

const QUOTE_LEAD = "The reasonable man adapts himself to the world; the unreasonable one persists in trying to adapt the world to himself.";
const QUOTE_PUNCHLINE = "Therefore all progress depends on the unreasonable man.";


// Set `image` to a path in /public; null shows a placeholder
const PROGRAMS: ProgramCard[] = [
  {
    eyebrow: "Program 01 · 1 day",
    title: "Startup Bootcamp",
    body: "Founders who have built startups introduce students to the world of startups and entrepreneurship: Ideal Customer Profile, Product Market Fit and Business Model. Then students generate an idea of their own and pitch it.",
    image: "/program-bootcamp.jpg",
    imageAlt: "Students in school uniform working at their desks as a teacher looks on",
    agenda: [
      { title: "Entrepreneurship: An introduction", detail: "What it means to be an entrepreneur, and why it matters." },
      { title: "Startup vs. business", detail: "Why startups are built to grow fast, and how that changes everything." },
      { title: "Founder talk: Startup journey", detail: "A founder shares the real story behind their startup." },
      { title: "Idea Generation", detail: "Teams spot a problem and shape a startup idea of their own." },
      { title: "Pitch & Validation", detail: "Pitch the idea to founders and see how well it holds up." },
    ],
  },
  {
    eyebrow: "Program 02 · 1 year",
    title: "Becoming Entrepreneurial",
    body: "Students go through the early stages of building a real startup, from idea to Product Market Fit. They find co-founders, generate ideas and work through every step in between. If they find the right fit, they can go on to launch.",
    image: "/program-entrepreneurial.jpg",
    imageAlt: "A team of students gathered around a laptop, working on a project together",
    agenda: [
      {
        time: "Phase 1",
        title: "Idea & team",
        detail: "Think like a founder, form a team and find an idea worth pursuing.",
        steps: ["Entrepreneurial mindset I", "Ideation", "Co-founders", "Idea validation", "Ideal Customer Profile"],
      },
      {
        time: "Phase 2",
        title: "Customer",
        detail: "Talk to real customers and sharpen what you offer them.",
        steps: ["Customer discovery interviews", "Value proposition", "Entrepreneurial mindset II"],
      },
      {
        time: "Phase 3",
        title: "Build & launch",
        detail: "Build a first version, iterate towards fit, and take it to market.",
        steps: ["MVP", "Product Market Fit", "Go-to-market"],
      },
    ],
  },
];

const TRACKS: Track[] = [
  {
    key: "schools",
    label: "For schools",
    headline: "We bring it to your campus.",
    intro:
      "We partner with your school and run the programs on your premises. You give us a room and a slot in the timetable; we bring the founders, mentors and material.",
    facts: [
      { label: "Where", value: "Your school premises" },
      { label: "When", value: "Fitted into your school calendar" },
      { label: "Who", value: "Your students, in teams from their own classes" },
      { label: "What you need", value: "A room, a slot, and a teacher point of contact" },
    ],
    formats: [
      { program: "Startup Bootcamp", how: "One full day on campus" },
      { program: "Becoming Entrepreneurial", how: "Regular sessions across the academic year" },
    ],
    steps: [
      "Talk to us about your school and your students.",
      "Pick the bootcamp, the year-long program, or both.",
      "We plan the sessions around your calendar.",
      "Founders and mentors run every session at your school.",
      "Students pitch their ideas at a showcase on campus.",
    ],
    cta: { label: "Partner with us", href: "mailto:hello@loonsclub.in?subject=School%20partnership" },
  },
  {
    key: "students",
    label: "For students",
    headline: "Build on your weekends.",
    intro:
      "Not at a partner school? Join on your own. We run both programs on weekends, with students from schools across Chennai working side by side.",
    facts: [
      { label: "Where", value: "Our space in IITM Research Park, Chennai" },
      { label: "When", value: "Weekends" },
      { label: "Who", value: "Students from any school, mixed into teams" },
      { label: "What you need", value: "Curiosity, and your weekends" },
    ],
    formats: [
      { program: "Startup Bootcamp", how: "One Saturday or Sunday" },
      { program: "Becoming Entrepreneurial", how: "Weekend sessions through the year" },
    ],
    steps: [
      "Save a seat using the form below.",
      "Pick the bootcamp or the year-long program.",
      "Meet your team and your mentor on the first weekend.",
      "Build your idea with founders, weekend by weekend.",
      "Pitch to a panel of founders and investors.",
    ],
    cta: { label: "Save a seat", href: "#enroll" },
  },
];

const TEAM: { name: string; role: string; previously: string; photo: string | null }[] = [
  { name: "Member name", role: "Founder & CEO", previously: "Previously founded an edtech startup", photo: null },
  { name: "Member name", role: "Head of Programs", previously: "Previously a curriculum lead at a K–12 school", photo: null },
  { name: "Member name", role: "Mentor Lead", previously: "Previously a product manager at a SaaS company", photo: null },
  { name: "Member name", role: "Community & Partnerships", previously: "Previously ran a startup incubator", photo: null },
];

export default function Home() {
  return (
    <>
      {/* 1. HERO */}
      <Hero nav={NAV} />

      <main>
        {/* 2. WHAT WE OFFER */}
        <section id="offer" className="scroll-mt-4 bg-linear-to-b from-white to-sand px-5 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">What we offer</p>
              <h2 className="section-title mt-4 max-w-3xl">
                Everything you need to go from a <span className="text-gradient">hunch</span> to launch.
              </h2>
            </Reveal>
            <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {OFFERS.map((o, i) => (
                <Reveal key={o.title} delay={i * 90} className="group h-full">
                  <div className="h-full rounded-3xl bg-white p-7 ring-1 ring-ink/5 transition duration-300 group-hover:-translate-y-1.5 group-hover:shadow-[0_24px_50px_-24px_rgba(29,23,41,0.3)] group-hover:ring-accent/20">
                    <div className="flex items-start justify-between">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 bg-accent-gradient text-white shadow-[0_8px_20px_-8px_rgba(124,58,237,0.6)]`}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="h-6 w-6"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden
                        >
                          {o.icon}
                        </svg>
                      </div>
                      <span className="font-display text-sm font-semibold tracking-wide text-ink/25">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-7 font-display text-xl font-semibold tracking-tight">{o.title}</h3>
                    <p className="mt-2 leading-relaxed text-muted">{o.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* QUOTE */}
        <section
          id="quote"
          aria-label="Quote"
          className="bg-night px-5 py-28 text-white sm:px-8 sm:py-40"
        >
          <Quote lead={QUOTE_LEAD} punchline={QUOTE_PUNCHLINE} author="George Bernard Shaw" />
        </section>

        {/* PROGRAMS: what we run, independent of who joins */}
        <section id="programs" className="scroll-mt-4 bg-sand px-5 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto max-w-7xl">
            <Reveal className="mb-14 max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Programs</p>
              <h2 className="section-title mt-4">
                Two programs.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-muted">
                Start with a single day that lights the fuse, or spend a year actually building. Both are run by
                founders who have done it themselves.
              </p>
            </Reveal>
            <ProgramStack cards={PROGRAMS} />
          </div>
        </section>

        {/* WAYS TO JOIN: the same programs, delivered at school or on weekends */}
        <section id="join" className="relative scroll-mt-4 bg-linear-to-b from-sand to-white px-5 py-24 sm:px-8 sm:py-32">
          {/* nav targets; the switch picks the matching side */}
          <span id="schools" aria-hidden className="absolute top-0 scroll-mt-4" />
          <span id="students" aria-hidden className="absolute top-0 scroll-mt-4" />
          <div className="mx-auto max-w-7xl">
            <Reveal className="mx-auto mb-12 max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Ways to join</p>
              <h2 className="section-title mt-4">
                At your <span className="text-gradient">school</span>, or on your{" "}
                <span className="text-gradient">weekends</span>.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-muted">
                Both programs run in two ways. Schools bring us onto their campus; students can also join on their
                own at weekends.
              </p>
            </Reveal>
            <WaysToJoin tracks={TRACKS} />
          </div>
        </section>

        {/* 4. MEET THE TEAM */}
        <section id="team" className="scroll-mt-4 bg-linear-to-b from-white to-sand px-5 py-24 text-ink sm:px-8 sm:py-32">
          <div className="mx-auto max-w-6xl">
            <Reveal className="mx-auto max-w-2xl text-center">
              <p className="inline-flex items-center gap-2 rounded-full bg-accent/8 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-accent ring-1 ring-accent/15">
                The people behind it
              </p>
              <h2 className="section-title mt-5">
                Meet the <span className="text-gradient">team</span>
              </h2>
              <div aria-hidden className="bg-accent-gradient mx-auto mt-6 h-1 w-16 rounded-full" />
              <p className="mt-6 text-lg leading-relaxed text-muted">
                Founders, educators and operators who have built things themselves, and now help students do the
                same.
              </p>
            </Reveal>
            <ul className="mt-16 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4 lg:gap-x-8">
              {TEAM.map((m, i) => (
                <Reveal as="li" key={i} delay={i * 90} className="group">
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-sand ring-1 ring-ink/5">
                    {m.photo ? (
                      <Image
                        src={m.photo}
                        alt={m.name}
                        fill
                        sizes="(min-width: 1024px) 270px, 50vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        className="absolute inset-0 m-auto h-1/3 w-1/3 text-ink/20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        aria-hidden
                      >
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 21a8 8 0 0 1 16 0" />
                      </svg>
                    )}
                  </div>
                  <h3 className="mt-5 font-display text-lg font-medium tracking-tight">{m.name}</h3>
                  <p className="mt-1 text-sm font-medium text-accent">{m.role}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{m.previously}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* 4. ENROLL FORM */}
        <section id="enroll" className="scroll-mt-4 bg-linear-to-b from-sand to-white px-5 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto max-w-3xl">
            <Reveal className="mb-12 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Enroll</p>
              <h2 className="section-title mt-4">
                Save a seat
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-muted">
                Spots are limited so every team gets real time with a mentor.
              </p>
            </Reveal>
            <Reveal delay={100}>
              <EnrollForm />
            </Reveal>
          </div>
        </section>
      </main>

      {/* 5. FOOTER */}
      <footer className="bg-night relative px-5 pb-10 pt-20 text-cream sm:px-8">
        <div aria-hidden className="bg-accent-gradient absolute inset-x-0 top-0 h-px" />
        <div className="mx-auto max-w-6xl">
          {/* <Reveal>
            <p className="font-display text-[clamp(2.25rem,1rem+5vw,5rem)] font-extrabold leading-none tracking-[-0.04em]">
              Build it in <span className="text-gradient-light">Chennai.</span>
            </p>
          </Reveal> */}
          <div className="mt-16 grid gap-12 border-t border-cream/15 pt-12 sm:grid-cols-3">
            <div>
              <p className="flex items-center gap-2.5 font-display text-xl font-bold tracking-tight">
                <span className="bg-accent-gradient flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white">
                  L
                </span>
                Loons Club
              </p>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/60">
                Helping students start something before they graduate.
              </p>
            </div>
            <div className="text-sm">
              <p className="font-semibold text-cream/50">Contact</p>
              <ul className="mt-4 space-y-2 text-cream/70">
                <li>
                  <a href="mailto:hello@loonsclub.in" className="transition hover:text-cream">
                    hello@loonsclub.in
                  </a>
                </li>
                <li>
                  <a href="tel:+919840012345" className="transition hover:text-cream">
                    +91 98400 12345
                  </a>
                </li>
                <li className="leading-relaxed">
                  Number, Street,
                  <br />
                  Area, Chennai 600000
                  <br />
                  Tamil Nadu, India
                </li>
              </ul>
            </div>
            <div className="text-sm">
              <p className="font-semibold text-cream/50">Follow</p>
              <ul className="mt-4 flex gap-3">
                {SOCIALS.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      aria-label={s.label}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-cream/5 text-cream/70 ring-1 ring-cream/20 transition hover:-translate-y-0.5 hover:bg-accent hover:text-white hover:ring-accent"
                    >
                      <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        {s.icon}
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-16 flex flex-col gap-2 border-t border-cream/15 pt-6 text-xs text-cream/50 sm:flex-row sm:justify-between">
            <span>© 2026 Loons Club. All rights reserved.</span>
            <span>Made in Chennai</span>
          </div>
        </div>
      </footer>
    </>
  );
}

const SOCIALS = [
  {
    label: "Instagram",
    href: "#",
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M8 10v7M8 7v.01M12 17v-7M12 13.5c0-2 1.2-3.5 3-3.5s2 1.5 2 3V17" />
      </>
    ),
  },
  {
    label: "X",
    href: "#",
    icon: <path d="M4 4l16 16M20 4L4 20" />,
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <>
        <rect x="2.5" y="5" width="19" height="14" rx="4" />
        <path d="M10 9.5v5l4.5-2.5L10 9.5z" />
      </>
    ),
  },
];
