"use client";

import { useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";
import { Brand } from "@/components/layout/brand";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { NavigationLinks } from "@/components/layout/navigation-links";
import { SiteLink } from "@/components/layout/site-link";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function MobileNavigation({ name, items }) {
  const [open, setOpen] = useState(false);
  const navigationTarget = useRef(null);
  const { locale, direction, messages } = useLanguage();

  useEffect(() => {
    if (!open) return;
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = (event) => {
      if (event.matches) setOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="size-11 lg:hidden" aria-label={messages.common.openMenu}>
          <Menu aria-hidden="true" className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side={direction === "rtl" ? "left" : "right"} dir={direction} lang={locale}
        closeLabel={messages.common.closeMenu} data-lenis-prevent className="mobile-menu"
        onCloseAutoFocus={(event) => {
          const target = navigationTarget.current;
          navigationTarget.current = null;
          if (!target) return;
          // Move focus to the chosen section after the modal releases focus.
          // Otherwise restoring trigger focus can interrupt Next's anchor scroll.
          event.preventDefault();
          target.focus({ preventScroll: true });
          target.scrollIntoView({ block: "start" });
        }}>
        <SheetHeader className="mobile-menu-header text-start">
          <SheetTitle className="sr-only">{name || messages.brand.name}</SheetTitle>
          <SheetDescription className="sr-only">{messages.common.menuDescription}</SheetDescription>
          <Brand name={name} onClick={() => setOpen(false)} />
        </SheetHeader>
        <nav aria-label={messages.common.mobileNavigation} className="mobile-menu-links">
          <NavigationLinks items={items} className="rounded-md px-3 py-2 hover:bg-accent"
            onNavigate={(event) => {
              const link = event.currentTarget;
              navigationTarget.current = link.pathname === window.location.pathname && link.hash
                ? document.getElementById(link.hash.slice(1)) : null;
              setOpen(false);
            }} />
        </nav>
        <div className="mobile-menu-footer">
          <div className="mobile-menu-actions">
            <Button asChild variant="outline"><SiteLink href="/signup" onClick={() => setOpen(false)}>{messages.common.signup}</SiteLink></Button>
            <LanguageSwitcher variant="outline" className="w-full justify-center" />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
