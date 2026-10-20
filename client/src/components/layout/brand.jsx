"use client";

import Link from "next/link";
import Image from "next/image";
import { media } from "@/config/media";
import { useLanguage } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";

export function Brand({ name, compact = false, showWordmark = false, className, onClick }) {
  const { messages } = useLanguage();
  const wordmark = name || messages.brand.wordmark;
  return (
    <Link href="/#home" className={cn("brand-link", showWordmark && "header-brand", className)} aria-label={messages.brand.home} onClick={onClick}>
      <span className="brand-emblem relative size-11 shrink-0" aria-hidden="true"><Image src={media.logo.src} alt="" fill sizes="44px" className="object-contain" /></span>
      {showWordmark && <span className="header-wordmark" lang="en" dir="ltr" aria-hidden="true" key={wordmark}>
        {Array.from(wordmark).map((letter, index) => <span className="header-brand-letter" style={{ "--brand-letter-index": index }} key={index}>{letter}</span>)}
      </span>}
      <span className={compact ? "sr-only" : undefined}>
        <span className="brand-name">{name || messages.brand.name}</span>
        <span className="brand-caption">{messages.brand.country}</span>
      </span>
    </Link>
  );
}
