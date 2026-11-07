"use client";

import { PageIntro } from "@/components/content/page-intro";
import { JoinBanner } from "@/components/content/join-banner";
import { ManifestoSection } from "@/components/home/manifesto-section";
import { LeadershipSection } from "@/components/leadership/leadership-section";
import { Container } from "@/components/layout/container";
import { useLanguage } from "@/components/providers/language-provider";

export function AboutContent() {
  const { messages } = useLanguage();
  const content = messages.aboutPage;
  return <>
    <PageIntro content={content.intro} breadcrumb={messages.navigation.about} showMark={false} />
    <section className="section-space" aria-labelledby="story-title">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <div data-scroll-reveal><p className="text-eyebrow mb-4">{messages.home.about.eyebrow}</p><h2 id="story-title" className="heading-section">{content.storyTitle}</h2></div>
        <div className="stack-content" data-scroll-reveal>{content.story.map((paragraph) => <p className="text-body text-muted-foreground" key={paragraph}>{paragraph}</p>)}<p className="border-s-2 border-primary ps-4 font-medium text-primary">{messages.home.about.note}</p></div>
      </Container>
    </section>
    <ManifestoSection />
    <section className="section-space" aria-labelledby="about-focus-title"><Container><h2 id="about-focus-title" className="heading-section mb-8">{content.focusTitle}</h2><div className="grid gap-5 md:grid-cols-3">{messages.home.focus.items.map((item) => <div key={item.number} className="border-t-2 border-primary pt-5"><span className="text-small text-primary">{item.number}</span><h3 className="heading-card mt-3">{item.title}</h3><p className="text-body mt-3 text-muted-foreground">{item.description}</p></div>)}</div></Container></section>
    <LeadershipSection showPageLink />
    <JoinBanner />
  </>;
}
