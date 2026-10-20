"use client";

import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SiteLink } from "@/components/layout/site-link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";

export function JoinBanner() {
  const { messages } = useLanguage();
  const content = messages.sections.join;
  return (
    <section className="join-section section-space" aria-labelledby="join-title">
      <Container>
        <div className="join-banner" data-scroll-reveal>
          <div className="join-decoration" aria-hidden="true" />
          <div className="relative max-w-2xl">
            <p className="text-eyebrow mb-4 text-white/75">{content.eyebrow}</p>
            <h2 id="join-title" className="heading-section whitespace-pre-line text-white">{content.title}</h2>
            <p className="text-body mt-5 max-w-lg text-white/85">{content.description}</p>
          </div>
          <div className="relative flex shrink-0 flex-col items-start gap-3">
            <Button asChild variant="inverse" size="lg" className="bg-white text-primary hover:bg-white/90 hover:text-primary"><SiteLink href="/membership">{content.action}<ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden="true" /></SiteLink></Button>
            <SiteLink href="/contact" className="nav-link gap-2 text-white">{content.secondary}<ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden="true" /></SiteLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
