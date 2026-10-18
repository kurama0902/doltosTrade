import type { ReactNode } from "react";
import { Logo, Icon } from "./Icons";
import { DesktopAppButton } from "./DesktopAppButton";
import { riskDisclosure } from "../content";
export function PageLayout({
  title,
  eyebrow,
  description,
  children,
  current,
}: {
  title: string;
  eyebrow: string;
  description: string;
  children: ReactNode;
  current: string;
}) {
  return (
    <div className="content-page">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="header">
        <div className="container document-nav">
          <Logo />
          <nav aria-label="Main navigation">
            <a href="/#features">Platform</a>
            <a href="/#pricing">Pricing</a>
            <a href="/#learn">Learn</a>
          </nav>
          <DesktopAppButton />
        </div>
      </header>
      <main id="main" className="container document-main">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{current}</span>
        </nav>
        <div className="document-hero">
          <div className="eyebrow">{eyebrow}</div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        {children}
      </main>
      <footer className="footer document-footer">
        <div className="container">
          <div className="document-footer-top">
            <Logo />
            <a href="/#features">
              Explore the platform <Icon name="arrow" size={15} />
            </a>
          </div>
          <p className="risk-disclosure">{riskDisclosure}</p>
          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} ExecordusTrade. All rights reserved.
            </span>
            <div>
              <a href="/privacy/">Privacy policy</a>
              <a href="/desktop/">Desktop application</a>
              <a href="/">Home</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
