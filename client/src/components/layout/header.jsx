import Link from "next/link";
import { InteractiveText } from "@/components/motion/interactive-text";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { NavigationLinks } from "@/components/layout/navigation-links";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Header({
  name = siteConfig.name,
  navigation = siteConfig.navigation,
  className,
}) {
  return (
    <header
      className={cn("shrink-0 border-b border-border bg-background", className)}
    >
      <div className="container-page flex h-18 items-center justify-between gap-6">
        <Link href="/" className="brand-link" aria-label={`${name} home`}>
          <InteractiveText>{name}</InteractiveText>
        </Link>
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-8 md:flex"
        >
          <NavigationLinks items={navigation} />
        </nav>
        <MobileNavigation name={name} items={navigation} />
      </div>
    </header>
  );
}
