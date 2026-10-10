import Link from "next/link";

export function SiteLink({ href, children, ...props }) {
  if (href.startsWith("https://") || href.startsWith("http://")) {
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
