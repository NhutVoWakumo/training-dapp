"use client";

import { useEffect, useState } from "react";

export const enum Breakpoint {
  SM = 640,
  MD = 768,
  LG = 1024,
  XL = 1280,
  XXL = 1536,
}

// this hook will return true when the width of screen below the breakpoint
export const useDetectScreenBreakpoint = (width: Breakpoint) => {
  const [targetReached, setTargetReached] = useState<boolean>(false);

  const updateTarget = (e: MediaQueryListEvent) => {
    setTargetReached(e.matches);
  };

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${width}px)`);
    media.addEventListener("change", updateTarget);

    if (media.matches) {
      setTargetReached(true);
    }

    return () => media.removeEventListener("change", updateTarget);
  }, [width]);

  return targetReached;
};
