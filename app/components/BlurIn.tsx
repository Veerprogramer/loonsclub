"use client";

import { useEffect, useState, type ReactNode } from "react";

// Fades its children in from a soft blur once the page has loaded, after `delay` ms.
export default function BlurIn({
  children,
  delay = 400,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const start = () => {
      timer = setTimeout(() => setShown(true), delay);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", start);
    };
  }, [delay]);

  return <div className={`blur-in ${shown ? "is-shown" : ""} ${className}`}>{children}</div>;
}
