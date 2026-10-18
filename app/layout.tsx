import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

// Hero typeface (licensed files live in /public)
const clamp = localFont({
  variable: "--font-clamp",
  src: [
    { path: "../public/Clamp-Light-BF6a4db666a34da.otf", weight: "300", style: "normal" },
    { path: "../public/Clamp-LightItalic-BF6a4db666c5c71.otf", weight: "300", style: "italic" },
  ],
  display: "swap",
});

// Cut-out ransom-note face for "Crazy Ones"
const kaito = localFont({
  variable: "--font-kaito",
  src: "../public/PolandCannedIntoKaito-G3ErD.otf",
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Loons Club — For the Crazy Club",
  description:
    "A founder program for students in Chennai: spot a real problem, shape an idea, and pitch it to real founders.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${clamp.variable} ${manrope.variable} ${inter.variable} ${kaito.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
