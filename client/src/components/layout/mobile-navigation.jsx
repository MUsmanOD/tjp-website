"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import * as m from "motion/react-m";
import { NavigationLinks } from "@/components/layout/navigation-links";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function MobileNavigation({ name, items }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    // Match Tailwind's md breakpoint and release the modal when switching to desktop.
    const desktop = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = (event) => {
      if (event.matches) setOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-11 md:hidden"
          aria-label="Open navigation"
        >
          <m.span
            initial={false}
            animate={{ rotate: open ? 90 : 0 }}
            className="inline-flex"
          >
            <Menu aria-hidden="true" className="size-5" />
          </m.span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[min(22rem,90vw)] overflow-y-auto">
        <SheetHeader className="p-6">
          <SheetTitle className="heading-section">{name}</SheetTitle>
          <SheetDescription>
            Explore the website and its resources.
          </SheetDescription>
        </SheetHeader>
        <nav
          aria-label="Mobile navigation"
          className="flex flex-col gap-2 px-6 pb-6"
        >
          <NavigationLinks
            items={items}
            className="rounded-md px-3 py-3 hover:bg-accent"
            onNavigate={() => setOpen(false)}
          />
        </nav>
      </SheetContent>
    </Sheet>
  );
}
