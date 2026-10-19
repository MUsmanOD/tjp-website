"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SiteLink } from "@/components/layout/site-link";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";

export function AboutSection() {
  const { messages } = useLanguage();
  const content = messages.home.about;
  return (
    <section id="about" tabIndex={-1} aria-labelledby="about-title" className="section-space bg-background">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-24">
        <figure className="about-portrait">
          <span className="about-portrait-line" aria-hidden="true" />
          <Image src="/images/abdullah-gul.png" alt={content.imageAlt} fill
            sizes="(max-width: 1023px) 90vw, 42vw" className="object-contain object-bottom" />
          <figcaption className="about-caption">
            <span className="heading-card text-white">{content.name}</span>
            <span className="text-small text-white/85">{messages.brand.name}</span>
          </figcaption>
        </figure>
        <div className="stack-content items-start">
          <p className="text-eyebrow flex items-center gap-3"><span className="h-px w-9 bg-primary" aria-hidden="true" />{content.eyebrow}</p>
          <h2 id="about-title" className="heading-section whitespace-pre-line">{content.title}</h2>
          <p className="text-body max-w-lg text-muted-foreground">{content.description}</p>
          <p className="text-small border-s-2 border-primary ps-4 font-medium text-primary">{content.note}</p>
          <Button size="lg" asChild><SiteLink href="/#focus">{content.link}<ArrowUpRight aria-hidden="true" className="rtl:-scale-x-100" /></SiteLink></Button>
        </div>
      </Container>
    </section>
  );
}
