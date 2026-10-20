"use client";

import Image from "next/image";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SiteLink } from "@/components/layout/site-link";
import { JoinBanner } from "@/components/content/join-banner";
import { useLanguage } from "@/components/providers/language-provider";
import { articles } from "@/config/content";

export function ArticleContent({ index }) {
  const { messages, locale } = useLanguage();
  const article = articles[index];
  const copy = messages.journal.articles[index];
  return <>
    <article className="section-space">
      <Container narrow>
        <SiteLink href="/blogs" className="section-action mb-10"><ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" />{messages.journal.back}</SiteLink>
        <p className="text-eyebrow mb-4">{messages.journal.categories[article.category]}</p>
        <h1 className="heading-page">{copy.title}</h1>
        <p className="text-lead mt-6">{copy.excerpt}</p>
        <p className="text-small mt-6 text-muted-foreground">{messages.journal.editorial} · {new Intl.NumberFormat(locale).format(article.minutes)} {messages.journal.minutes}</p>
        <div className="relative my-10 aspect-[16/10] overflow-hidden rounded-xl"><Image src={article.image} alt={messages.home.slides[[0, 3, 2][index]].alt} fill sizes="(max-width: 767px) 90vw, 768px" className="object-cover" preload /></div>
        <div className="article-prose">{copy.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}</div>
        <div className="mt-12 border-t pt-8"><h2 className="heading-card mb-5">{messages.journal.related}</h2>{articles.map((related, relatedIndex) => relatedIndex !== index && <SiteLink key={related.slug} href={`/blogs/${related.slug}`} className="related-link">{messages.journal.articles[relatedIndex].title}<ArrowUpRight className="size-4 shrink-0 rtl:-scale-x-100" aria-hidden="true" /></SiteLink>)}</div>
      </Container>
    </article>
    <JoinBanner />
  </>;
}
