import Link from "next/link";
import { portalPath } from "@/config/portal";

export function SiteLink({ href, children, ...props }) {
  if (href.startsWith("https://") || href.startsWith("http://") || href === "/membership" || href.startsWith(portalPath)) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
}
