"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/providers/language-provider";
import { media } from "@/config/media";
import { portalPath } from "@/config/portal";
import { uploadedImage, useWebsiteQuery } from "@/lib/website-content";

export function LogoLoading({ active = true, curtain, emblem, logo }) {
  const { messages } = useLanguage();
  const [loaded, setLoaded] = useState("");
  const customized = logo && logo !== media.logo.src;
  return active && <div ref={curtain} className="site-load-curtain" role="status">
    <span ref={emblem} className="site-load-emblem" aria-hidden="true">
      {(!customized || loaded !== logo) && <Image src={media.logo.src} alt="" fill sizes="100px" loading="eager" className="object-contain" />}
      {customized && <Image src={logo} alt="" fill sizes="100px" loading="eager"
        unoptimized={uploadedImage(logo)} className="object-contain" onLoad={() => setLoaded(logo)} />}
    </span>
    <span className="sr-only">{messages.portal.loading}</span>
  </div>;
}

export function DashboardLoading({ busy = false }) {
  const [arriving, setArriving] = useState(true);
  const { data } = useWebsiteQuery();
  useEffect(() => {
    const timer = setTimeout(() => setArriving(false), 180);
    return () => clearTimeout(timer);
  }, []);
  return <LogoLoading active={arriving || busy} logo={data?.settings.logo} />;
}

function PublicArrival({ busy, logo }) {
  const [arrived, setArrived] = useState(false);
  const curtain = useRef(null);
  const emblem = useRef(null);

  useEffect(() => {
    if (busy || arrived || !curtain.current) return;
    const overlay = curtain.current;
    const mark = emblem.current;
    const header = document.querySelector("[data-site-logo]");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduced || !mark.animate ? 0 : 700;
    let animation;
    let reveal;
    if (duration) {
      const target = header?.getBoundingClientRect();
      if (target?.width) {
        const start = mark.getBoundingClientRect();
        const x = target.left + target.width / 2 - (start.left + start.width / 2);
        const y = target.top + target.height / 2 - (start.top + start.height / 2);
        header.dataset.logoArriving = "";
        animation = mark.animate([
          { transform: "none" },
          { transform: `translate(${x}px, ${y}px) scale(${target.width / start.width})` },
        ], { duration, easing: "cubic-bezier(.25,.5,.35,1)", fill: "forwards" });
      }
      overlay.style.setProperty("--site-arrival-duration", `${duration}ms`);
      overlay.dataset.leaving = "";
      reveal = document.querySelector("#main-content")?.animate(
        [{ opacity: .25, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }],
        { duration, easing: "ease-out" },
      );
    }
    const timer = setTimeout(() => setArrived(true), duration);
    return () => {
      clearTimeout(timer);
      animation?.cancel();
      reveal?.cancel();
      delete overlay.dataset.leaving;
      overlay.style.removeProperty("--site-arrival-duration");
      if (header) delete header.dataset.logoArriving;
    };
  }, [arrived, busy]);

  return <LogoLoading active={!arrived} curtain={curtain} emblem={emblem} logo={logo} />;
}

export function WebsiteLoading() {
  const pathname = usePathname();
  const website = useWebsiteQuery();
  const { logo, favicon } = website.data?.settings ?? {};

  useEffect(() => {
    if (!favicon) return;
    const icons = Array.from(document.querySelectorAll('link[rel="icon"]'));
    if (!icons.length) {
      const icon = document.createElement("link");
      icon.rel = "icon";
      document.head.append(icon);
      icons.push(icon);
    }
    for (const icon of icons) {
      icon.href = favicon;
      icon.type = uploadedImage(favicon) ? "image/webp" : "image/x-icon";
      icon.removeAttribute("sizes");
    }
  }, [favicon]);

  if (pathname.startsWith(portalPath)) return null;
  return <>
    <noscript><style>{".site-load-curtain { display: none !important; }"}</style></noscript>
    <PublicArrival busy={website.isPending && website.fetchStatus !== "paused"} logo={logo} />
  </>;
}
