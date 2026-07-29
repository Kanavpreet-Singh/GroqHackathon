import { cn } from "@/lib/utils";

/**
 * Concentric-circle "lens aperture" mark — BriefLens's recurring optical
 * motif. Used as a loading spinner (replacing the plain spinning-border
 * divs) and as a small decorative accent next to section eyebrows.
 */
const ApertureMark = ({ spinning = false, size = 20, className, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    className={cn(spinning && "animate-spin", className)}
    style={spinning ? { animationDuration: "1.1s" } : undefined}
    aria-hidden="true"
    {...props}
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.4" opacity="0.35" />
    <circle cx="12" cy="12" r="6.5" stroke="currentColor" strokeWidth="1.4" opacity="0.6" />
    <circle cx="12" cy="12" r="2.5" fill="currentColor" />
  </svg>
);

export default ApertureMark;
