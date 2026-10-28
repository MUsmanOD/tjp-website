"use client";

import { BookOpen, Sprout, Users } from "lucide-react";
import { HeroSlider } from "@/components/home/hero-slider";
import { AboutSection } from "@/components/home/about-section";
import { HomeSections } from "@/components/home/home-sections";
import { Container } from "@/components/layout/container";
import { useLanguage } from "@/components/providers/language-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { manifestoEntries } from "@/config/content";

const focusIcons = [BookOpen, Users, Sprout];

export function HomeContent() {
  const { messages, locale } = useLanguage();
  const content = messages.home.focus;
  return (
    <>
      <HeroSlider />
      <AboutSection />
      <section id="manifesto" aria-labelledby="manifesto-title" className="section-space border-t">
        <Container>
          <h2 id="manifesto-title" className="heading-section mb-8" data-scroll-reveal>{messages.home.manifesto.title}</h2>
          {manifestoEntries.length ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-5">
              {manifestoEntries.map((entry, index) => (
                <Card key={index} className="p-4 sm:p-6" data-scroll-reveal>
                  <h3 className="heading-card break-words">{entry.title[locale]}</h3>
                  <p className="text-small mt-2 break-words text-muted-foreground">{entry.name[locale]}</p>
                </Card>
              ))}
            </div>
          ) : <p className="text-body text-muted-foreground">{messages.home.manifesto.empty}</p>}
        </Container>
      </section>
      <section id="focus" tabIndex={-1} aria-labelledby="focus-title" className="section-space border-t bg-surface">
        <Container>
          <div className="mb-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-end" data-scroll-reveal>
            <div>
              <p className="text-eyebrow mb-4">{content.eyebrow}</p>
              <h2 id="focus-title" className="heading-section max-w-xl">{content.title}</h2>
            </div>
            <p className="text-body max-w-sm text-muted-foreground">{content.description}</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {content.items.map((item, index) => {
              const Icon = focusIcons[index];
              return (
                <Card key={index} data-scroll-reveal data-scroll-delay={index * 80}>
                  <CardHeader>
                    <div className="mb-5 flex items-center justify-between">
                      <span className="flex size-11 items-center justify-center rounded-lg border bg-surface text-primary"><Icon className="size-5" aria-hidden="true" /></span>
                      <span className="text-small text-muted-foreground">{item.number}</span>
                    </div>
                    <CardTitle>{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent><p className="text-small text-muted-foreground">{item.description}</p></CardContent>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>
      <HomeSections />
    </>
  );
}
