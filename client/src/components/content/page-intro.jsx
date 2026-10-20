"use client";

import { Container } from "@/components/layout/container";
import { SiteLink } from "@/components/layout/site-link";
import { useLanguage } from "@/components/providers/language-provider";
import { ArrowUpRight } from "lucide-react";

export function PageIntro({ content, breadcrumb, showMark = true }) {
  const { messages } = useLanguage();
  return (
    <section className="page-intro">
      <Container>
        <div className="text-small mb-9 flex items-center gap-3 text-muted-foreground">
          <SiteLink href="/" className="text-link">{messages.navigation.home}</SiteLink>
          <span aria-hidden="true">/</span><span>{breadcrumb || content.eyebrow}</span>
        </div>
        <div className="flex items-end justify-between gap-8">
          <div className="max-w-3xl">
            <p className="text-eyebrow mb-4">{content.eyebrow}</p>
            <h1 className="heading-page whitespace-pre-line">{content.title}</h1>
            <p className="text-lead mt-6 max-w-xl">{content.description}</p>
          </div>
          {showMark && <span className="page-intro-mark" aria-hidden="true"><ArrowUpRight className="size-10 rtl:-scale-x-100" /></span>}
        </div>
      </Container>
    </section>
  );
}
