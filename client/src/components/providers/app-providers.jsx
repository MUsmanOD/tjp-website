"use client";

import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { LazyMotion, MotionConfig } from "motion/react";
import { createQueryClient } from "@/lib/query-client.mjs";

const loadMotionFeatures = () =>
  import("@/lib/motion-features").then((module) => module.default);

export function AppProviders({ children }) {
  // A provider-owned instance survives navigation and never shares SSR data between requests.
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig
        reducedMotion="user"
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <LazyMotion features={loadMotionFeatures} strict>
          {children}
        </LazyMotion>
      </MotionConfig>
    </QueryClientProvider>
  );
}
