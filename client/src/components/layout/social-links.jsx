"use client";

import { FaFacebookF, FaInstagram, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { useLanguage } from "@/components/providers/language-provider";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { useWebsite } from "@/lib/website-content";

export const socialIcons = { facebook: FaFacebookF, x: FaXTwitter, instagram: FaInstagram, youtube: FaYoutube };

export function SocialLinks({ className }) {
  const { messages, locale, direction } = useLanguage();
  const social = useWebsite()?.settings.social;
  const facebook = social ? social.facebook : siteConfig.social[0].href;
  return (
    <div className={cn("social-links", className)}>
      {siteConfig.social.map(({ key, href: defaultHref }) => {
        const href = social ? social[key] : defaultHref;
        const Icon = socialIcons[key];
        const label = messages.social.platforms[key];
        return href ? (
          <a key={key} href={href} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label={`${label} · ${messages.common.newTab}`} title={label}>
            <Icon aria-hidden="true" />
          </a>
        ) : (
          <Dialog key={key}>
            <DialogTrigger asChild>
              <button type="button" className="social-icon" aria-label={`${label} · ${messages.social.pending}`} title={`${label} · ${messages.social.pending}`}><Icon aria-hidden="true" /></button>
            </DialogTrigger>
            <DialogContent closeLabel={messages.common.close} dir={direction} lang={locale} className="max-w-md p-8 sm:p-10">
              <Icon className="mb-6 size-8 text-primary" aria-hidden="true" />
              <DialogTitle className="heading-card">{label}</DialogTitle>
              <DialogDescription className="text-body mt-4 text-muted-foreground">{messages.social.unavailable}</DialogDescription>
              {facebook && <a href={facebook} target="_blank" rel="noopener noreferrer" className="text-link mt-6 inline-flex min-h-11 items-center">{messages.social.visitFacebook}</a>}
            </DialogContent>
          </Dialog>
        );
      })}
    </div>
  );
}
