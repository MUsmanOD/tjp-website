import { notFound } from "next/navigation";
import { ArticleContent } from "@/components/journal/article-content";
import { articles } from "@/config/content";
import { translations } from "@/i18n/messages";

export function generateStaticParams() {
  return articles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const index = articles.findIndex((article) => article.slug === slug);
  if (index < 0) return {};
  return { title: `${translations.en.journal.articles[index].title} | TJP`, description: translations.en.journal.articles[index].excerpt };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const index = articles.findIndex((article) => article.slug === slug);
  if (index < 0) notFound();
  return <main id="main-content" tabIndex={-1} className="flex-1"><ArticleContent index={index} /></main>;
}
