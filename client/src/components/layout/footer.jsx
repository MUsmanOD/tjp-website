import Link from "next/link";
import { InteractiveText } from "@/components/motion/interactive-text";
import { NavigationLinks } from "@/components/layout/navigation-links";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Footer({
  name = siteConfig.name,
  navigation = siteConfig.navigation,
  className,
}) {
  return (
    <footer
      className={cn("shrink-0 border-t border-border bg-background", className)}
    >
      <div className="container-page space-y-6 py-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <Link href="/" className="brand-link" aria-label={`${name} home`}>
            <InteractiveText>{name}</InteractiveText>
          </Link>
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap gap-x-6 gap-y-3"
          >
            <NavigationLinks items={navigation} />
          </nav>
        </div>
        <Separator />
        <p className="text-small text-muted-foreground">
          &copy; {name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
