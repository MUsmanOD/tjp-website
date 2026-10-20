"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SiteLink } from "@/components/layout/site-link";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { media } from "@/config/media";

export function AboutSection() {
  const { messages } = useLanguage();
  const content = messages.home.about;
  return (
    <section id="about" tabIndex={-1} aria-labelledby="about-title" className="section-space bg-background">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-24">
        <figure className="about-portrait" data-scroll-reveal>
          <span className="about-portrait-line" aria-hidden="true" />
          <Image src={media.founder.src} alt={messages.media.founder.alt} fill
            sizes="(max-width: 1023px) 90vw, 42vw" className="object-cover" style={{ objectPosition: media.founder.position }} />
          <figcaption className="about-caption">
            <span className="heading-card text-white">{content.name}</span>
            <span className="text-small text-white/85">{content.role}</span>
          </figcaption>
        </figure>
        <div className="stack-content items-start" data-scroll-reveal data-scroll-delay="80">
          <p className="text-eyebrow flex items-center gap-3"><span className="h-px w-9 bg-primary" aria-hidden="true" />{content.eyebrow}</p>
          <h2 id="about-title" className="heading-section whitespace-pre-line">{content.title}</h2>
          <p className="text-body max-w-lg text-muted-foreground">{content.description}</p>
          <p className="text-body max-w-lg text-muted-foreground">{content.leadership}</p>
          <p className="text-small border-s-2 border-primary ps-4 font-medium text-primary">{content.note}</p>
          <Button size="lg" asChild><SiteLink href="/blogs/general-hamid-gul-founder">{content.link}<ArrowUpRight aria-hidden="true" className="rtl:-scale-x-100" /></SiteLink></Button>
        </div>
      </Container>
    </section>
  );
}
