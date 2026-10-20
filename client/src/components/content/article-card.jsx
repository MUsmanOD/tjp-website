"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SiteLink } from "@/components/layout/site-link";
import { useLanguage } from "@/components/providers/language-provider";
import { ArticleMeta } from "@/components/content/article-meta";
import { media } from "@/config/media";

export function ArticleCard({ article, index, headingAs: Heading = "h3" }) {
  const { messages } = useLanguage();
  const copy = messages.journal.articles[index];
  const photo = media[article.media];
  return (
    <Card className="editorial-card group">
      <SiteLink href={`/blogs/${article.slug}`} className="article-image" tabIndex={-1} aria-hidden="true">
        <Image src={photo.src} alt="" fill sizes="(max-width: 767px) 90vw, 30vw" className="object-cover transition-transform duration-700 group-hover:scale-105" style={{ objectPosition: photo.position }} />
        <span className="image-category">{messages.journal.categories[article.category]}</span>
      </SiteLink>
      <div className="flex flex-1 flex-col items-start p-6 sm:p-7">
        <ArticleMeta article={article} className="text-small mb-3 text-muted-foreground" />
        <Heading className="heading-card"><SiteLink href={`/blogs/${article.slug}`} className="card-title-link">{copy.title}</SiteLink></Heading>
        <p className="text-body mt-3 text-muted-foreground">{copy.excerpt}</p>
        <SiteLink href={`/blogs/${article.slug}`} className="section-action mt-6" aria-label={`${messages.journal.read}: ${copy.title}`}>{messages.journal.read}<ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden="true" /></SiteLink>
      </div>
    </Card>
  );
}
