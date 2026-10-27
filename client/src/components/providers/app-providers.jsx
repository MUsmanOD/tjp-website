"use client";

import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { LazyMotion, MotionConfig } from "motion/react";
import { createQueryClient } from "@/lib/query-client.mjs";
import { LanguageProvider } from "@/components/providers/language-provider";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { ScrollReveals } from "@/components/providers/scroll-reveals";
import { VisitorAnalytics } from "@/components/providers/visitor-analytics";

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
          <LanguageProvider><SmoothScroll /><ScrollReveals /><VisitorAnalytics />{children}</LanguageProvider>
        </LazyMotion>
      </MotionConfig>
    </QueryClientProvider>
  );
}
