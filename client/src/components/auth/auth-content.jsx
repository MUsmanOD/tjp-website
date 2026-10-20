"use client";

import Image from "next/image";
import { Container } from "@/components/layout/container";
import { Brand } from "@/components/layout/brand";
import { SiteLink } from "@/components/layout/site-link";
import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";
import { media } from "@/config/media";

export function AuthContent({ signup = false }) {
  const { messages } = useLanguage();
  const copy = messages.auth;
  return <Container className="auth-container">
    <div className="auth-panel">
      <div className="auth-visual">
        <Image src={media.islamabad.src} alt={messages.media.islamabad.alt} fill sizes="(max-width: 1023px) 100vw, 50vw" className="object-cover" />
        <div className="absolute inset-0 bg-black/55" aria-hidden="true" />
        <div className="auth-visual-copy">
          <Brand compact className="text-white" />
          <div>
            <p className="text-eyebrow mb-4 text-white/80">{copy.eyebrow}</p>
            <h2 className="heading-section whitespace-pre-line text-white">{copy.title}</h2>
          </div>
          <a href={media.islamabad.source} target="_blank" rel="noopener noreferrer" className="text-small min-h-11 text-white/80 underline underline-offset-4">{messages.footer.credits}</a>
        </div>
      </div>
      <div className="auth-form-panel" data-lenis-prevent>
        <div className="auth-form-content">
          <h1 className="heading-section">{signup ? copy.signupTitle : messages.common.login}</h1>
          <p id="auth-notice" className="sr-only">{copy.notice}</p>
          <fieldset disabled aria-describedby="auth-notice" className="auth-fields">
            {signup && <FormField name="name" required autoComplete="off" placeholder="" />}
            <FormField name="email" type="email" required autoComplete="off" />
            <FormField name="password" type="password" required autoComplete="off" placeholder="" />
            {signup && <FormField name="confirmPassword" type="password" required autoComplete="off" placeholder="" />}
            <Button disabled className="w-full" size="lg">{signup ? copy.signupAction : copy.loginAction}</Button>
          </fieldset>
          <SiteLink className="auth-switch text-link" href={signup ? "/login" : "/signup"}>{signup ? messages.common.login : messages.common.signup}</SiteLink>
        </div>
      </div>
    </div>
  </Container>;
}
