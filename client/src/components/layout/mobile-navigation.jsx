"use client";

import { useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";
import { Brand } from "@/components/layout/brand";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { NavigationLinks } from "@/components/layout/navigation-links";
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
        closeLabel={messages.common.closeMenu} className="w-[min(22rem,90vw)] overflow-y-auto"
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
        <SheetHeader className="p-6 pt-16 text-start">
          <SheetTitle className="heading-section">{name || messages.brand.name}</SheetTitle>
          <SheetDescription className="text-body">{messages.common.menuDescription}</SheetDescription>
        </SheetHeader>
        <nav aria-label={messages.common.mobileNavigation} className="flex flex-col gap-2 px-6">
          <NavigationLinks items={items} className="rounded-md px-3 py-3 hover:bg-accent"
            onNavigate={(event) => {
              navigationTarget.current = document.getElementById(event.currentTarget.hash.slice(1));
              setOpen(false);
            }} />
        </nav>
        <div className="mt-auto space-y-6 border-t p-6">
          <LanguageSwitcher />
          <Brand name={name} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
