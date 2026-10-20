"use client";

import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Brand } from "@/components/layout/brand";
import { Container } from "@/components/layout/container";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { NavigationLinks } from "@/components/layout/navigation-links";
import { SiteLink } from "@/components/layout/site-link";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Header({ name, navigation = siteConfig.navigation, className }) {
  const { messages } = useLanguage();
  return (
    <header className={cn("site-header sticky top-0 z-40 shrink-0 border-b bg-background/95 backdrop-blur-md", className)}>
      <AnnouncementBar />
      <Container className="header-main flex items-center justify-between gap-3">
        <Brand name={name} compact />
        <nav aria-label={messages.common.mainNavigation} className="hidden items-center gap-5 xl:gap-7 lg:flex">
          <NavigationLinks items={navigation} />
        </nav>
        <div className="flex items-center gap-1 sm:gap-3">
          <LanguageSwitcher />
          <span className="mx-1 hidden h-5 w-px bg-border sm:block" aria-hidden="true" />
          <Button asChild className="header-membership px-3 sm:px-4">
            <SiteLink href="/membership">{messages.common.join}</SiteLink>
          </Button>
          <MobileNavigation name={name} items={navigation} />
        </div>
      </Container>
    </header>
  );
}
