"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PageIntro } from "@/components/content/page-intro";
import { JoinBanner } from "@/components/content/join-banner";
import { ArticleCard } from "@/components/content/article-card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";
import { articles } from "@/config/content";

export function JournalContent() {
  const { messages, locale } = useLanguage();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const visible = articles.map((article, index) => ({ ...article, index })).filter((article) => {
    const copy = messages.journal.articles[article.index];
    return (filter === "all" || article.category === filter) && `${copy.title} ${copy.excerpt}`.toLocaleLowerCase(locale).includes(search.trim().toLocaleLowerCase(locale));
  });
  return <>
    <PageIntro content={messages.journal} breadcrumb={messages.navigation.blogs} />
    <section className="section-space"><Container>
      <div className="journal-toolbar">
        <div className="filter-row mb-0" role="group" aria-label={messages.journal.categoryLabel}>{["all", ...Object.keys(messages.journal.categories)].map((key) => <button key={key} type="button" className="filter-chip" aria-pressed={filter === key} onClick={() => setFilter(key)}>{key === "all" ? messages.journal.all : messages.journal.categories[key]}</button>)}</div>
        <label className="search-field"><Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" /><span className="sr-only">{messages.journal.search}</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={messages.journal.searchPlaceholder} /></label>
      </div>
      <div className="grid gap-6 md:grid-cols-3">{visible.map((article) => <ArticleCard key={article.slug} article={article} index={article.index} headingAs="h2" />)}</div>
      {visible.length === 0 && <div className="empty-state" role="status"><Search className="mx-auto mb-5 size-8 text-primary" aria-hidden="true" /><p className="text-lead">{messages.journal.empty}</p><Button variant="outline" className="mt-6" onClick={() => { setFilter("all"); setSearch(""); }}>{messages.journal.reset}</Button></div>}
    </Container></section>
    <JoinBanner />
  </>;
}
