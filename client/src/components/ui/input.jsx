import { cn } from "@/lib/utils";

export function Input({ className, ...props }) {
  return <input data-slot="input" className={cn("form-input", className)} {...props} />;
}

export function Textarea({ className, ...props }) {
  return <textarea data-slot="textarea" className={cn("form-input min-h-36 resize-y py-3", className)} {...props} />;
}

export function NativeSelect({ className, children, ...props }) {
  return <select data-slot="select" className={cn("form-input cursor-pointer", className)} {...props}>{children}</select>;
}
