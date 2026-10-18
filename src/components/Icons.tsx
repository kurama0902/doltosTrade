import type { CSSProperties } from "react";
export function Icon({
  name,
  size = 20,
  style,
}: {
  name: string;
  size?: number;
  style?: CSSProperties;
}) {
  const paths: Record<string, React.ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </>
    ),
    up: (
      <>
        <path d="M6 18 18 6M6 6h12v12" />
      </>
    ),
    chevron: <path d="m8 10 4 4 4-4" />,
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="4" ry="9" />
        <path d="M3 12h18" />
      </>
    ),
    shield: (
      <>
        <path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
    wallet: (
      <>
        <path d="M20 8H5a2 2 0 0 1 0-4h13v4M3 6v12a2 2 0 0 0 2 2h15V8" />
        <path d="M15 12h6v5h-6z" />
      </>
    ),
    chart: (
      <>
        <path d="M4 3v17h17M8 15l4-5 4 2 5-7" />
      </>
    ),
    user: (
      <>
        <circle cx="10" cy="8" r="4" />
        <path d="M3 21v-3a7 7 0 0 1 11-6M19 14v7M15.5 17.5h7" />
      </>
    ),
    bank: (
      <>
        <path d="m3 8 9-5 9 5H3ZM5 11v7m7-7v7m7-7v7M3 21h18" />
      </>
    ),
    bolt: <path d="m13 2-9 12h7l-1 8 10-13h-7l1-7Z" />,
    lock: (
      <>
        <rect x="5" y="10" width="14" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
      </>
    ),
    gift: (
      <>
        <rect x="3" y="8" width="18" height="4" rx="1" />
        <path d="M5 12v9h14v-9M12 8v13M12 8s-7 1-7-3a2 2 0 0 1 3-2c3 1 4 5 4 5Zm0 0s7 1 7-3a2 2 0 0 0-3-2c-3 1-4 5-4 5Z" />
      </>
    ),
    headphones: (
      <>
        <path d="M4 14v-3a8 8 0 0 1 16 0v3M20 18v1a3 3 0 0 1-3 3h-4" />
        <rect x="2" y="11" width="5" height="8" rx="2" />
        <rect x="17" y="11" width="5" height="8" rx="2" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    play: <path d="m9 5 11 7-11 7V5Z" />,
    search: (
      <>
        <circle cx="10" cy="10" r="6" />
        <path d="m15 15 6 6" />
      </>
    ),
    close: <path d="m6 6 12 12M18 6 6 18" />,
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    star: (
      <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
    ),
    desktop: (
      <>
        <rect x="3" y="3" width="18" height="13" rx="2" />
        <path d="M12 16v5m-5 0h10" />
      </>
    ),
    download: (
      <>
        <path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={style}
    >
      {paths[name] || paths.chart}
    </svg>
  );
}
export function Logo() {
  return (
    <a className="logo" href="/#home" aria-label="ExecordusTrade home">
      <span className="logo-symbol">
        <i />
        <i />
        <i />
      </span>
      <span>
        Execordus<span className="logo-light">Trade</span>
        <span className="logo-dot">.</span>
      </span>
    </a>
  );
}
