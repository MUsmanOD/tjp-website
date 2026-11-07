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
import { uploadedImage, useWebsite, visibleGallery } from "@/lib/website-content";

export function GalleryContent() {
  const { messages, locale, direction } = useLanguage();
  const [filter, setFilter] = useState("all");
  const [active, setActive] = useState(null);
  const opener = useRef(null);
  const gallery = visibleGallery(useWebsite(), messages, locale);
  const items = gallery.filter((item) => filter === "all" || item.category === filter);
  const index = items.findIndex((item) => item.id === active);
  const selected = index < 0 ? null : items[index];
  const step = (amount) => setActive(items[(index + amount + items.length) % items.length]?.id ?? null);

  return (
    <>
      <PageIntro content={messages.gallery} breadcrumb={messages.navigation.gallery} />
      <section className="section-space">
        <Container>
          <div className="filter-row" role="group" aria-label={messages.gallery.filter}>{["all", ...new Set(gallery.map((item) => item.category))].map((key) => <button key={key} type="button" className="filter-chip" aria-pressed={filter === key} onClick={() => { setActive(null); setFilter(key); }}>{messages.gallery[key]}</button>)}</div>
          <div className="gallery-grid">
            {items.map((item, index) => <button key={item.id} className="gallery-tile group" data-scroll-reveal data-scroll-delay={(index % 3) * 80} type="button" aria-label={`${messages.gallery.open}: ${item.title}`} onClick={(event) => { opener.current = event.currentTarget; setActive(item.id); }}>
              <Image src={item.imageUrl} alt={item.alt} unoptimized={uploadedImage(item.imageUrl)} fill sizes="(max-width: 639px) 90vw, 45vw" className="object-cover transition-transform duration-700 group-hover:scale-105" style={{ objectPosition: item.position }} />
              <span className="gallery-tile-shade" aria-hidden="true" />
              <span className="gallery-expand" aria-hidden="true"><Expand className="size-5" /></span>
              <span className="gallery-tile-caption"><span>{item.title}</span><span className="text-small shrink-0">{messages.gallery[item.category]}</span></span>
            </button>)}
          </div>
          <p className="text-small mt-6 text-muted-foreground" role="status">{items.length ? messages.gallery.note : messages.portal.empty}</p>
        </Container>
      </section>
      <Dialog open={selected !== null} onOpenChange={(open) => { if (!open) setActive(null); }}>
        {selected && <DialogContent closeLabel={messages.gallery.close} lang={locale} dir={direction} className="gallery-dialog" onCloseAutoFocus={(event) => { event.preventDefault(); opener.current?.focus(); }} onKeyDown={(event) => {
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); step((event.key === "ArrowRight" ? 1 : -1) * (direction === "rtl" ? -1 : 1)); }
        }}>
          <DialogTitle className="sr-only">{selected.title}</DialogTitle>
          <DialogDescription className="sr-only">{selected.alt}</DialogDescription>
          <div className="gallery-dialog-image"><Image src={selected.imageUrl} alt={selected.alt} unoptimized={uploadedImage(selected.imageUrl)} fill sizes="90vw" className="object-contain" /></div>
          <div className="gallery-dialog-footer">
            <div className="min-w-0 flex-1 space-y-1"><p className="text-small font-semibold" aria-live="polite">{selected.title}</p><p className="text-small text-muted-foreground">{selected.description}</p>{(selected.credit || selected.source) && <p className="text-small text-muted-foreground">{selected.credit || messages.footer.tjpArchive}{selected.source && <> · <a href={selected.source} className="text-link" target="_blank" rel="noopener noreferrer">{messages.gallery.source}</a></>}</p>}</div>
            <div className="flex shrink-0 items-center gap-2"><Button variant="outline" size="icon" aria-label={messages.gallery.previous} onClick={() => step(-1)}><ArrowLeft className="size-4 rtl:rotate-180" /></Button><span className="text-small" aria-live="polite">{new Intl.NumberFormat(locale).format(index + 1)} / {new Intl.NumberFormat(locale).format(items.length)}</span><Button variant="outline" size="icon" aria-label={messages.gallery.next} onClick={() => step(1)}><ArrowRight className="size-4 rtl:rotate-180" /></Button></div>
          </div>
        </DialogContent>}
      </Dialog>
      <JoinBanner />
    </>
  );
}
