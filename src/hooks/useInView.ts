import { useEffect, useRef, useState } from "react";

/**
 * Returns a ref to attach to an element and a boolean that flips to true
 * once the element scrolls into view (then stays true). Used for subtle
 * scroll-reveal animations on the homepage.
 */
export function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [isInView, setIsInView] = useState(() => {
    if (typeof window === "undefined") return false;
    // Respect reduced-motion preferences: show immediately, no animation gating.
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (isInView) return; // already revealed (reduced motion, or already observed)
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, isInView]);

  return { ref, isInView };
}
