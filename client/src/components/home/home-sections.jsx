"use client";

import { ArrowUpRight, Images, MessageSquare, UserPlus } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SiteLink } from "@/components/layout/site-link";
import { SocialLinks } from "@/components/layout/social-links";
import { useLanguage } from "@/components/providers/language-provider";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/content/section-heading";
import { LeadershipSection } from "@/components/leadership/leadership-section";
import { JoinBanner } from "@/components/content/join-banner";
import { FacebookFeed } from "@/components/home/facebook-feed";
import { HomeGallery } from "@/components/home/home-gallery";

const participation = [
  { icon: UserPlus, href: "/membership" },
  { icon: MessageSquare, href: "/contact" },
  { icon: Images, href: "/gallery" },
];

export function HomeSections() {
  const { messages } = useLanguage();
  return (
    <>
      <LeadershipSection showPageLink />

      <section id="social" tabIndex={-1} className="section-space border-y bg-surface" aria-labelledby="social-title">
        <Container>
          <div className="section-heading" data-scroll-reveal>
            <div className="max-w-xl"><p className="text-eyebrow mb-3">{messages.social.eyebrow}</p><h2 id="social-title" className="heading-section">{messages.social.title}</h2><p className="text-body mt-4 text-muted-foreground">{messages.social.description}</p></div>
            <SocialLinks className="social-links-outlined" />
          </div>
          <FacebookFeed />
        </Container>
      </section>

      <section className="section-space" aria-labelledby="gallery-title">
        <Container>
          <SectionHeading content={messages.sections.gallery} id="gallery-title" href="/gallery" />
          <HomeGallery />
        </Container>
      </section>

      <section className="section-space border-y bg-surface" aria-labelledby="participate-title">
        <Container>
          <SectionHeading content={messages.sections.participate} id="participate-title" />
          <Card className="grid gap-0 overflow-hidden md:grid-cols-3" data-scroll-reveal>
            {participation.map(({ icon: Icon, href }, index) => {
              const item = messages.sections.participate.items[index];
              return (
                <div key={href} className="participation-card">
                  <Icon className="size-5 text-primary" aria-hidden="true" />
                  <h3 className="heading-card mt-4">{item.title}</h3>
                  <p className="text-body mb-4 mt-2 text-muted-foreground">{item.description}</p>
                  <SiteLink href={href} className="section-action mt-auto">{item.action}<ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden="true" /></SiteLink>
                </div>
              );
            })}
          </Card>
        </Container>
      </section>
      <JoinBanner />
    </>
  );
}
