"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      autoToggle: true,
      stopInertiaOnNavigate: true,
      anchors: true,
      lerp: 0.085,
      smoothWheel: true,
      syncTouch: false,
      prevent: (node) => node.hasAttribute("data-lenis-prevent"),
      // Let the hero own horizontal gestures and preserve native zoom.
      virtualScroll: ({ event }) => !document.body.hasAttribute("data-scroll-locked") && !event.ctrlKey && !event.shiftKey && Math.abs(event.deltaY) >= Math.abs(event.deltaX),
    });
    return () => lenis.destroy();
  }, [pathname]);

  return null;
}
