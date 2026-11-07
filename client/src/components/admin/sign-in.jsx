"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/providers/language-provider";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { Brand } from "@/components/layout/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/portal-api";
import { portalDashboardPath } from "@/config/portal";
export function AdminSignIn() {
  const { messages } = useLanguage(),
    t = messages.portal,
    router = useRouter();
  const [challenge, setChallenge] = useState(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    api("/auth/me").then(() => {
      if (active) router.replace(portalDashboardPath);
    }).catch(() => {});
    return () => { active = false; };
  }, [router]);
  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    const values = Object.fromEntries(new FormData(event.currentTarget));
    setBusy(true);
    setError("");
    try {
      if (challenge) {
        await api("/auth/mfa", {
          method: "POST",
          body: { challenge: challenge.challenge, code: values.code },
        });
        router.replace(portalDashboardPath);
      } else {
        const result = await api("/auth/login", {
          method: "POST",
          body: values,
        });
        if (result.mfaRequired) setChallenge(result);
        else if (result.authenticated) router.replace(portalDashboardPath);
        else throw new Error("INTERNAL");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main id="main-content" className="admin-login-page">
      <Card className="admin-login-card">
        <div className="flex justify-between">
          <Brand compact />
          <LanguageSwitcher />
        </div>
        <h1 className="heading-section mt-6">{t.signIn}</h1>
        <form
          onSubmit={submit}
          className="mt-6 space-y-5"
          key={challenge ? "mfa" : "password"}
        >
          {challenge ? (
            <label className="block">
              {t.code}
              <Input
                name="code"
                autoComplete="one-time-code"
                required
                dir="ltr"
              />
            </label>
          ) : (
            <>
              <label className="block">
                {t.email}
                <Input
                  name="email"
                  type="email"
                  autoComplete="username"
                  required
                />
              </label>
              <label className="block">
                {t.password}
                <Input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </label>
            </>
          )}
          <p role="alert">
            {error ? t.errors[error] || t.errors.INTERNAL : ""}
          </p>
          <Button disabled={busy}>{busy ? t.saving : t.continue}</Button>
          {challenge && (
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={() => {
                setChallenge(null);
                setError("");
              }}
            >
              {t.backToSignIn}
            </Button>
          )}
        </form>
      </Card>
    </main>
  );
}
