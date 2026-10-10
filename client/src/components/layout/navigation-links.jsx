import { SiteLink } from "@/components/layout/site-link";
import { cn } from "@/lib/utils";

export function NavigationLinks({ items, className, onNavigate }) {
  return items.map((item) => (
    <SiteLink
      key={item.href}
      href={item.href}
      className={cn("nav-link", className)}
      onClick={onNavigate}
    >
      {item.label}
    </SiteLink>
  ));
}
