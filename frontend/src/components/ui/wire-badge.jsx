import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const wireBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono-label whitespace-nowrap",
  {
    variants: {
      variant: {
        verified: "border-verified/40 bg-verified/10 text-verified",
        flagged: "border-destructive/40 bg-destructive/10 text-destructive",
        unverified: "border-primary/40 bg-primary/10 text-primary",
        info: "border-border bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

/**
 * Small uppercase mono "wire" label — the app's recurring signature mark for
 * verdicts (verified/flagged/unverified) and transparency notices (e.g.
 * translated-from-language). Ties the fake-news detector and the video
 * language handling into one visual language.
 */
const WireBadge = ({ variant, className, children, ...props }) => (
  <span className={cn(wireBadgeVariants({ variant }), className)} {...props}>
    {children}
  </span>
);

export { WireBadge, wireBadgeVariants };
