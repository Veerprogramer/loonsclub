import type { ProgramCard } from "../components/ProgramStack";

export type JoinStep = { title: string; detail: string; meta: string };

// One block of the program: a session in the bootcamp, a phase in the year-long program
export type Session = {
  label: string;
  format: string;
  title: string;
  summary: string;
  topics: { title: string; detail: string }[];
};

export type Program = ProgramCard & {
  slug: string;
  number: string;
  duration: string;
  tagline: string;
  // focal point for the tall hero crop, as a CSS object-position
  imagePosition: string;
  facts: { label: string; value: string }[];
  // what the blocks in `sessions` are called
  sessionUnit: "Sessions" | "Phases";
  join: JoinStep[];
  outcomes: string[];
  sessions: Session[];
};

export const PROGRAMS: Program[] = ([
  {
    slug: "startup-bootcamp",
    number: "01",
    duration: "1 day",
    eyebrow: "Program 01 · 1 day",
    title: "Startup Bootcamp",
    tagline: "One day that lights the fuse.",
    body: "Founders who have built startups introduce students to the world of startups and entrepreneurship: Ideal Customer Profile, Value Proposition, MVP, Product Market Fit and Business Model. Then students generate an idea of their own and pitch it.",
    image: "https://images.unsplash.com/photo-1758873269320-372f7ad170f0?w=1600&q=80&auto=format&fit=crop",
    imageAlt: "Colleagues collaborating around a table in an office",
    imagePosition: "35% 50%",
    sessionUnit: "Sessions",
    facts: [
      { label: "Duration", value: "One full day" },
      { label: "Where", value: "Your school, or a weekend at IITM Research Park" },
      { label: "Led by", value: "Founders who have built startups" },
      { label: "You leave with", value: "An idea you have pitched" },
    ],
    join: [
      { title: "Save a seat", detail: "Fill in the short enrollment form with your name, school and a way to reach you.", meta: "2 minutes" },
      { title: "We call you back", detail: "Someone from the team calls to answer your questions and confirm your seat.", meta: "Within 2 days" },
      { title: "Pick your day", detail: "Join when the bootcamp comes to your school, or pick a weekend date at IITM Research Park.", meta: "School or weekend" },
      { title: "Show up curious", detail: "No preparation and no experience needed. Bring a notebook and an open mind.", meta: "Day one" },
    ],
    outcomes: [
      "A clear picture of what founders actually do",
      "The difference between a startup and a business",
      "A startup idea your team came up with",
      "Your first pitch, with feedback from founders",
    ],
    sessions: [
      {
        label: "Morning",
        format: "Talk",
        title: "Entrepreneurship: An introduction",
        summary: "What it means to be an entrepreneur, and why it matters. We start with the people behind the products students use every day.",
        topics: [
          { title: "Who founders are", detail: "Ordinary people who noticed something broken and decided to fix it." },
          { title: "Problems are everywhere", detail: "Learning to see the small frustrations around you as opportunities." },
        ],
      },
      {
        label: "Morning",
        format: "Workshop",
        title: "Startup vs. business",
        summary: "Why startups are built to grow fast, and how that changes everything about how they are run.",
        topics: [
          { title: "Ideal Customer Profile", detail: "Who exactly you are building for, and why being specific wins." },
          { title: "Product Market Fit", detail: "How you know people want what you have made." },
          { title: "Business model", detail: "How a startup makes money, and how that can grow." },
        ],
      },
      {
        label: "Midday",
        format: "Founder talk",
        title: "Founder talk: Startup journey",
        summary: "A founder shares the real story behind their startup: the idea, the early days, the mistakes and what kept them going.",
        topics: [
          { title: "The honest version", detail: "What the press releases leave out." },
          { title: "Open questions", detail: "Students ask the founder anything." },
        ],
      },
      {
        label: "Afternoon",
        format: "Team workshop",
        title: "Idea generation",
        summary: "Teams spot a problem and shape a startup idea of their own, with mentors moving from table to table.",
        topics: [
          { title: "Find the problem", detail: "Pick a problem your team has seen up close." },
          { title: "Shape the idea", detail: "Who it is for, what it does and why it matters." },
          { title: "Build the pitch", detail: "Turn the idea into a short story you can tell." },
        ],
      },
      {
        label: "Evening",
        format: "Pitch",
        title: "Pitch & validation",
        summary: "Every team pitches its idea to a panel of founders and finds out how well it holds up.",
        topics: [
          { title: "Three-minute pitch", detail: "Present the problem, the idea and who it is for." },
          { title: "Founder feedback", detail: "Honest questions and advice on where to take it next." },
        ],
      },
    ],
    agenda: [
      { title: "Entrepreneurship: An introduction", detail: "What it means to be an entrepreneur, and why it matters." },
      { title: "Startup vs. business", detail: "Why startups are built to grow fast, and how that changes everything." },
      { title: "Founder talk: Startup journey", detail: "A founder shares the real story behind their startup." },
      { title: "Idea Generation", detail: "Teams spot a problem and shape a startup idea of their own." },
      { title: "Pitch & Validation", detail: "Pitch the idea to founders and see how well it holds up." },
    ],
  },
  {
    slug: "becoming-entrepreneurial",
    number: "02",
    duration: "1 year",
    eyebrow: "Program 02 · 1 year",
    title: "Becoming Entrepreneurial",
    tagline: "A year of actually building.",
    body: "Students go through the early stages of building a real startup, from idea to Product Market Fit. They find co-founders, generate ideas and work through every step in between. If they find the right fit, they can go on to launch.",
    image: "https://images.unsplash.com/photo-1714976326743-9d2256f53bad?w=1600&q=80&auto=format&fit=crop",
    imageAlt: "A group of people sitting around a table, looking at a laptop together",
    imagePosition: "50% 40%",
    sessionUnit: "Phases",
    facts: [
      { label: "Duration", value: "One academic year" },
      { label: "Where", value: "Your school, or weekends at IITM Research Park" },
      { label: "Led by", value: "Founders and mentors, every session" },
      { label: "You leave with", value: "A tested product, maybe a launch" },
    ],
    join: [
      { title: "Save a seat", detail: "Fill in the short enrollment form and tell us a little about yourself.", meta: "2 minutes" },
      { title: "Intro conversation", detail: "A short call to hear what excites you and explain how the year works.", meta: "Within a week" },
      { title: "Choose how you join", detail: "Through your school across the academic year, or on weekends with students from across Chennai.", meta: "School or weekend" },
      { title: "Meet your team", detail: "Find your co-founders and meet the mentor who will stay with you all year.", meta: "Day one" },
    ],
    outcomes: [
      "A team of co-founders you chose yourself",
      "Real conversations with real customers",
      "A first version of your product",
      "A path to launch, if the fit is there",
    ],
    sessions: [
      {
        label: "Phase 1",
        format: "Idea & team",
        title: "Find an idea worth pursuing",
        summary: "Think like a founder, form a team and find an idea worth the year.",
        topics: [
          { title: "Entrepreneurial mindset", detail: "How founders think about risk, failure and ownership." },
          { title: "Ideation", detail: "Generate many ideas, then narrow down to the strongest." },
          { title: "Co-founders", detail: "Find people whose strengths cover your gaps." },
          { title: "Idea validation", detail: "Test whether the problem is real before building anything." },
          { title: "Ideal Customer Profile", detail: "Describe the exact person you are building for." },
        ],
      },
      {
        label: "Phase 2",
        format: "Customer",
        title: "Get out and talk to customers",
        summary: "Talk to real customers and sharpen what you offer them.",
        topics: [
          { title: "Customer discovery interviews", detail: "Ask the questions that reveal what people really need." },
          { title: "Value proposition", detail: "Say clearly why your product is worth someone's time and money." },
          { title: "Entrepreneurial mindset II", detail: "Handling rejection, changing direction and staying with it." },
        ],
      },
      {
        label: "Phase 3",
        format: "Build & launch",
        title: "Build it and take it to market",
        summary: "Build a first version, iterate towards fit, and take it to market.",
        topics: [
          { title: "MVP", detail: "The smallest version that proves the idea works." },
          { title: "Product Market Fit", detail: "Measure whether people want it, and keep improving until they do." },
          { title: "Go-to-market", detail: "Plan how the product reaches its first customers." },
        ],
      },
    ],
    agenda: [
      {
        time: "Phase 1",
        title: "Idea & team",
        detail: "Think like a founder, form a team and find an idea worth pursuing.",
        steps: ["Entrepreneurial mindset", "Ideation", "Co-founders", "Idea validation", "Ideal Customer Profile"],
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
] satisfies Program[]).map((p) => ({ ...p, href: `/programs/${p.slug}` }));

export const getProgram = (slug: string) => PROGRAMS.find((p) => p.slug === slug);
