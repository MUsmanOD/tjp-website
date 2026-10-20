"use client";

import { Select as SelectPrimitive } from "radix-ui";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;

export function SelectTrigger({ className, children, ...props }) {
  return <SelectPrimitive.Trigger data-slot="select-trigger" className={cn("form-input form-select-trigger flex min-w-0 items-center justify-between gap-3 text-start", className)} {...props}>
    {children}
    <SelectPrimitive.Icon asChild><ChevronDown className="ms-auto size-4 shrink-0 text-muted-foreground" aria-hidden="true" /></SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>;
}

export function SelectContent({ className, children, ...props }) {
  return <SelectPrimitive.Portal>
    <SelectPrimitive.Content data-slot="select-content" position="popper" sideOffset={6} data-lenis-prevent
      className={cn("select-content relative z-[60] max-h-[min(var(--radix-select-content-available-height),20rem)] min-w-[var(--radix-select-trigger-width)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-lg border bg-background text-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95", className)} {...props}>
      <SelectPrimitive.ScrollUpButton className="flex h-6 items-center justify-center"><ChevronUp className="size-4" aria-hidden="true" /></SelectPrimitive.ScrollUpButton>
      <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
      <SelectPrimitive.ScrollDownButton className="flex h-6 items-center justify-center"><ChevronDown className="size-4" aria-hidden="true" /></SelectPrimitive.ScrollDownButton>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>;
}

export function SelectItem({ className, children, ...props }) {
  return <SelectPrimitive.Item data-slot="select-item"
    className={cn("select-item relative flex min-h-11 cursor-default items-center rounded-md py-2 pe-9 ps-3 text-sm outline-none select-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[state=checked]:font-medium data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className)} {...props}>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    <SelectPrimitive.ItemIndicator className="absolute end-3 flex size-4 items-center justify-center"><Check className="size-4" aria-hidden="true" /></SelectPrimitive.ItemIndicator>
  </SelectPrimitive.Item>;
}
