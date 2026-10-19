import { cn } from "@/lib/utils";

export function Container({ as: Component = "div", narrow = false, className, ...props }) {
  return <Component className={cn(narrow ? "container-content" : "container-page", className)} {...props} />;
}
