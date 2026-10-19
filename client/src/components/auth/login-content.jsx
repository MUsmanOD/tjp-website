"use client";

import { ArrowLeft, LockKeyhole } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SiteLink } from "@/components/layout/site-link";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LoginContent() {
  const { messages } = useLanguage();
  return (
    <Container narrow className="section-space">
      <Card className="mx-auto max-w-lg text-center">
        <CardHeader className="items-center gap-5">
          <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary"><LockKeyhole aria-hidden="true" className="size-6" /></span>
          <p className="text-eyebrow">{messages.login.eyebrow}</p>
          <CardTitle as="h1" className="heading-section">{messages.login.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="text-body text-muted-foreground">{messages.login.description}</p>
          <p className="text-small text-muted-foreground">{messages.login.note}</p>
          <Button asChild><SiteLink href="/"><ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" />{messages.common.backHome}</SiteLink></Button>
        </CardContent>
      </Card>
    </Container>
  );
}
