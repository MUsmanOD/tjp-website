"use client";

import { useQuery } from "@tanstack/react-query";
import { galleryItems } from "@/config/content";
import { media } from "@/config/media";
import { api } from "@/lib/portal-api";

export const websiteKey = ["website-content"];
export const contactTopics = ["general", "membership", "media", "idea"];
export const galleryCategories = ["leadership", "meetings", "events", "heritage", "landscapes"];
export const localized = (text, locale) => text?.[locale] || text?.en || "";
export const uploadedImage = (src) => src?.startsWith("/api/v1/");

export function useWebsiteQuery() {
  return useQuery({
    queryKey: websiteKey,
    queryFn: ({ signal }) => api("/website", { signal: AbortSignal.any([signal, AbortSignal.timeout(10_000)]), retry: false }),
    staleTime: 60_000,
    retry: false,
  });
}

export function useWebsite() {
  return useWebsiteQuery().data;
}

export function applyPageContent(messages, pages, locale) {
  if (!pages) return messages;
  const updated = structuredClone(messages);
  for (const fields of Object.values(pages)) {
    for (const { path, value } of fields) {
      const keys = path.split(".");
      const leaf = keys.pop();
      let parent = updated;
      for (const key of keys) {
        parent = parent && Object.hasOwn(parent, key) ? parent[key] : undefined;
      }
      const text = localized(value, locale);
      if (text && parent && Object.hasOwn(parent, leaf) && typeof parent[leaf] === "string") parent[leaf] = text;
    }
  }
  return updated;
}

export function visibleLeaders(website, messages, locale) {
  if (website) return website.leaders.map((profile) => ({
    ...profile,
    name: localized(profile.name, locale),
    role: localized(profile.role, locale),
    description: localized(profile.description, locale),
    alt: localized(profile.alt, locale) || localized(profile.name, locale),
  }));
  return ["founder", "chairman"].map((id) => ({
    id,
    ...messages.leadership.profiles[id],
    alt: messages.media[id].alt,
    imageUrl: `/images/leadership/${id === "founder" ? "hamid-gul" : "abdullah-gul"}-cutout.png`,
    source: media[id].source,
  }));
}

export function visibleGallery(website, messages, locale) {
  if (website) return website.gallery.map((item) => ({
    ...item,
    title: localized(item.title, locale),
    alt: localized(item.alt, locale) || localized(item.title, locale),
    description: localized(item.description, locale),
  }));
  return galleryItems.map(({ media: id, category }) => ({
    id, category, ...messages.media[id],
    imageUrl: media[id].src,
    position: media[id].position,
    source: media[id].source,
    credit: media[id].photographer,
  }));
}
