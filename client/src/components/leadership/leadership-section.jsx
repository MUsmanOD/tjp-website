"use client";

import { PortraitBadge } from "@/components/leadership/portrait-badge";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/content/section-heading";
import { useLanguage } from "@/components/providers/language-provider";
import { useWebsite, visibleLeaders } from "@/lib/website-content";

export function LeadershipSection({ showPageLink = false }) {
  const { messages, locale } = useLanguage();
  const leaders = visibleLeaders(useWebsite(), messages, locale);
  const content = messages.leadership;
  if (!leaders.length) return null;

  return (
    <section className="section-space" aria-labelledby="leadership-title">
      <Container>
        <SectionHeading content={content.section} id="leadership-title" href={showPageLink ? "/leadership" : undefined} />
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-8">
          {leaders.map((profile, index) => {
            return (
              <article key={profile.id} className="grid gap-6 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] sm:items-center" data-scroll-reveal data-scroll-delay={Math.min(index, 4) * 80}>
                <PortraitBadge src={profile.imageUrl} alt={profile.alt} name={profile.name} cropBottom={profile.id === "founder"} heading />
                <div className="flex flex-col items-start">
                  <p className="text-eyebrow">{profile.role}</p>
                  <p className="text-body mt-4 text-muted-foreground">{profile.description}</p>
                  {profile.source && <a href={profile.source} target="_blank" rel="noopener noreferrer" className="section-action mt-4">{content.source}<ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden="true" /></a>}
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
