"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/components/providers/language-provider";
import { uploadedImage, useWebsite, visibleGallery } from "@/lib/website-content";

export function HomeGallery() {
  const { messages, locale, direction } = useLanguage();
  const gallery = visibleGallery(useWebsite(), messages, locale);
  const track = useRef(null);
  const opener = useRef(null);
  const [active, setActive] = useState(null);
  const [paused, setPaused] = useState(false);
  const [stopped, setStopped] = useState(false);
  const selected = gallery.find((item) => item.id === active) ?? null;
  const viewingPhoto = selected !== null;
  useEffect(() => {
    const node = track.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!node || gallery.length < 2 || paused || stopped || viewingPhoto || reduced.matches) return;
    let frame, last, remainder = 0;
    const move = (time) => {
      if (last !== undefined) {
        remainder += Math.min(time - last, 50) * 0.025;
        const pixels = Math.floor(remainder);
        if (pixels) { node.scrollLeft += pixels; remainder -= pixels; }
        if (node.scrollLeft >= node.scrollWidth / 2) node.scrollLeft -= node.scrollWidth / 2;
      }
      last = time;
      frame = requestAnimationFrame(move);
    };
    frame = requestAnimationFrame(move);
    return () => cancelAnimationFrame(frame);
  }, [paused, stopped, viewingPhoto, gallery.length]);
  if (!gallery.length) return null;
  return <>
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><p className="text-small text-muted-foreground">{messages.sections.gallery.hint}</p><button type="button" className="text-link text-small" onClick={() => setStopped((value) => !value)}>{stopped ? messages.sections.gallery.play : messages.sections.gallery.pause}</button></div>
    <div ref={track} className="home-gallery-track" dir="ltr" data-lenis-prevent onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}>
      {(gallery.length > 1 ? [0, 1] : [0]).map((copy) => <div className="home-gallery-group" key={copy} aria-hidden={copy === 1 || undefined}>
        {gallery.map((item, index) => <button key={item.id} type="button" tabIndex={copy ? -1 : undefined} className="home-gallery-tile" aria-label={`${messages.gallery.open}: ${item.title}`} onClick={(event) => { opener.current = copy ? track.current?.querySelectorAll(".home-gallery-group:first-child button")[index] : event.currentTarget; setActive(item.id); }}>
          <Image src={item.imageUrl} alt={item.alt} unoptimized={uploadedImage(item.imageUrl)} fill sizes="(max-width: 639px) 78vw, 28vw" className="object-cover" style={{ objectPosition: item.position }} />
          <span className="gallery-tile-shade" aria-hidden="true" /><span className="gallery-tile-caption" dir={direction}>{item.title}</span>
        </button>)}
      </div>)}
    </div>
    <Dialog open={selected !== null} onOpenChange={(open) => { if (!open) setActive(null); }}>
      {selected && <DialogContent closeLabel={messages.gallery.close} lang={locale} dir={direction} className="home-gallery-dialog" onCloseAutoFocus={(event) => { event.preventDefault(); opener.current?.focus(); }}>
        <DialogTitle className="sr-only">{selected.title}</DialogTitle>
        <DialogDescription className="sr-only">{selected.alt}</DialogDescription>
        <Image src={selected.imageUrl} alt={selected.alt} unoptimized={uploadedImage(selected.imageUrl)} fill sizes="100vw" className="object-contain" />
      </DialogContent>}
    </Dialog>
  </>;
}
