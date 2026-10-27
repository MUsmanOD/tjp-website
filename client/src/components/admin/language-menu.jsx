"use client";

import { Languages, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

export function AdminLanguageMenu() {
  const { locale, direction, messages, setLocale } = useLanguage();
  const { languageMenu } = messages.portal;
  return (
    <DropdownMenu dir={direction}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="admin-language-trigger"
          aria-label={`${languageMenu.label}: ${locale === "ur" ? languageMenu.urdu : languageMenu.english}`}
        >
          <Languages aria-hidden="true" />
          <span>
            {locale === "ur" ? languageMenu.urdu : languageMenu.english}
          </span>
          <ChevronDown aria-hidden="true" className="size-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        aria-label={languageMenu.label}
      >
        <DropdownMenuRadioGroup value={locale} onValueChange={setLocale}>
          <DropdownMenuRadioItem value="en">
            <span lang="en" dir="ltr">
              {languageMenu.english}
            </span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="ur">
            <span lang="ur" dir="rtl">
              {languageMenu.urdu}
            </span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
