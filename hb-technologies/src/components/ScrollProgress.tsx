"use client";

import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const total = scrollHeight - clientHeight;
      setPct(total > 0 ? Math.min((scrollTop / total) * 100, 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 200,
        height: "3px",
        width: `${pct}%`,
        background: "linear-gradient(90deg, #C8102E, #FF6B6B)",
        transition: "width .1s linear",
        pointerEvents: "none",
        willChange: "width",
      }}
      aria-hidden="true"
    />
  );
}
