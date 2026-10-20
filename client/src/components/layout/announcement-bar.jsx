"use client";

import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SiteLink } from "@/components/layout/site-link";
import { SocialLinks } from "@/components/layout/social-links";
import { useLanguage } from "@/components/providers/language-provider";

export function AnnouncementBar() {
  const { messages } = useLanguage();
  return (
    <div className="announcement-bar">
      <Container className="flex h-full items-center justify-between gap-3">
        <SiteLink href="/membership" className="announcement-link">
          <span className="announcement-dot" aria-hidden="true" />
          <span>{messages.announcement.text}</span>
          <span className="hidden font-semibold sm:inline">{messages.announcement.action}</span>
          <ArrowUpRight className="size-3.5 shrink-0 rtl:-scale-x-100" aria-hidden="true" />
        </SiteLink>
        <SocialLinks />
      </Container>
    </div>
  );
}
