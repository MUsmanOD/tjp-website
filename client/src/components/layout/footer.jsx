"use client";

import { ArrowUp } from "lucide-react";
import { usePathname } from "next/navigation";
import { Brand } from "@/components/layout/brand";
import { Container } from "@/components/layout/container";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { NavigationLinks } from "@/components/layout/navigation-links";
import { SiteLink } from "@/components/layout/site-link";
import { SocialLinks } from "@/components/layout/social-links";
import { useLanguage } from "@/components/providers/language-provider";
import { Separator } from "@/components/ui/separator";
import { mediaCredits } from "@/config/media";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Footer({ name, navigation = siteConfig.navigation, className }) {
  const { messages } = useLanguage();
  const pathname = usePathname();
  if (pathname === "/login" || pathname === "/signup" || pathname === "/tjp-punjab-pk-portal" || pathname === "/tjp-admin-dashboard") return null;
  return (
    <footer className={cn("footer-inverse shrink-0", className)}>
      <Container>
        <div className="footer-grid">
          <div className="footer-brand">
            <Brand name={name} />
            <p className="text-small footer-muted">{messages.footer.description}</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2"><SocialLinks /><LanguageSwitcher /></div>
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between gap-4">
              <h2 className="heading-card">{messages.footer.explore}</h2>
              <SiteLink href="/#home" className="footer-top-link" aria-label={messages.common.backToTop}><ArrowUp className="size-4" aria-hidden="true" /></SiteLink>
            </div>
            <nav aria-label={messages.common.footerNavigation} className="footer-navigation">
              <NavigationLinks items={navigation} />
              <SiteLink href="/login" className="nav-link">{messages.common.login}</SiteLink>
              <SiteLink href="/signup" className="nav-link">{messages.common.signup}</SiteLink>
              <SiteLink href="/membership" className="nav-link">{messages.common.membership}</SiteLink>
            </nav>
          </div>
        </div>
        <Separator className="bg-white/20" />
        <div className="footer-bottom text-small footer-muted">
          <p>&copy; {messages.footer.rights}</p>
          <p>{messages.footer.madeFor}</p>
          <details className="photo-credits">
            <summary>{messages.footer.credits}</summary>
            <ul className="space-y-2 py-4">
              {mediaCredits.map((photo) => (
                <li key={photo.src}>
                  <a href={photo.source} target="_blank" rel="noreferrer" className="underline underline-offset-4">{messages.media[photo.key].title}</a>
                  {photo.credit === "commons" ? <>{" · "}<span lang="en" dir="ltr">{photo.photographer}</span>{" · "}<a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer" className="underline underline-offset-4" lang="en">{messages.footer.photoLicense}</a></> : <>{" · "}{messages.footer.tjpArchive}</>}
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
