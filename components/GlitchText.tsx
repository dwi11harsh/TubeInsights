"use client";

import { useEffect, useState } from "react";

// Glitch text effect
export function GlitchText({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className={`${className} ${
        isGlitching ? "animate-pulse text-cyan-400" : ""
      } transition-colors duration-200`}
    >
      {children}
    </span>
  );
}
