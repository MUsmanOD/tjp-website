"use client";

import Image from "next/image";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SiteLink } from "@/components/layout/site-link";
import { JoinBanner } from "@/components/content/join-banner";
import { useLanguage } from "@/components/providers/language-provider";
import { articles } from "@/config/content";
import { media } from "@/config/media";
import { ArticleMeta } from "@/components/content/article-meta";

export function ArticleContent({ index }) {
  const { messages } = useLanguage();
  const article = articles[index];
  const copy = messages.journal.articles[index];
  const photo = media[article.media];
  return <>
    <article className="section-space">
      <Container narrow>
        <SiteLink href="/blogs" className="section-action mb-10"><ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" />{messages.journal.back}</SiteLink>
        <p className="text-eyebrow mb-4">{messages.journal.categories[article.category]}</p>
        <h1 className="heading-page">{copy.title}</h1>
        <p className="text-lead mt-6">{copy.excerpt}</p>
        <ArticleMeta article={article} className="text-small mt-6 text-muted-foreground" />
        <figure className="my-10"><div className="relative aspect-[16/10] overflow-hidden rounded-xl"><Image src={photo.src} alt={messages.media[article.media].alt} fill sizes="(max-width: 767px) 90vw, 768px" className="object-cover" style={{ objectPosition: photo.position }} preload /></div><figcaption className="text-small mt-3 text-muted-foreground">{messages.media[article.media].description} · <a href={photo.source} className="text-link" target="_blank" rel="noopener noreferrer">{messages.gallery.source}</a></figcaption></figure>
        {article.kind === "editorial" && <p className="text-small mb-8 border-s-2 border-primary ps-4 text-muted-foreground">{messages.journal.exampleNote}</p>}
        <div className="article-prose">{copy.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}</div>
        {article.kind !== "editorial" && <p className="text-small mt-8 border-s-2 border-primary ps-4 text-muted-foreground">{messages.journal.sourceNote}{" "}<a href={photo.source} className="text-link" target="_blank" rel="noopener noreferrer">{messages.journal.source}</a>{article.date && <> · {messages.journal.archiveDate}</>}</p>}
        <div className="mt-12 border-t pt-8"><h2 className="heading-card mb-5">{messages.journal.related}</h2>{articles.map((related, relatedIndex) => relatedIndex !== index && <SiteLink key={related.slug} href={`/blogs/${related.slug}`} className="related-link">{messages.journal.articles[relatedIndex].title}<ArrowUpRight className="size-4 shrink-0 rtl:-scale-x-100" aria-hidden="true" /></SiteLink>)}</div>
      </Container>
    </article>
    <JoinBanner />
  </>;
}
