import { desktopHref, site } from "../site";
import { Icon } from "./Icons";
export function DesktopAppButton({ className = "" }: { className?: string }) {
  return (
    <a
      className={`desktop-app-button ${className}`}
      href={desktopHref}
      {...(site.desktopUrl
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      aria-label={`Open ExecordusTrade desktop app${site.desktopUrl ? " (opens in a new tab)" : ""}`}
    >
      <Icon name="desktop" size={17} />
      <span>Desktop app</span>
      <Icon name="up" size={13} />
    </a>
  );
}
