"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SiteLink } from "@/components/layout/site-link";
import { useLanguage } from "@/components/providers/language-provider";

export function ArticleCard({ article, index, headingAs: Heading = "h3" }) {
  const { messages, locale } = useLanguage();
  const copy = messages.journal.articles[index];
  return (
    <Card className="editorial-card group">
      <SiteLink href={`/blogs/${article.slug}`} className="article-image" tabIndex={-1} aria-hidden="true">
        <Image src={article.image} alt="" fill sizes="(max-width: 767px) 90vw, 30vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
        <span className="image-category">{messages.journal.categories[article.category]}</span>
      </SiteLink>
      <div className="flex flex-1 flex-col items-start p-6 sm:p-7">
        <p className="text-small mb-3 text-muted-foreground">{messages.journal.editorial}<span className="mx-2" aria-hidden="true">·</span>{new Intl.NumberFormat(locale).format(article.minutes)} {messages.journal.minutes}</p>
        <Heading className="heading-card"><SiteLink href={`/blogs/${article.slug}`} className="card-title-link">{copy.title}</SiteLink></Heading>
        <p className="text-body mt-3 text-muted-foreground">{copy.excerpt}</p>
        <SiteLink href={`/blogs/${article.slug}`} className="section-action mt-6" aria-label={`${messages.journal.read}: ${copy.title}`}>{messages.journal.read}<ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden="true" /></SiteLink>
      </div>
    </Card>
  );
}
