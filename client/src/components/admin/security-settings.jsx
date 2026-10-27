"use client";
import { useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/portal-api";
export function SecuritySettings({ identity, onChanged }) {
  const { messages } = useLanguage(),
    t = messages.portal;
  const [setup, setSetup] = useState(null),
    [codes, setCodes] = useState([]),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [done, setDone] = useState(false);
  async function perform(event) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget,
      values = Object.fromEntries(new FormData(form));
    setBusy(true);
    setError("");
    setDone(false);
    try {
      if (setup) {
        const result = await api("/auth/2fa/enable", {
          method: "POST",
          body: { code: values.code },
        });
        setCodes(result.recoveryCodes);
        setSetup(null);
        await onChanged();
        setDone(true);
      } else {
        await api("/auth/step-up", { method: "POST", body: values });
        if (identity.mfaEnabled) {
          await api("/auth/2fa/disable", { method: "POST" });
          await onChanged();
          setDone(true);
        } else setSetup(await api("/auth/2fa/setup", { method: "POST" }));
      }
      form.reset();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  async function cancel() {
    setBusy(true);
    try {
      await api("/auth/2fa/setup", { method: "DELETE" });
      setSetup(null);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Card className="max-w-2xl space-y-5 p-6 sm:p-8">
      <h2 className="heading-card">{t.twoFactor}</h2>
      <p className="text-body text-muted-foreground">{t.twoFactorHelp}</p>
      <p className="font-semibold">
        {identity.mfaEnabled ? t.twoFactorOn : t.twoFactorOff}
      </p>
      <p role="alert">{error ? t.errors[error] || t.errors.INTERNAL : ""}</p>
      {done && <p role="status">{t.securityUpdated}</p>}
      {codes.length ? (
        <div className="space-y-4">
          <p>{t.recoveryHelp}</p>
          <pre
            className="max-h-72 overflow-auto rounded border p-3 text-xs"
            dir="ltr"
          >
            {codes.join("\n")}
          </pre>
          <Button onClick={() => setCodes([])}>{t.savedCodes}</Button>
        </div>
      ) : (
        <form
          onSubmit={perform}
          className="space-y-5"
          key={setup ? "setup" : identity.mfaEnabled ? "enabled" : "disabled"}
        >
          {setup ? (
            <>
              <p>{t.enrollHelp}</p>
              <code dir="ltr" className="block break-all rounded border p-3">
                {setup.secret}
              </code>
              <p className="text-small">{t.setupExpiry}</p>
              <label className="block">
                {t.authenticatorCode}
                <Input
                  name="code"
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  required
                  dir="ltr"
                />
              </label>
            </>
          ) : (
            <>
              <p>
                {identity.mfaEnabled
                  ? t.disableTwoFactorHelp
                  : t.enableTwoFactorHelp}
              </p>
              <label className="block">
                {t.password}
                <Input
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  required
                />
              </label>
              {identity.mfaEnabled && (
                <label className="block">
                  {t.code}
                  <Input
                    name="code"
                    autoComplete="one-time-code"
                    required
                    dir="ltr"
                  />
                </label>
              )}
            </>
          )}
          <div className="flex flex-wrap gap-3">
            <Button disabled={busy}>
              {busy
                ? t.saving
                : setup
                  ? t.confirmTwoFactor
                  : identity.mfaEnabled
                    ? t.disableTwoFactor
                    : t.enableTwoFactor}
            </Button>
            {setup && (
              <Button
                type="button"
                variant="outline"
                disabled={busy}
                onClick={cancel}
              >
                {t.cancelSetup}
              </Button>
            )}
          </div>
        </form>
      )}
    </Card>
  );
}
