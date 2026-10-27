"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import * as m from "motion/react-m";
import { useReducedMotion } from "motion/react";
import { Container } from "@/components/layout/container";
import { SiteLink } from "@/components/layout/site-link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";
import { joinBannerImage } from "@/config/media";

export function JoinBanner() {
  const { messages } = useLanguage();
  const reducedMotion = useReducedMotion();
  const content = messages.sections.join;
  return (
    <section className="bg-background py-10 sm:py-14" aria-labelledby="join-title">
      <Container>
        <div className="relative isolate overflow-hidden rounded-2xl bg-primary px-6 py-9 sm:px-10 sm:py-10 lg:px-14" data-scroll-reveal>
          <m.div className="absolute inset-0 -z-20" aria-hidden="true" animate={reducedMotion ? { scale: 1 } : { scale: [1, 1.06, 1] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}>
            <Image src={joinBannerImage.src} alt="" fill sizes="(max-width: 640px) 100vw, 1280px" className="object-cover object-[70%_center] sm:object-center" />
          </m.div>
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/65 to-black/35 rtl:bg-gradient-to-l" aria-hidden="true" />
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <p className="text-eyebrow mb-3 text-white/80">{content.eyebrow}</p>
              <h2 id="join-title" className="heading-section whitespace-pre-line text-white">{content.title}</h2>
              <p className="text-body mt-3 max-w-lg text-white/90">{content.description}</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 lg:shrink-0 lg:flex-col lg:items-start">
              <Button asChild variant="inverse" size="lg" className="bg-white text-primary hover:bg-white/90 hover:text-primary"><SiteLink href="/membership">{content.action}<ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden="true" /></SiteLink></Button>
              <SiteLink href="/contact" className="nav-link gap-2 text-white">{content.secondary}<ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden="true" /></SiteLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
