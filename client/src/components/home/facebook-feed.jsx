"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { FaFacebookF } from "react-icons/fa6";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { useWebsite } from "@/lib/website-content";

export function FacebookFeed() {
  const { messages, locale } = useLanguage();
  const [loaded, setLoaded] = useState(false);
  const social = useWebsite()?.settings.social;
  const facebook = social ? social.facebook : siteConfig.social[0].href;
  if (!facebook) return null;
  const copy = messages.social;
  const url = new URL("https://www.facebook.com/plugins/page.php");
  url.search = new URLSearchParams({ href: facebook, tabs: "timeline", width: "500", height: "520", small_header: "true", adapt_container_width: "true", hide_cover: "false", show_facepile: "false", locale: locale === "ur" ? "ur_PK" : "en_US" }).toString();
  return (
    <Card className="facebook-feed grid lg:grid-cols-2" data-scroll-reveal>
      <div className="facebook-feed-copy"><span className="feature-icon"><FaFacebookF className="size-5" aria-hidden="true" /></span><h3 className="heading-card mt-5">{copy.feedTitle}</h3><p className="text-body mt-3 max-w-md text-muted-foreground">{copy.feedDescription}</p><a href={facebook} target="_blank" rel="noopener noreferrer" className="section-action mt-5">{copy.visitFacebook}<ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden="true" /></a></div>
      <div className="facebook-feed-view" data-lenis-prevent>
        {loaded ? <><iframe key={url.toString()} src={url.toString()} title={copy.feedTitle} width="500" height="520" loading="lazy" allow="encrypted-media; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" className="facebook-iframe" /><p className="text-small px-5 py-4 text-muted-foreground">{copy.feedFallback} <a href={facebook} className="text-link" target="_blank" rel="noopener noreferrer">{copy.visitFacebook}</a></p></> : <div className="facebook-feed-placeholder"><FaFacebookF className="mb-5 size-8 text-primary" aria-hidden="true" /><p className="text-body mb-6 max-w-xs text-center text-muted-foreground">{copy.feedPrivacy}</p><Button type="button" onClick={() => setLoaded(true)}>{copy.loadFeed}</Button></div>}
      </div>
    </Card>
  );
}
