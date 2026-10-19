"use client";

import { SiteLink } from "@/components/layout/site-link";
import { useLanguage } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";

export function NavigationLinks({ items, className, onNavigate }) {
  const { messages } = useLanguage();
  return items.map((item) => (
    <SiteLink
      key={item.href}
      href={item.href}
      className={cn("nav-link", className)}
      onClick={onNavigate}
    >
      {messages.navigation[item.key]}
    </SiteLink>
  ));
}
