"use client";

import Image from "next/image";
import { LockKeyhole, Mail } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { media } from "@/config/media";

export function AdminLogin() {
  const { messages } = useLanguage();
  const copy = messages.admin;

  return (
    <Card className="admin-login-card">
      <div className="admin-login-heading">
        <Image src={media.logo.src} alt="" width={72} height={72} className="admin-login-logo" priority />
        <p className="text-eyebrow">{copy.portal}</p>
        <h1 className="heading-section">{copy.login}</h1>
      </div>
      <form className="admin-login-form" aria-describedby="admin-login-status">
        <div>
          <label className="form-label" htmlFor="admin-email">{copy.email}</label>
          <div className="admin-input-wrap"><Mail aria-hidden="true" /><Input id="admin-email" type="email" autoComplete="username" disabled /></div>
        </div>
        <div>
          <label className="form-label" htmlFor="admin-password">{copy.password}</label>
          <div className="admin-input-wrap"><LockKeyhole aria-hidden="true" /><Input id="admin-password" type="password" autoComplete="current-password" disabled /></div>
        </div>
        <Button type="submit" size="lg" disabled>{copy.signIn}</Button>
        <p id="admin-login-status" className="text-small admin-login-status">{copy.unavailable}</p>
      </form>
    </Card>
  );
}
