"use client";

import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";

export function Brand({ name, compact = false, className }) {
  const { messages } = useLanguage();
  return (
    <Link href="/#home" className={cn("brand-link", className)} aria-label={messages.brand.home}>
      <span className="brand-monogram" lang="en" aria-hidden="true">TJP</span>
      <span className={compact ? "sr-only" : undefined}>
        <span className="brand-name">{name || messages.brand.name}</span>
        <span className="brand-caption">{messages.brand.country}</span>
      </span>
    </Link>
  );
}
