"use client";

import { useState } from "react";
import { ArrowUpRight, Printer } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SiteLink } from "@/components/layout/site-link";
import { PageIntro } from "@/components/content/page-intro";
import { FormField } from "@/components/forms/form-field";
import { useLanguage } from "@/components/providers/language-provider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEphemeralForm } from "@/components/forms/use-ephemeral-form";

export function MembershipContent() {
  const { messages, locale } = useLanguage();
  const [printed, setPrinted] = useState(false);
  const copy = messages.membership;
  const formRef = useEphemeralForm();
  return <>
    <PageIntro content={copy} breadcrumb={messages.common.membership} />
    <section className="section-space membership-section"><Container className="grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
      <aside className="membership-aside" data-scroll-reveal><p className="text-eyebrow mb-4">{messages.brand.name}</p><h2 className="heading-section">{copy.stepsTitle}</h2><ol className="mt-9 space-y-8">{copy.steps.map((step, index) => <li key={index} className="flex items-start gap-4"><span className="step-number" aria-hidden="true">{new Intl.NumberFormat(locale, { minimumIntegerDigits: 2 }).format(index + 1)}</span><div><h3 className="heading-card">{step.title}</h3><p className="text-body mt-2 text-muted-foreground">{step.description}</p></div></li>)}</ol><SiteLink href="/contact" className="section-action mt-9">{copy.contact}<ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden="true" /></SiteLink></aside>
      <Card className="form-card membership-form" data-scroll-reveal data-scroll-delay="80">
        <p className="print-only heading-card mb-6">{copy.printTitle}</p>
        <h2 className="heading-section">{copy.heading}</h2><p className="text-body mt-3 text-muted-foreground">{copy.descriptionForm}</p><p className="form-notice mt-6">{copy.notice}</p>
        <form ref={formRef} className="mt-7 space-y-5" onChange={() => setPrinted(false)} onReset={() => setPrinted(false)} onSubmit={(event) => { event.preventDefault(); setPrinted(true); window.print(); }}>
          <p className="text-small text-muted-foreground">{messages.form.required}</p>
          <FormField name="name" required autoComplete="name" maxLength={100} />
          <div className="grid gap-5 sm:grid-cols-2"><FormField name="email" type="email" required autoComplete="email" maxLength={254} /><FormField name="phone" type="tel" required autoComplete="tel" pattern={"[+0-9 .\\(\\)\\-]{7,25}"} /></div>
          <div className="grid gap-5 sm:grid-cols-2"><FormField name="city" required autoComplete="address-level2" maxLength={100} /><FormField name="province" options={messages.form.regions} required autoComplete="address-level1" /></div>
          <FormField name="interest" options={messages.form.interests} required />
          <label className="consent-label"><input type="checkbox" name="consent" required onInvalid={(event) => event.currentTarget.setCustomValidity(messages.form.consentError)} onChange={(event) => event.currentTarget.setCustomValidity("")} /><span>{copy.consent}</span></label>
          <p className="text-small text-muted-foreground">{messages.form.privacy}</p>
          <Button type="submit" size="lg" className="print-hide"><Printer className="size-4" aria-hidden="true" />{copy.action}</Button>
          {printed && <p role="status" className="form-notice print-hide">{copy.printed}</p>}
        </form>
      </Card>
    </Container></section>
  </>;
}
