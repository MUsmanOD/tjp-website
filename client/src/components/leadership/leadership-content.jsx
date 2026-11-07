"use client";

import { PageIntro } from "@/components/content/page-intro";
import { LeadershipSection } from "@/components/leadership/leadership-section";
import { useLanguage } from "@/components/providers/language-provider";

export function LeadershipContent() {
  const { messages } = useLanguage();
  return <><PageIntro content={messages.leadership.intro} breadcrumb={messages.navigation.leadership} showMark={false} /><LeadershipSection /></>;
}
