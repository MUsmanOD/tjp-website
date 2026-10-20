"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "motion/react";

const selector = "[data-scroll-reveal]";

export function ScrollReveals() {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const main = document.getElementById("main-content");
    if (!main || reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !window.IntersectionObserver || !Element.prototype.animate) return;

    const observed = new WeakSet();
    const animations = new Map();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const element = entry.target;
        observer.unobserve(element);
        if (!element.isConnected || element.contains(document.activeElement) || entry.boundingClientRect.bottom < 0) continue;

        // Animate on entry without hiding server-rendered or offscreen content.
        const animation = element.animate([
          { opacity: 0, transform: "translateY(20px)" },
          { opacity: 1, transform: "translateY(0)" },
        ], {
          duration: 600,
          delay: Math.min(Number(element.dataset.scrollDelay) || 0, 240),
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "backwards",
        });
        animations.set(element, animation);
        animation.onfinish = animation.oncancel = () => animations.delete(element);
      }
    }, { rootMargin: "0px 0px -24px 0px", threshold: 0 });

    function observe(element) {
      if (observed.has(element)) return;
      observed.add(element);
      observer.observe(element);
    }

    function observeTree(node) {
      if (!(node instanceof Element)) return;
      if (node.matches(selector)) observe(node);
      node.querySelectorAll(selector).forEach(observe);
    }

    observeTree(main);
    // Include cards inserted by gallery filters and journal search.
    const mutations = new MutationObserver((records) => {
      for (const record of records) record.addedNodes.forEach(observeTree);
    });
    mutations.observe(main, { childList: true, subtree: true });

    const revealFocused = (event) => {
      const element = event.target.closest(selector);
      animations.get(element)?.cancel();
    };
    main.addEventListener("focusin", revealFocused);

    return () => {
      observer.disconnect();
      mutations.disconnect();
      main.removeEventListener("focusin", revealFocused);
      for (const animation of animations.values()) animation.cancel();
    };
  }, [pathname, reducedMotion]);

  return null;
}
