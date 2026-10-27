import { cn } from "@/lib/utils";
export function Badge({ className, ...props }) {
  return (
    <span
      data-slot="badge"
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        className,
      )}
      {...props}
    />
  );
}
