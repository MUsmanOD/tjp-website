"use client";

import { useState } from "react";
import { ArrowDownToLine, ArrowUpRight, CheckCircle2, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SocialLinks } from "@/components/layout/social-links";
import { PageIntro } from "@/components/content/page-intro";
import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/components/providers/language-provider";
import { siteConfig } from "@/config/site";
import { useEphemeralForm } from "@/components/forms/use-ephemeral-form";

export function ContactContent() {
  const { messages } = useLanguage();
  const [saved, setSaved] = useState(false);
  const copy = messages.contact;
  const formRef = useEphemeralForm();
  function downloadMessage(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = [messages.brand.name, ...["name", "email", "topic", "message"].map((key) => `${messages.form[key]}: ${data.get(key)}`), "", copy.saved].join("\n\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF", body], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "tjp-message.txt";
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setSaved(true);
  }
  return <>
    <PageIntro content={copy} breadcrumb={messages.navigation.contact} showMark={false} />
    <section className="contact-section">
      <Container className="contact-layout">
        <aside className="contact-info">
          <div className="contact-detail">
            <MapPin aria-hidden="true" className="contact-icon" />
            <div>
              <h2 className="heading-card">{copy.addressTitle}</h2>
              <address className="text-body mt-3 not-italic text-muted-foreground">{copy.address}</address>
            </div>
          </div>
          <div className="contact-detail">
            <Phone aria-hidden="true" className="contact-icon" />
            <div>
              <h2 className="heading-card">{copy.phoneTitle}</h2>
              <a href={`tel:${siteConfig.contact.phone}`} lang="en" dir="ltr" className="text-link mt-2 inline-flex min-h-11 items-center">{copy.phone}</a>
            </div>
          </div>
          <div>
            <h2 className="heading-card mb-3">{copy.channels}</h2>
            <SocialLinks className="contact-social" />
          </div>
          <a href={siteConfig.contact.source} className="contact-source text-link text-small" target="_blank" rel="noopener noreferrer">
            {copy.source}<ArrowUpRight className="size-4 shrink-0 rtl:-scale-x-100" aria-hidden="true" />
          </a>
        </aside>
        <Card className="contact-form-card">
          <h2 className="heading-section">{copy.heading}</h2>
          <form ref={formRef} className="contact-form" onSubmit={downloadMessage} onChange={() => setSaved(false)} onReset={() => setSaved(false)} aria-describedby="contact-hint">
            <p className="sr-only">{messages.form.required}</p>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField name="name" required autoComplete="name" maxLength={100} />
              <FormField name="email" type="email" required autoComplete="email" maxLength={254} />
            </div>
            <FormField name="topic" options={copy.topics} required />
            <FormField name="message" multiline required maxLength={4000} />
            <div className="contact-form-actions">
              <Button type="submit" size="lg" className="contact-submit focus-visible:ring-0! focus-visible:outline-0!"><ArrowDownToLine className="size-4" aria-hidden="true" />{copy.action}</Button>
              <p id="contact-hint" className="text-small max-w-xs text-muted-foreground">{copy.downloadHint}</p>
            </div>
            {saved && <p role="status" className="contact-status text-small"><CheckCircle2 className="size-5 shrink-0" aria-hidden="true" />{copy.saved}</p>}
          </form>
        </Card>
      </Container>
    </section>
    <section className="contact-faq">
      <Container narrow>
        <h2 className="heading-section mb-6">{copy.faqTitle}</h2>
        <div className="divide-y border-y">
          {copy.faqs.map((faq, index) => <details key={index} className="faq-item">
            <summary>{faq.question}<span aria-hidden="true" className="faq-plus">+</span></summary>
            <p className="text-body pb-6 pe-6 text-muted-foreground">{faq.answer}</p>
          </details>)}
        </div>
      </Container>
    </section>
  </>;
}
