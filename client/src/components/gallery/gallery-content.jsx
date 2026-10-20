"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Expand } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PageIntro } from "@/components/content/page-intro";
import { JoinBanner } from "@/components/content/join-banner";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";
import { galleryItems } from "@/config/content";
import { heroSlides } from "@/config/hero-slides";

export function GalleryContent() {
  const { messages, locale, direction } = useLanguage();
  const [filter, setFilter] = useState("all");
  const [active, setActive] = useState(null);
  const opener = useRef(null);
  const items = galleryItems.filter((item) => filter === "all" || item.category === filter);
  const selected = active !== null ? items[active] : null;
  const step = (amount) => setActive((value) => (value + amount + items.length) % items.length);

  return (
    <>
      <PageIntro content={messages.gallery} breadcrumb={messages.navigation.gallery} />
      <section className="section-space">
        <Container>
          <div className="filter-row" role="group" aria-label={messages.gallery.filter}>{["all", "heritage", "landscapes"].map((key) => <button key={key} type="button" className="filter-chip" aria-pressed={filter === key} onClick={() => setFilter(key)}>{messages.gallery[key]}</button>)}</div>
          <div className="gallery-grid">
            {items.map((item, index) => <button key={item.image} className="gallery-tile group" type="button" aria-label={`${messages.gallery.open}: ${messages.home.slides[item.slide].location}`} onClick={(event) => { opener.current = event.currentTarget; setActive(index); }}>
              <Image src={item.image} alt={messages.home.slides[item.slide].alt} fill sizes="(max-width: 639px) 90vw, 45vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <span className="gallery-tile-shade" aria-hidden="true" />
              <span className="gallery-expand" aria-hidden="true"><Expand className="size-5" /></span>
              <span className="gallery-tile-caption"><span>{messages.home.slides[item.slide].location}</span><span className="text-small">{messages.gallery[item.category]}</span></span>
            </button>)}
          </div>
          <p className="text-small mt-6 text-muted-foreground" role="status">{messages.gallery.note}</p>
        </Container>
      </section>
      <Dialog open={selected !== null} onOpenChange={(open) => { if (!open) setActive(null); }}>
        {selected && <DialogContent closeLabel={messages.gallery.close} lang={locale} dir={direction} className="gallery-dialog" onCloseAutoFocus={(event) => { event.preventDefault(); opener.current?.focus(); }} onKeyDown={(event) => {
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); step((event.key === "ArrowRight" ? 1 : -1) * (direction === "rtl" ? -1 : 1)); }
        }}>
          <DialogTitle className="sr-only">{messages.home.slides[selected.slide].location}</DialogTitle>
          <DialogDescription className="sr-only">{messages.home.slides[selected.slide].alt}</DialogDescription>
          <div className="gallery-dialog-image"><Image src={selected.image} alt={messages.home.slides[selected.slide].alt} fill sizes="90vw" className="object-contain" /></div>
          <div className="gallery-dialog-footer">
            <div className="min-w-0 space-y-1"><p className="text-small font-semibold" aria-live="polite">{messages.home.slides[selected.slide].location}</p><p className="text-small text-muted-foreground"><span lang="en" dir="ltr">{heroSlides[selected.slide].photographer}</span> · <a href={heroSlides[selected.slide].source} className="text-link" target="_blank" rel="noopener noreferrer">{messages.gallery.source}</a></p></div>
            <div className="flex shrink-0 items-center gap-2"><Button variant="outline" size="icon" aria-label={messages.gallery.previous} onClick={() => step(-1)}><ArrowLeft className="size-4 rtl:rotate-180" /></Button><span className="text-small" aria-live="polite">{new Intl.NumberFormat(locale).format(active + 1)} / {new Intl.NumberFormat(locale).format(items.length)}</span><Button variant="outline" size="icon" aria-label={messages.gallery.next} onClick={() => step(1)}><ArrowRight className="size-4 rtl:rotate-180" /></Button></div>
          </div>
        </DialogContent>}
      </Dialog>
      <JoinBanner />
    </>
  );
}
