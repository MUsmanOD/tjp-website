"use client";

import { Container } from "@/components/layout/container";
import { useLanguage } from "@/components/providers/language-provider";
import { Check } from "lucide-react";

export function ManifestoSection() {
  const { messages, locale } = useLanguage();
  const content = messages.home.manifesto;

  return (
    <section id="manifesto" tabIndex={-1} aria-labelledby="manifesto-title" className="section-space border-y bg-surface">
      <Container>
        <div className="manifesto-inner" dir={locale === "ur" ? "rtl" : "ltr"}>
          <div className="manifesto-heading" data-scroll-reveal>
            <p className="text-eyebrow mb-3 text-white/75">{content.eyebrow}</p>
            <h2 id="manifesto-title" className="heading-section text-white">{content.title}</h2>
          </div>
          <ul className="manifesto-list">
            {content.items.map((item, index) => (
              <li key={`${index}-${item}`} className="manifesto-row" data-scroll-reveal data-scroll-delay={Math.min(index * 45, 225)}>
                <span className="manifesto-icon" aria-hidden="true"><Check className="size-5" strokeWidth={2.5} /></span>
                <p>{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
