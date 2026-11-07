"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { media } from "@/config/media";
import { useLanguage } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";
import { localized, uploadedImage, useWebsite } from "@/lib/website-content";

export function Brand({ name, compact = false, showWordmark = false, className, onClick, loadingTarget }) {
  const { messages, locale } = useLanguage();
  const [failedLogo, setFailedLogo] = useState("");
  const settings = useWebsite()?.settings;
  const brandName = name || localized(settings?.name, locale) || messages.brand.name;
  const wordmark = name || settings?.name.en || messages.brand.wordmark;
  const logo = settings?.logo && settings.logo !== failedLogo ? settings.logo : media.logo.src;
  return (
    <Link href="/#home" className={cn("brand-link", showWordmark && "header-brand", className)} aria-label={messages.brand.home} onClick={onClick}>
      <span className="brand-emblem relative size-11 shrink-0" data-site-logo={loadingTarget ? "" : undefined} aria-hidden="true">
        <Image src={logo} alt="" unoptimized={uploadedImage(logo)} fill sizes="44px" className="object-contain" onError={() => setFailedLogo(logo)} />
      </span>
      {showWordmark && <span className="header-wordmark" lang="en" dir="ltr" aria-hidden="true" key={wordmark}>
        {Array.from(wordmark).map((letter, index) => <span className="header-brand-letter" style={{ "--brand-letter-index": index }} key={index}>{letter}</span>)}
      </span>}
      <span className={compact ? "sr-only" : undefined}>
        <span className="brand-name">{brandName}</span>
        <span className="brand-caption">{messages.brand.country}</span>
      </span>
    </Link>
  );
}
