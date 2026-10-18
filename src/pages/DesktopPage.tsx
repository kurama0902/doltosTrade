import { PageLayout } from "../components/PageLayout";
import { DesktopAppButton } from "../components/DesktopAppButton";
import { TradingTerminal } from "../components/Charts";
import { Icon } from "../components/Icons";
import { site } from "../site";
export default function DesktopPage() {
  return (
    <PageLayout
      title="Your desktop. A deeper view."
      eyebrow="EXECORDUSTRADE DESKTOP"
      description="Footprint charts, liquidity, volume, and AI-assisted analysis. Explore a focused workspace for your futures-trading process."
      current="Desktop app"
    >
      <div className="desktop-page-actions">
        {site.desktopUrl ? (
          <DesktopAppButton className="desktop-primary" />
        ) : (
          <a className="button" href="/#features">
            Explore the platform <Icon name="arrow" size={17} />
          </a>
        )}
        <a className="text-link" href="/#pricing">
          Compare toolkits <Icon name="up" size={15} />
        </a>
      </div>
      <div className="desktop-showcase">
        <span className="eyebrow">
          INTERACTIVE WORKSPACE PREVIEW · SIMULATED DATA
        </span>
        <TradingTerminal large />
      </div>
      <div className="desktop-benefits">
        {[
          [
            "chart",
            "Read order flow",
            "Footprint charts, Volume & Delta Profile, and the Order Flow Analyzer bring volume into context.",
          ],
          [
            "bank",
            "See the liquidity",
            "DeepDOM presents an order ladder with a liquidity heatmap to explore resting size.",
          ],
          [
            "user",
            "Keep your perspective",
            "An AI Assistant supports analysis. The final trading decision always remains yours.",
          ],
        ].map(([icon, title, text]) => (
          <article key={title}>
            <Icon name={icon} size={26} />
            <h2>{title}</h2>
            <p>{text}</p>
          </article>
        ))}
      </div>
      <section className="desktop-access" id="desktop-access">
        <div>
          <span className="eyebrow">DESKTOP ACCESS</span>
          <h2>
            {site.desktopUrl
              ? "Open the official app destination."
              : "Desktop access, in one place."}
          </h2>
          <p>
            {site.desktopUrl
              ? "Use the desktop-app button to continue to the configured official destination. Review its release information, operating-system requirements, and privacy notice before installing or signing in."
              : "Contact us for the official desktop access link and current system requirements. In the meantime, explore the interactive browser preview and compare the available toolkits."}
          </p>
          <a className="text-link" href="/privacy/">
            Read the privacy policy <Icon name="arrow" size={15} />
          </a>
        </div>
        {site.desktopUrl ? (
          <DesktopAppButton className="desktop-primary" />
        ) : (
          <a
            className="button"
            href={`mailto:${site.privacyEmail || "earlyaccess@execordus.org"}?subject=ExecordusTrade%20desktop%20access`}
          >
            Request desktop access <Icon name="up" size={16} />
          </a>
        )}
      </section>
    </PageLayout>
  );
}
