import { cn } from "@/lib/utils";

function Card({ className, ...props }) {
  return <div data-slot="card" className={cn("card-panel", className)} {...props} />;
}

function CardHeader({ className, ...props }) {
  return <div data-slot="card-header" className={cn("flex flex-col gap-3 p-7 pb-0", className)} {...props} />;
}

function CardTitle({ as: Component = "h3", className, ...props }) {
  return <Component data-slot="card-title" className={cn("heading-card", className)} {...props} />;
}

function CardContent({ className, ...props }) {
  return <div data-slot="card-content" className={cn("p-7 pt-4", className)} {...props} />;
}

export { Card, CardHeader, CardTitle, CardContent };
