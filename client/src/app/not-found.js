"use client";

import { ArrowLeft } from "lucide-react";
import { SiteLink } from "@/components/layout/site-link";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const { messages } = useLanguage();
  return (
    <main id="main-content" tabIndex={-1} className="not-found-page">
      <div className="not-found-panel">
        <p className="not-found-number" aria-hidden="true">404</p>
        <h1 className="heading-card mt-2">{messages.notFound.title}</h1>
        <p className="text-small mt-2 text-muted-foreground">{messages.notFound.description}</p>
        <Button asChild className="mt-5">
          <SiteLink href="/"><ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" />{messages.common.backHome}</SiteLink>
        </Button>
      </div>
    </main>
  );
}
