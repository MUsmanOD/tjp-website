"use client";

import { ArrowUpRight } from "lucide-react";
import { SiteLink } from "@/components/layout/site-link";

export function SectionHeading({ content, id, href }) {
  return (
    <div className="section-heading" data-scroll-reveal>
      <div className="max-w-2xl">
        <p className="text-eyebrow mb-3">{content.eyebrow}</p>
        <h2 id={id} className="heading-section">{content.title}</h2>
        {content.description && <p className="text-body mt-4 max-w-xl text-muted-foreground">{content.description}</p>}
      </div>
      {href && <SiteLink href={href} className="section-action">{content.action}<ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden="true" /></SiteLink>}
    </div>
  );
}
