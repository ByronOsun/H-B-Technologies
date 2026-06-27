"use client";

import React, { useEffect, useRef, ReactNode, CSSProperties, type JSX } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  variant?: "up" | "left" | "scale" | "fade";
  threshold?: number;
  tag?: keyof JSX.IntrinsicElements;
}

export default function AnimateIn({
  children,
  className = "",
  style,
  delay = 0,
  variant = "up",
  threshold = 0.15,
  tag: Tag = "div",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${delay}ms`;
          el.classList.add("revealed");
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, threshold]);

  const variantClass =
    variant === "left" ? "revealLeft"
    : variant === "scale" ? "revealScale"
    : "reveal";

  const AnyTag = Tag as "div";
  return (
    <AnyTag
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`${variantClass} ${className}`}
      style={style}
    >
      {children}
    </AnyTag>
  );
}
