"use client";

import { createContext, useContext, useEffect, useSyncExternalStore } from "react";
import { Direction } from "radix-ui";
import { defaultLocale, normalizeLocale, translations } from "@/i18n/messages";

const LanguageContext = createContext(null);
const storageKey = "tjp-language";
const changeEvent = "tjp-language-change";
// In-memory fallback keeps the switcher working when storage is blocked.
let memoryLocale = defaultLocale;

function getSnapshot() {
  try {
    return normalizeLocale(window.localStorage.getItem(storageKey) || memoryLocale);
  } catch {
    return memoryLocale;
  }
}

function subscribe(listener) {
  window.addEventListener("storage", listener);
  window.addEventListener(changeEvent, listener);
  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(changeEvent, listener);
  };
}

function setLocale(value) {
  memoryLocale = normalizeLocale(value);
  try {
    window.localStorage.setItem(storageKey, memoryLocale);
  } catch {
    // Persistence is optional; translation and direction still work.
  }
  window.dispatchEvent(new Event(changeEvent));
}

export function LanguageProvider({ children }) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, () => defaultLocale);
  const direction = locale === "ur" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
  }, [locale, direction]);

  return (
    <LanguageContext.Provider value={{ locale, direction, messages: translations[locale], setLocale }}>
      <Direction.Provider dir={direction}>{children}</Direction.Provider>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
