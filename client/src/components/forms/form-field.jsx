"use client";

import { Input, Textarea, NativeSelect } from "@/components/ui/input";
import { SelectField } from "@/components/forms/select-field";
import { useLanguage } from "@/components/providers/language-provider";
import { useEffect, useId, useRef } from "react";

export function FormField({ name, type = "text", required = false, options, optionValues, selectVariant = "native", multiline, className, ...props }) {
  const { messages } = useLanguage();
  const copy = messages.form;
  const id = useId();
  const field = useRef(null);
  useEffect(() => { field.current?.setCustomValidity(""); }, [messages]);
  const Component = multiline ? Textarea : Input;
  const fieldProps = {
    id, ref: field, name, required,
    type: options || multiline ? undefined : type,
    dir: ["email", "tel", "password"].includes(type) ? "ltr" : undefined,
    placeholder: options ? undefined : copy[`${name}Placeholder`],
    onInvalid: (event) => {
      const field = event.currentTarget;
      field.setCustomValidity(field.validity.valueMissing ? copy.requiredError : field.validity.typeMismatch ? copy.emailError : copy.invalidError);
    },
    onInput: (event) => event.currentTarget.setCustomValidity(""),
    ...props,
  };
  return <div className={className}>
    <label htmlFor={id} className="form-label">{copy[name]} {required ? <span aria-hidden="true">*</span> : <span className="font-normal text-muted-foreground">({copy.optional})</span>}</label>
    {options && selectVariant === "custom" ? <SelectField id={id} name={name} options={options} optionValues={optionValues} placeholder={name === "province" ? copy.choose : name === "interest" ? copy.selectInterest : copy.selectTopic} required={required} autoComplete={props.autoComplete} disabled={props.disabled} /> : options ? <NativeSelect {...fieldProps}><option value="">{name === "province" ? copy.choose : name === "interest" ? copy.selectInterest : copy.selectTopic}</option>{options.map((label, index) => <option key={index} value={label}>{label}</option>)}</NativeSelect> : <Component {...fieldProps} />}
  </div>;
}
