"use client";

import * as m from "motion/react-m";
import { cn } from "@/lib/utils";

// Keep content visible in the server HTML; animate only deliberate interactions.
export function InteractiveText({ children, className }) {
  return (
    <m.span
      initial={false}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={cn("inline-block", className)}
    >
      {children}
    </m.span>
  );
}
