import Image from "next/image";
import { useId } from "react";
import { cn } from "@/lib/utils";
import { uploadedImage } from "@/lib/website-content";

// A transparent, waist-up portrait works best; the ribbon is shared by both locales.
export function PortraitBadge({ src, alt, name, className, heading = false, cropBottom = false, sizes = "(max-width: 639px) 70vw, 24vw" }) {
  const namePathId = useId().replaceAll(":", "");
  return (
    <figure className={cn("portrait-badge", className)}>
      <span className="portrait-badge-flag" aria-hidden="true" style={{ position: "absolute", insetInline: 0, bottom: "9%", height: "43%", overflow: "hidden", maskImage: "linear-gradient(to bottom, transparent 0%, black 28%, black 83%, transparent 100%)" }}>
        <Image src="/images/home/pakistan-flag-banner.png" alt="" fill sizes={sizes} className="object-cover" style={{ objectFit: "cover", objectPosition: "center" }} />
      </span>
      <span className="portrait-badge-image" style={{ position: "absolute", insetInline: "5%", top: "4%", bottom: "8%", overflow: "hidden", borderRadius: 0, clipPath: "none" }}>
        <Image src={src} alt={alt} unoptimized={uploadedImage(src)} fill sizes={sizes} className="object-contain" style={{ objectFit: "contain", objectPosition: "center bottom", transform: "scale(1.02)", clipPath: cropBottom ? "inset(0 0 5% 0)" : "none" }} />
      </span>
      <figcaption style={{ position: "absolute", zIndex: 10, insetInline: "-3%", bottom: "-6%", height: "29%", filter: "drop-shadow(0 0.3rem 0.4rem rgb(0 0 0 / 0.15))" }}>
        <svg viewBox="0 0 320 100" role="presentation" aria-hidden="true" focusable="false" style={{ display: "block", width: "100%", height: "100%", overflow: "visible" }}>
          <defs><path id={namePathId} d="M 52 43 Q 160 54 268 43" /></defs>
          <path fill="color-mix(in srgb, var(--primary) 78%, black)" d="M 8 11 L 43 19 L 37 48 L 5 40 L 17 29 Z" />
          <path fill="color-mix(in srgb, var(--primary) 78%, black)" d="M 312 11 L 277 19 L 283 48 L 315 40 L 303 29 Z" />
          <path fill="var(--primary)" d="M 30 18 Q 160 40 290 18 L 294 48 Q 160 70 26 48 Z" />
          <path fill="none" stroke="rgb(255 255 255 / 0.8)" strokeWidth="1.5" d="M 30 18 Q 160 40 290 18" />
          <text fill="white" fontSize="17" fontWeight="700" fontFamily="inherit"><textPath href={`#${namePathId}`} startOffset="50%" textAnchor="middle">{name}</textPath></text>
        </svg>
        {heading ? <h3 className="sr-only">{name}</h3> : <span className="sr-only">{name}</span>}
      </figcaption>
    </figure>
  );
}
