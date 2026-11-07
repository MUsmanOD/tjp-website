"use client";

import { PortraitBadge } from "@/components/leadership/portrait-badge";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SiteLink } from "@/components/layout/site-link";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { useWebsite, visibleLeaders } from "@/lib/website-content";

export function AboutSection() {
  const { messages, locale } = useLanguage();
  const content = messages.home.about;
  const founder = visibleLeaders(useWebsite(), messages, locale).find(({ id }) => id === "founder");
  return (
    <section id="about" tabIndex={-1} aria-labelledby="about-title" className="section-space bg-background">
      <Container className={founder ? "grid items-center gap-12 lg:grid-cols-[minmax(0,0.8fr)_1.2fr] lg:gap-24" : undefined}>
        {founder && <div data-scroll-reveal><PortraitBadge className="portrait-badge-large" src={founder.imageUrl} alt={founder.alt} name={founder.name} cropBottom sizes="(max-width: 1023px) 75vw, 30vw" /></div>}
        <div className="stack-content items-start" data-scroll-reveal data-scroll-delay="80">
          <p className="text-eyebrow flex items-center gap-3"><span className="h-px w-9 bg-primary" aria-hidden="true" />{content.eyebrow}</p>
          <h2 id="about-title" className="heading-section whitespace-pre-line">{content.title}</h2>
          <p className="text-body max-w-lg text-muted-foreground">{content.description}</p>
          <p className="text-body max-w-lg text-muted-foreground">{content.leadership}</p>
          <p className="text-small border-s-2 border-primary ps-4 font-medium text-primary">{content.note}</p>
          <Button size="lg" asChild><SiteLink href="/about-us">{content.link}<ArrowUpRight aria-hidden="true" className="rtl:-scale-x-100" /></SiteLink></Button>
        </div>
      </Container>
    </section>
  );
}
