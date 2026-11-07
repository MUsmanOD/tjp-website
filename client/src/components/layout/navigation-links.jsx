"use client";

import { SiteLink } from "@/components/layout/site-link";
import { useLanguage } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { localized } from "@/lib/website-content";

export function NavigationLinks({ items, className, onNavigate }) {
  const { messages, locale } = useLanguage();
  const pathname = usePathname();
  return items.map((item) => (
    <SiteLink
      key={item.id || item.href}
      href={item.href}
      className={cn("nav-link", className)}
      onClick={onNavigate}
      aria-current={item.href === pathname || (item.href === "/#home" && pathname === "/") ? "page" : undefined}
    >
      {localized(item.label, locale) || messages.navigation[item.key]}
    </SiteLink>
  ));
}
