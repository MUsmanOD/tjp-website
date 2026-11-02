"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";
export function LocationPicker({
  name,
  value,
  options,
  onChange,
  manual = false,
  onManual,
  disabled,
  error,
}) {
  const { messages, locale } = useLanguage(),
    t = messages.portal;
  const [open, setOpen] = useState(false),
    [search, setSearch] = useState("");
  const selected = options.find((o) => o.id === value),
    filtered = options.filter((o) =>
      (o.en + " " + o.ur).toLowerCase().includes(search.toLowerCase()),
    );
  return (
    <div>
      <label className="form-label" id={name + "-label"}>
        {t[name]} *
      </label>
      <Button
        id={"application-" + name}
        type="button"
        variant="outline"
        disabled={disabled}
        aria-labelledby={name + "-label"}
        aria-invalid={!!error}
        aria-describedby={error ? name + "-error" : undefined}
        className="w-full justify-between whitespace-normal text-start"
        onClick={() => {
          setSearch("");
          setOpen(true);
        }}
      >
        {manual ? t.other : selected?.[locale] || selected?.en || t.choose}
        <span aria-hidden="true">⌄</span>
      </Button>
      {manual && (
        <Input
          className="mt-2"
          aria-label={t[name] + " " + t.other}
          aria-invalid={!!error}
          aria-describedby={error ? name + "-error" : undefined}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={150}
        />
      )}
      {error && (
        <p id={name + "-error"} role="alert" className="text-small mt-2">
          {t.errors[error] || t.errors.INVALID}
        </p>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          closeLabel={messages.common.close}
          className="w-[95vw] max-w-lg p-6"
        >
          <DialogTitle className="heading-card">{t[name]}</DialogTitle>
          <DialogDescription>{t.choose}</DialogDescription>
          <Input
            autoFocus
            aria-label={t.search}
            placeholder={t.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div
            className="mt-3 max-h-[50svh] overflow-y-auto"
            data-lenis-prevent
          >
            {filtered.map((o) => (
              <button
                type="button"
                className="block min-h-11 w-full rounded px-3 py-2 text-start hover:bg-secondary focus:bg-secondary"
                key={o.id}
                onClick={() => {
                  onManual?.(false);
                  onChange(o.id, false);
                  setOpen(false);
                }}
              >
                {o[locale] || o.en}
              </button>
            ))}
            {!filtered.length && <p className="p-3">{t.empty}</p>}
          </div>
          {onManual && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onManual(true);
                onChange("", true);
                setOpen(false);
              }}
            >
              {t.other}
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
