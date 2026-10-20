"use client";

import { Container } from "@/components/layout/container";
import { SiteLink } from "@/components/layout/site-link";
import { useLanguage } from "@/components/providers/language-provider";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageIntro({ content, breadcrumb, showMark = true, compact = false }) {
  const { messages } = useLanguage();
  return (
    <section className={cn("page-intro", compact && "py-8 sm:py-10")}>
      <Container>
        <div className={cn("text-small flex items-center gap-3 text-muted-foreground", compact ? "mb-5" : "mb-9")}>
          <SiteLink href="/" className="text-link">{messages.navigation.home}</SiteLink>
          <span aria-hidden="true">/</span><span>{breadcrumb || content.eyebrow}</span>
        </div>
        <div className="flex items-end justify-between gap-8" data-scroll-reveal>
          <div className="max-w-3xl">
            <p className={cn("text-eyebrow", compact ? "mb-3" : "mb-4")}>{content.eyebrow}</p>
            <h1 className={cn("heading-page whitespace-pre-line", compact && "text-3xl sm:text-4xl lg:text-5xl")}>{content.title}</h1>
            <p className={cn("max-w-xl", compact ? "text-body mt-4" : "text-lead mt-6")}>{content.description}</p>
          </div>
          {showMark && <span className="page-intro-mark" aria-hidden="true"><ArrowUpRight className="size-10 rtl:-scale-x-100" /></span>}
        </div>
      </Container>
    </section>
  );
}
