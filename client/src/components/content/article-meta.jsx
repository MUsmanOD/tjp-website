"use client";

import { useLanguage } from "@/components/providers/language-provider";

export function ArticleMeta({ article, className }) {
  const { messages, locale } = useLanguage();
  return <p className={className}>
    {messages.journal.kinds[article.kind]}
    {article.date && <><span className="mx-2" aria-hidden="true">·</span><time dateTime={article.date}>{new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeZone: "UTC" }).format(new Date(`${article.date}T00:00:00Z`))}</time></>}
    <span className="mx-2" aria-hidden="true">·</span>{new Intl.NumberFormat(locale).format(article.minutes)} {messages.journal.minutes}
  </p>;
}
