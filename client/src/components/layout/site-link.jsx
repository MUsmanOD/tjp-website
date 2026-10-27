import Link from "next/link";

export function SiteLink({ href, children, ...props }) {
  if (href.startsWith("https://") || href.startsWith("http://") || href === '/membership' || href.startsWith('/admin')) {
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
