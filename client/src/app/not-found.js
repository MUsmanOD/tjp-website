"use client";

import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SiteLink } from "@/components/layout/site-link";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const { messages } = useLanguage();
  return <main id="main-content" tabIndex={-1} className="section-space flex flex-1 items-center bg-surface"><Container narrow className="text-center"><p className="text-eyebrow mb-5">{messages.notFound.code}</p><h1 className="heading-page">{messages.notFound.title}</h1><p className="text-lead mx-auto mt-6 max-w-lg">{messages.notFound.description}</p><Button asChild className="mt-8"><SiteLink href="/"><ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" />{messages.common.backHome}</SiteLink></Button></Container></main>;
}
