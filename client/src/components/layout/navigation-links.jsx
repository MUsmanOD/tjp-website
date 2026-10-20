"use client";

import { SiteLink } from "@/components/layout/site-link";
import { useLanguage } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function NavigationLinks({ items, className, onNavigate }) {
  const { messages } = useLanguage();
  const pathname = usePathname();
  return items.map((item) => (
    <SiteLink
      key={item.href}
      href={item.href}
      className={cn("nav-link", className)}
      onClick={onNavigate}
      aria-current={item.href === pathname || (item.href === "/blogs" && pathname.startsWith("/blogs/")) || (item.key === "home" && pathname === "/") ? "page" : undefined}
    >
      {messages.navigation[item.key]}
    </SiteLink>
  ));
}
