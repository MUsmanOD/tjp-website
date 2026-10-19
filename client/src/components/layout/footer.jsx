"use client";

import { ArrowUp, ArrowUpRight } from "lucide-react";
import { Brand } from "@/components/layout/brand";
import { Container } from "@/components/layout/container";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { NavigationLinks } from "@/components/layout/navigation-links";
import { SiteLink } from "@/components/layout/site-link";
import { useLanguage } from "@/components/providers/language-provider";
import { Separator } from "@/components/ui/separator";
import { heroSlides } from "@/config/hero-slides";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Footer({ name, navigation = siteConfig.navigation, className }) {
  const { messages } = useLanguage();
  return (
    <footer className={cn("footer-inverse shrink-0", className)}>
      <Container>
        <div className="footer-topline">
          <h2 className="heading-section">{messages.footer.title}</h2>
          <SiteLink href="/#home" className="footer-top-link" aria-label={messages.common.backToTop}><ArrowUp className="size-5" aria-hidden="true" /></SiteLink>
        </div>
        <div className="footer-grid">
          <div className="space-y-5">
            <Brand name={name} />
            <p className="text-small footer-muted">{messages.footer.description}</p>
          </div>
          <div>
            <h3 className="heading-card mb-4">{messages.footer.explore}</h3>
            <nav aria-label={messages.common.footerNavigation} className="flex flex-col items-start gap-1">
              <NavigationLinks items={navigation} />
              <SiteLink href="/login" className="nav-link">{messages.common.login}<ArrowUpRight className="ms-2 size-3.5 rtl:-scale-x-100" aria-hidden="true" /></SiteLink>
            </nav>
          </div>
          <div className="space-y-4">
            <h3 className="heading-card">{messages.footer.language}</h3>
            <p className="text-small footer-muted">{messages.footer.languageDescription}</p>
            <LanguageSwitcher />
          </div>
        </div>
        <Separator className="bg-white/20" />
        <div className="text-small footer-muted flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-5">
          <p>&copy; {messages.footer.rights}</p>
          <p>{messages.footer.madeFor}</p>
          <details className="photo-credits">
            <summary>{messages.footer.credits}</summary>
            <ul className="space-y-2 py-4">
              {heroSlides.map((photo, index) => (
                <li key={photo.src}>
                  <a href={photo.source} target="_blank" rel="noreferrer" className="underline underline-offset-4">{messages.home.slides[index].location}</a>
                  {" · "}<span lang="en" dir="ltr">{photo.photographer}</span>
                  {" · "}<a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer" className="underline underline-offset-4" lang="en">{messages.footer.photoLicense}</a>
                </li>
              ))}
            </ul>
            <p className="max-w-lg pb-3">{messages.footer.photoChanges}</p>
          </details>
        </div>
      </Container>
    </footer>
  );
}
