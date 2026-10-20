"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { Container } from "@/components/layout/container";
import { SiteLink } from "@/components/layout/site-link";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { heroSlides } from "@/config/hero-slides";
import { horizontalWheelDelta, wrapSlide } from "@/lib/slider";

export function HeroSlider() {
  const { messages, direction, locale } = useLanguage();
  const content = messages.home;
  const labels = content.carousel;
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [focused, setFocused] = useState(false);
  const reducedMotion = useReducedMotion();
  const root = useRef(null);
  const pointer = useRef(null);
  const paused = !playing || focused || reducedMotion;
  const slide = content.slides[active];

  const goTo = useCallback((index) => {
    setActive(wrapSlide(index, heroSlides.length));
  }, []);

  const step = useCallback((amount) => {
    setActive((previous) => wrapSlide(previous + amount, heroSlides.length));
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setActive((previous) => wrapSlide(previous + 1, heroSlides.length));
    }, 3000);
    return () => window.clearInterval(timer);
  }, [paused, active]);

  useEffect(() => {
    const element = root.current;
    const gesture = { total: 0, lastEvent: 0, lockedUntil: 0 };
    const onWheel = (event) => {
      const delta = horizontalWheelDelta(event, direction);
      if (!delta) return;
      event.preventDefault();
      const now = performance.now();
      if (now - gesture.lastEvent > 180) gesture.total = 0;
      gesture.lastEvent = now;
      if (now < gesture.lockedUntil) return;
      gesture.total += delta;
      if (Math.abs(gesture.total) >= 60) {
        step(Math.sign(gesture.total));
        gesture.total = 0;
        gesture.lockedUntil = now + 900;
      }
    };
    element.addEventListener("wheel", onWheel, { passive: false });
    return () => element.removeEventListener("wheel", onWheel);
  }, [direction, step]);

  return (
    <section ref={root} id="home" tabIndex={0} aria-labelledby="home-title"
      aria-roledescription={labels.role} data-paused={paused ? "true" : "false"}
      className="hero-slider"
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
      onKeyDown={(event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        if (event.key === "Home") goTo(0);
        else if (event.key === "End") goTo(heroSlides.length - 1);
        else step((event.key === "ArrowRight" ? 1 : -1) * (direction === "rtl" ? -1 : 1));
      }}
      onPointerDown={(event) => {
        if (event.pointerType !== "touch" || event.target.closest("a, button")) return;
        pointer.current = { x: event.clientX, y: event.clientY };
      }}
      onPointerCancel={() => { pointer.current = null; }}
      onPointerUp={(event) => {
        if (!pointer.current) return;
        const dx = pointer.current.x - event.clientX;
        const dy = pointer.current.y - event.clientY;
        pointer.current = null;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) step(Math.sign(dx) * (direction === "rtl" ? -1 : 1));
      }}>
      <div className="absolute inset-0" aria-hidden="true">
        {heroSlides.map((image, index) => (
          <div key={image.src} className="hero-slide" data-active={index === active}>
            <Image src={image.src} alt="" fill sizes="100vw" preload={index === 0}
              loading={index === 0 ? undefined : "eager"} draggable={false} className="object-cover" style={{ objectPosition: image.position }} />
          </div>
        ))}
      </div>
      <div className="hero-shade" aria-hidden="true" />
      <Container className="hero-inner">
        <div className="hero-copy" key={`${locale}-${active}`}>
          <h1 id="home-title" className="heading-hero">{slide.title}<span className="block">{slide.accent}</span></h1>
          <p className="text-lead hero-description text-white/90">{slide.description}</p>
          <div className="hero-actions mt-7 flex flex-wrap items-center justify-center gap-2">
            <Button asChild size="lg"><SiteLink href="/#about">{messages.common.explore}<ArrowRight aria-hidden="true" className="rtl:rotate-180" /></SiteLink></Button>
            <Button asChild variant="inverse"><SiteLink href="/#focus">{content.secondaryAction}</SiteLink></Button>
          </div>
        </div>
        <Button variant="inverse" className="hero-pause" disabled={Boolean(reducedMotion)}
          onClick={() => setPlaying((value) => !value)}>
          {playing && !reducedMotion ? labels.pause : labels.play}
        </Button>
        <p className="sr-only" role="status" aria-live={paused ? "polite" : "off"} aria-atomic="true">{`${labels.slide} ${active + 1} / ${heroSlides.length}: ${slide.location}. ${slide.alt}`}</p>
      </Container>
    </section>
  );
}
