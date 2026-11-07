"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, CheckCircle2, Mail, MapPin, Phone, Send } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SocialLinks } from "@/components/layout/social-links";
import { PageIntro } from "@/components/content/page-intro";
import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/components/providers/language-provider";
import { siteConfig } from "@/config/site";
import { useEphemeralForm } from "@/components/forms/use-ephemeral-form";
import { api } from "@/lib/portal-api";
import { contactTopics, localized, useWebsite } from "@/lib/website-content";

export function ContactContent() {
  const { messages, locale } = useLanguage();
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const messageId = useRef(null);
  const copy = messages.contact;
  const formRef = useEphemeralForm();
  const contact = useWebsite()?.contact;
  const name = localized(contact?.name, locale);
  const address = contact ? localized(contact.address, locale) : copy.address;
  const phone = contact?.phone ?? siteConfig.contact.phone;
  async function sendMessage(event) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    messageId.current ??= crypto.randomUUID();
    setBusy(true);
    setSaved(false);
    setError("");
    try {
      await api("/website/messages", { method: "POST", body: { ...data, id: messageId.current } });
      form.reset();
      messageId.current = null;
      setSaved(true);
    } catch (failure) {
      setError(messages.portal.errors[failure.message] || messages.portal.errors.INTERNAL);
    } finally {
      setBusy(false);
    }
  }
  return <>
    <PageIntro content={copy} breadcrumb={messages.navigation.contact} showMark={false} />
    <section className="contact-section">
      <Container className="contact-layout">
        <aside className="contact-info" data-scroll-reveal>
          {name && <h2 className="heading-card">{name}</h2>}
          {address && <div className="contact-detail">
            <MapPin aria-hidden="true" className="contact-icon" />
            <div>
              <h2 className="heading-card">{copy.addressTitle}</h2>
              <address className="text-body mt-3 not-italic text-muted-foreground">{address}</address>
            </div>
          </div>}
          {phone && <div className="contact-detail">
            <Phone aria-hidden="true" className="contact-icon" />
            <div>
              <h2 className="heading-card">{copy.phoneTitle}</h2>
              <a href={`tel:${phone}`} lang="en" dir="ltr" className="text-link mt-2 inline-flex min-h-11 items-center">{phone === siteConfig.contact.phone ? copy.phone : phone}</a>
            </div>
          </div>}
          {contact?.email && <div className="contact-detail"><Mail aria-hidden="true" className="contact-icon" /><div>
            <h2 className="heading-card">{messages.form.email}</h2>
            <a href={`mailto:${contact.email}`} lang="en" dir="ltr" className="text-link mt-2 block break-all">{contact.email}</a>
          </div></div>}
          <div>
            <h2 className="heading-card mb-3">{copy.channels}</h2>
            <SocialLinks className="contact-social" />
          </div>
          <a href={siteConfig.contact.source} className="contact-source text-link text-small" target="_blank" rel="noopener noreferrer">
            {copy.source}<ArrowUpRight className="size-4 shrink-0 rtl:-scale-x-100" aria-hidden="true" />
          </a>
        </aside>
        <Card className="contact-form-card" data-scroll-reveal data-scroll-delay="80">
          <h2 className="heading-section">{copy.heading}</h2>
          <form ref={formRef} className="contact-form" onSubmit={sendMessage} onChange={() => { messageId.current = null; setSaved(false); setError(""); }} aria-describedby="contact-hint">
            <fieldset disabled={busy} className="contents">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField name="name" required autoComplete="name" maxLength={100} />
              <FormField name="email" type="email" required autoComplete="email" maxLength={254} />
            </div>
            <FormField name="topic" options={copy.topics} optionValues={contactTopics} required />
            <FormField name="message" multiline required maxLength={4000} />
            <div className="contact-form-actions">
              <Button type="submit" size="lg" className="contact-submit"><Send className="size-4" aria-hidden="true" />{busy ? messages.portal.saving : copy.action}</Button>
              <p id="contact-hint" className="text-small max-w-xs text-muted-foreground">{copy.formDescription}</p>
            </div>
            </fieldset>
            {error && <p role="alert" className="text-small text-destructive">{error}</p>}
            {saved && <p role="status" className="contact-status text-small"><CheckCircle2 className="size-5 shrink-0" aria-hidden="true" />{copy.saved}</p>}
          </form>
        </Card>
      </Container>
    </section>
    <section className="contact-faq">
      <Container narrow>
        <h2 className="heading-section mb-6" data-scroll-reveal>{copy.faqTitle}</h2>
        <div className="divide-y border-y" data-scroll-reveal>
          {copy.faqs.map((faq, index) => <details key={index} className="faq-item">
            <summary>{faq.question}<span aria-hidden="true" className="faq-plus">+</span></summary>
            <p className="text-body pb-6 pe-6 text-muted-foreground">{faq.answer}</p>
          </details>)}
        </div>
      </Container>
    </section>
  </>;
}
