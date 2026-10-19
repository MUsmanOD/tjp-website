"use client";

import { Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }) {
  const { locale, messages, setLocale } = useLanguage();
  const target = locale === "en" ? "ur" : "en";
  return (
    <Button variant="ghost" lang={target} dir={target === "ur" ? "rtl" : "ltr"}
      aria-label={locale === "en" ? messages.common.switchToUrdu : messages.common.switchToEnglish}
      onClick={() => setLocale(target)} className={cn("language-switcher", className)}>
      <Globe2 className="size-4 shrink-0" aria-hidden="true" />
      {target === "ur" ? messages.common.urdu : messages.common.english}
    </Button>
  );
}
