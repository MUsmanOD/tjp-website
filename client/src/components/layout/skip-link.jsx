"use client";

import { useLanguage } from "@/components/providers/language-provider";

export function SkipLink() {
  const { messages } = useLanguage();
  return <a className="skip-link" href="#main-content">{messages.common.skip}</a>;
}
