"use client";

import { useEffect, useRef, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/components/providers/language-provider";

export function SelectField({ id, name, options, optionValues = options, placeholder, required, autoComplete, disabled }) {
  const { messages, direction } = useLanguage();
  const [value, setValue] = useState("");
  const [invalid, setInvalid] = useState(false);
  const container = useRef(null);
  const trigger = useRef(null);
  const errorId = `${id}-error`;

  useEffect(() => {
    const form = container.current.closest("form");
    const reset = () => { setValue(""); setInvalid(false); };
    form?.addEventListener("reset", reset);
    return () => form?.removeEventListener("reset", reset);
  }, []);

  return <div ref={container} onInvalidCapture={(event) => {
    event.preventDefault();
    setInvalid(true);
    // Native validation still blocks printing; focus its visible shadcn trigger.
    if (event.target === event.target.form?.querySelector(":invalid")) {
      requestAnimationFrame(() => trigger.current?.focus());
    }
  }}>
    <Select name={name} value={value} required={required} disabled={disabled} autoComplete={autoComplete} dir={direction}
      onValueChange={(next) => { setValue(next); setInvalid(false); }}>
      <SelectTrigger id={id} ref={trigger} aria-invalid={invalid || undefined} aria-describedby={invalid ? errorId : undefined}>
        <SelectValue className="min-w-0 flex-1 text-start" placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((label, index) => <SelectItem key={optionValues[index]} value={optionValues[index]}>{label}</SelectItem>)}
      </SelectContent>
    </Select>
    {invalid && <p id={errorId} role="alert" className="text-small mt-2 text-destructive">{messages.form.requiredError}</p>}
  </div>;
}
