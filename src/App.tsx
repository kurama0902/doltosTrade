import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { usePageMotion } from "./hooks/usePageMotion";
import StarBorder from "./components/react-bits/StarBorder";
import SpotlightCard from "./components/react-bits/SpotlightCard";
import { Icon, Logo } from "./components/Icons";
import { TradingTerminal } from "./components/Charts";
import { CollaboratorCarousel } from "./components/CollaboratorCarousel";
import { DesktopAppButton } from "./components/DesktopAppButton";
import { OrderFlowLab } from "./components/OrderFlowLab";
import {
  features,
  plans,
  lessons,
  assistantExamples,
  riskDisclosure,
} from "./content";

type Modal =
  | { type: "trial" | "login"; plan?: string }
  | { type: "info"; title: string; body: string }
  | null;

function App() {
  const root = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const [menu, setMenu] = useState(false);
  const [modal, setModal] = useState<Modal>(null);
  const [complete, setComplete] = useState(false);
  const [example, setExample] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState("Full");
  usePageMotion(root);

  useEffect(() => {
    if (modal) {
      if (!dialog.current?.open)
        previousFocus.current = document.activeElement as HTMLElement;
      setComplete(false);
      dialog.current?.showModal();
    } else {
      dialog.current?.close();
      previousFocus.current?.focus();
    }
  }, [modal]);
  const openInfo = (title: string, body: string) =>
    setModal({ type: "info", title, body });
  const tryPlatform = (plan = "Full") => {
    setSelectedPlan(plan);
    setModal({ type: "trial", plan });
  };
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setComplete(true);
  };
  return (
    <div ref={root} className="futures-site">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="header">
        <div className="container nav">
          <Logo />
          <nav
            className={menu ? "nav-links open" : "nav-links"}
            aria-label="Main navigation"
          >
            {[
              ["Platform", "features"],
              ["AI Assistant", "assistant"],
              ["Pricing", "pricing"],
              ["Learn", "learn"],
            ].map(([label, id]) => (
              <a href={`#${id}`} key={id} onClick={() => setMenu(false)}>
                {label}
                {id === "assistant" && <span className="nav-new">AI</span>}
              </a>
            ))}
          </nav>
          <div className="nav-actions">
            <DesktopAppButton className="nav-desktop" />
            <span className="language">
              <Icon name="globe" size={15} />
              <span>EN</span>
            </span>
            <button
              className="login"
              onClick={() => setModal({ type: "login" })}
            >
              Log in
            </button>
            <button
              className="button button-small"
              onClick={() => tryPlatform()}
            >
              Try it <Icon name="up" size={15} />
            </button>
            <button
              className="menu-toggle icon-button"
              onClick={() => setMenu(!menu)}
              aria-label="Toggle navigation"
              aria-expanded={menu}
            >
              <Icon name={menu ? "close" : "menu"} />
            </button>
          </div>
        </div>
      </header>
      <main id="main">
        <section id="home" className="hero">
          <div className="hero-grid" />
          <div className="container hero-layout">
            <div className="hero-copy">
              <div className="eyebrow hero-enter">
                <span className="status-dot" /> BUILT FOR FUTURES TRADERS{" "}
                <span className="eyebrow-line" />
              </div>
              <h1 aria-label="Read order flow. Not just candles.">
                <span className="headline-line">
                  <span className="headline-word">Read</span>{" "}
                  <span className="headline-word">order flow.</span>
                </span>
                <span className="headline-line blue">
                  <span className="headline-word">Not just</span>{" "}
                  <span className="headline-word">candles.</span>
                </span>
              </h1>
              <p className="hero-description hero-enter">
                Footprint, Volume Profile, and DOM with a liquidity heatmap.
                Plus an AI Assistant to support your trading decisions. A
                professional platform for futures traders.
              </p>
              <div className="hero-buttons hero-enter">
                <StarBorder
                  as="button"
                  onClick={() => tryPlatform()}
                  backgroundColor="#595cff"
                  color="#b8bbff"
                  borderColor="#8688ff"
                  radius={8}
                  className="primary-cta"
                >
                  Try it <Icon name="up" size={18} />
                </StarBorder>
                <a className="watch-button" href="#pricing">
                  View pricing <Icon name="arrow" size={17} />
                </a>
              </div>
              <div className="hero-proof hero-enter">
                <span>
                  <Icon name="check" size={13} /> Read the volume
                </span>
                <span>
                  <Icon name="check" size={13} /> See the liquidity
                </span>
                <span>
                  <Icon name="check" size={13} /> Own the decision
                </span>
              </div>
              <DesktopAppButton className="hero-desktop hero-enter" />
            </div>
            <div className="hero-visual">
              <div className="orbit-orb parallax-orbit">
                <div className="orb-ring ring-one" />
                <div className="orb-ring ring-two" />
                <div className="orb-core">Δ</div>
                <div className="orb-cross">✦</div>
              </div>
              <span className="visual-coordinate">BEYOND THE CANDLE.</span>
              <div className="hero-terminal parallax-terminal">
                <TradingTerminal />
                <div className="terminal-base" />
              </div>
              <div className="floating-card">
                <span className="floating-icon">
                  <Icon name="user" size={20} />
                </span>
                <div>
                  <span>AI Assistant</span>
                  <strong>A second perspective.</strong>
                </div>
                <span className="floating-spark">✦</span>
              </div>
              <div className="visual-caption">
                <span className="status-dot" /> VOLUME. LIQUIDITY. CONTEXT.{" "}
                <span>↗</span>
              </div>
            </div>
          </div>
          <CollaboratorCarousel />
        </section>

        <section
          className="container metrics-section"
          aria-label="Platform at a glance"
        >
          <div className="platform-stats">
            <div>
              <strong>8</strong>
              <span>Indicators</span>
            </div>
            <div>
              <strong>
                0.015<span> s</span>
              </strong>
              <span>Platform refresh</span>
            </div>
            <div>
              <strong>
                <span className="metric-ai">✦</span> AI
              </strong>
              <span>Your trading assistant</span>
            </div>
          </div>
        </section>

        <section id="features" className="section container features-section">
          <div className="section-heading reveal">
            <div>
              <div className="eyebrow">
                <span className="section-number">01 /</span> READ WHAT MOVES THE
                MARKET
              </div>
              <h2>
                More than a chart.
                <br />
                <span className="muted">A deeper view of the market.</span>
              </h2>
            </div>
            <p className="section-description">
              Volume, liquidity, and intelligence.
              <br />
              One professional futures workspace.
            </p>
          </div>
          <div className="platform-shell reveal">
            <div className="platform-nav">
              <div className="platform-feature">
                <Icon name="chart" size={18} /> Your order-flow workspace
              </div>
              <span>See inside every move.</span>
              <span className="demo-badge">INTERACTIVE PREVIEW</span>
            </div>
            <TradingTerminal large />
            <a className="terminal-lab-link" href="#analytics">
              Explore the interactive market lab <Icon name="arrow" size={14} />
            </a>
          </div>
          <div className="benefit-grid feature-grid">
            {features.map((feature, i) => (
              <SpotlightCard
                className="benefit-card feature-card"
                role="article"
                key={feature.title}
                spotlightColor="#777aff"
                intensity={0.12}
              >
                <span className="benefit-index">0{i + 1} /</span>
                <div className="benefit-icon">
                  <Icon name={feature.icon} size={29} />
                </div>
                <span className="feature-tag">{feature.tag}</span>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
                <button
                  className="feature-link"
                  onClick={() => openInfo(feature.title, feature.detail)}
                  aria-label={`Explore ${feature.title}`}
                >
                  Explore <Icon name="up" size={14} />
                </button>
                {i === 0 && (
                  <span className="feature-ai-art" aria-hidden="true">
                    ✦
                  </span>
                )}
              </SpotlightCard>
            ))}
          </div>
          <OrderFlowLab />
        </section>

        <section id="assistant" className="onboarding section ai-section">
          <div className="container onboarding-layout">
            <div className="ai-copy reveal">
              <div className="eyebrow">
                <span className="section-number">02 /</span> YOUR PROCESS.
                ANOTHER PERSPECTIVE.
              </div>
              <h2>
                AI, trained to trade
                <br />
                <span className="blue">alongside you.</span>
              </h2>
              <p className="section-description">
                Our AI Assistant is personally trained by [NAME] on a real
                trading methodology. It reads order flow with you, highlights
                key levels, explains what is happening in the market, and helps
                you spot potential entry opportunities.
              </p>
              <p className="ai-decision">
                The final decision always stays with the trader.
              </p>
              <button className="text-link" onClick={() => tryPlatform("Full")}>
                Explore the Full plan{" "}
                <span className="circle-arrow">
                  <Icon name="arrow" size={15} />
                </span>
              </button>
              <div className="onboard-decoration" aria-hidden="true">
                <span>✦</span>
                <i />
                <i />
              </div>
            </div>
            <div className="assistant-panel reveal">
              <div className="assistant-panel-head">
                <span className="assistant-mark">✦</span>
                <div>
                  <strong>ExecordusTrade AI</strong>
                  <span>Order flow, with context.</span>
                </div>
                <span className="demo-badge">PREVIEW</span>
              </div>
              <div className="assistant-context">
                <span className="status-dot" /> ES · Sample replay{" "}
                <span>Order-flow analysis</span>
              </div>
              <div className="assistant-question" key={`question-${example}`}>
                <Icon name="user" size={16} />
                {assistantExamples[example].question}
              </div>
              <div className="assistant-answer" key={example}>
                <span className="assistant-answer-label">✦ AI ASSISTANT</span>
                <p>{assistantExamples[example].answer}</p>
                <span className="assistant-source">
                  <Icon name="chart" size={12} />
                  {assistantExamples[example].context}
                </span>
              </div>
              <div
                className="assistant-prompts"
                aria-label="Explore assistant examples"
              >
                {assistantExamples.map((item, i) => (
                  <button
                    key={item.question}
                    aria-pressed={example === i}
                    onClick={() => setExample(i)}
                  >
                    {item.question}
                    <Icon name="up" size={12} />
                  </button>
                ))}
              </div>
              <p className="assistant-disclosure">
                Illustrative responses from a simulated session. No live AI
                connection.
              </p>
            </div>
          </div>
        </section>

        <section
          id="connections"
          className="section container connections-section"
        >
          <div className="center-heading reveal">
            <div className="eyebrow">
              <span className="section-number">03 /</span> YOUR CONNECTION TO
              THE MARKET
            </div>
            <h2>
              Works with your data.
              <br />
              <span className="muted">And your brokers.</span>
            </h2>
            <p className="section-description">
              Connect through Rithmic, CQG, and dxFeed. Compatible with prop
              firms.
              <br />
              Trade and analyze on one platform.
            </p>
          </div>
          <div className="connection-network reveal">
            <div className="connection-line" aria-hidden="true" />
            {["Rithmic", "CQG", "dxFeed"].map((name, i) => (
              <div className="connection-card" key={name}>
                <span className={`connection-symbol connection-symbol-${i}`}>
                  {["R", "CQG", "dx"][i]}
                </span>
                <strong>{name}</strong>
                <span>Data connectivity</span>
              </div>
            ))}
            <div className="connection-hub">
              <Logo />
              <span>
                <span className="status-dot" /> One connected workspace
              </span>
            </div>
          </div>
          <p className="connection-note">
            Broker and data-feed setup is available in the full platform. This
            page shows a product preview.
          </p>
        </section>

        <section id="pricing" className="section pricing-section">
          <div className="container">
            <div className="section-heading reveal">
              <div>
                <div className="eyebrow">
                  <span className="section-number">04 /</span> YOUR TOOLS. YOUR
                  WAY.
                </div>
                <h2>
                  Find your trading toolkit<span className="blue">.</span>
                </h2>
              </div>
              <p className="section-description">
                Start with order flow.
                <br />
                Add the perspective you need.
              </p>
            </div>
            <div className="pricing-grid">
              {plans.map((plan) => (
                <SpotlightCard
                  className={`pricing-card ${plan.popular ? "popular-plan" : ""}`}
                  key={plan.name}
                  spotlightColor="#777aff"
                  intensity={0.1}
                >
                  {plan.popular && (
                    <span className="popular-badge">
                      MOST POPULAR <span>✦</span>
                    </span>
                  )}
                  <span className="plan-category">
                    {plan.name === "DeepDOM"
                      ? "STANDALONE DOM"
                      : "TRADING PLATFORM"}
                  </span>
                  <h3>{plan.name}</h3>
                  <p>{plan.description}</p>
                  <ul>
                    {plan.items.map((item) => (
                      <li key={item}>
                        <Icon name="check" size={14} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={
                      plan.popular ? "button plan-button" : "plan-button"
                    }
                    onClick={() => tryPlatform(plan.name)}
                  >
                    Choose {plan.name}
                    <Icon name="up" size={15} />
                  </button>
                </SpotlightCard>
              ))}
            </div>
          </div>
        </section>

        <section id="learn" className="section container learn-section">
          <div className="section-heading reveal">
            <div>
              <div className="eyebrow">
                <span className="section-number">05 /</span> BUILD YOUR
                UNDERSTANDING
              </div>
              <h2>
                Learn to read the market<span className="blue">.</span>
              </h2>
            </div>
            <p className="section-description">
              An order-flow course from the ground up.
              <br />
              Weekly live breakdowns. A community on Discord.
            </p>
          </div>
          <div className="learn-grid">
            {lessons.map((item) => (
              <button
                className="learn-card"
                key={item.title}
                onClick={() => openInfo(item.title, item.body)}
              >
                <div className={`learn-art ${item.art}`} aria-hidden="true">
                  {item.art === "orbit" ? (
                    <>
                      <i />
                      <i />
                      <span>Δ</span>
                      <b>+</b>
                    </>
                  ) : item.art === "candles" ? (
                    Array.from({ length: 10 }, (_, i) => (
                      <i
                        key={i}
                        style={{
                          height: `${30 + ((i * 17) % 65)}%`,
                          marginTop: `${(i * 7) % 28}px`,
                        }}
                      />
                    ))
                  ) : (
                    <>
                      <div className="security-orbit" />
                      <Icon name="headphones" size={80} />
                      <span className="security-star">✦</span>
                    </>
                  )}
                </div>
                <div className="learn-meta">
                  <span>{item.tag}</span>
                  <span>{item.time}</span>
                </div>
                <h3>
                  {item.title}
                  <Icon name="up" size={20} />
                </h3>
              </button>
            ))}
          </div>
        </section>

        <section
          className="container platform-faq"
          aria-labelledby="faq-heading"
        >
          <div className="section-heading reveal">
            <div>
              <div className="eyebrow">A CLEARER VIEW OF THE PLATFORM</div>
              <h2 id="faq-heading">Futures trading tools, explained.</h2>
            </div>
          </div>
          <div className="faq-list">
            <details>
              <summary>What is ExecordusTrade?</summary>
              <p>
                ExecordusTrade brings footprint charts, volume and delta
                profiles, DeepDOM liquidity tools, replay, and AI-assisted
                analysis into a professional futures workspace.
              </p>
            </details>
            <details>
              <summary>What can I explore in the browser?</summary>
              <p>
                The interactive preview contains simulated futures charts for
                ES, NQ, CL, and GC, plus a linked volume profile, delta chart,
                liquidity heatmap, and replay controls. No real orders are
                placed.
              </p>
            </details>
            <details>
              <summary>Which plans include the AI Assistant?</summary>
              <p>
                The Full toolkit includes proprietary indicators, the AI
                Assistant, and live sessions. Pro includes Full plus DeepGamma
                and options flow. Orderflow focuses on core volume and
                order-flow tools; DeepDOM is a standalone DOM toolkit.
              </p>
            </details>
            <details>
              <summary>Which data connections are presented?</summary>
              <p>
                The platform presents connectivity through Rithmic, CQG, and
                dxFeed, with prop-firm compatibility. The website preview does
                not connect to a broker or live data feed.
              </p>
            </details>
            <details>
              <summary>Where can I find the desktop application?</summary>
              <p>
                Visit the <a href="/desktop/">ExecordusTrade desktop page</a>{" "}
                for the workspace preview and early-access contact. The desktop
                button currently opens this placeholder page; it does not
                download or install software.
              </p>
            </details>
            <details>
              <summary>
                Does the AI Assistant provide investment advice?
              </summary>
              <p>
                No. The AI Assistant supports analysis, and the final decision
                stays with the trader. Website responses are illustrative
                examples. Futures trading involves a high risk of loss.
              </p>
            </details>
          </div>
        </section>

        <section className="container newsletter final-cta reveal">
          <div className="newsletter-orbit" aria-hidden="true" />
          <div>
            <div className="eyebrow">YOUR NEXT PERSPECTIVE</div>
            <h2>See the market deeper.</h2>
            <p>Order flow. Liquidity. AI. Your decision.</p>
          </div>
          <StarBorder
            as="button"
            onClick={() => tryPlatform()}
            backgroundColor="#ffffff"
            textColor="#4143b4"
            color="#c6c8ff"
            radius={7}
            className="final-cta-button"
          >
            Get started <Icon name="up" size={19} />
          </StarBorder>
        </section>
      </main>
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <Logo />
              <p>
                A deeper view.
                <br />A more informed decision.
              </p>
            </div>
            <div className="footer-column">
              <h4>Platform</h4>
              <a href="#features">Order-flow tools</a>
              <a href="#assistant">AI Assistant</a>
              <a href="#connections">Connectivity</a>
              <a href="/desktop/">Desktop application</a>
              <a href="#pricing">Plans</a>
            </div>
            <div className="footer-column">
              <h4>Learn</h4>
              <a href="#learn">Order-flow course</a>
              <a href="#learn">Live breakdowns</a>
              <a href="#learn">Discord community</a>
            </div>
            <div className="footer-column">
              <h4>ExecordusTrade</h4>
              <button
                onClick={() =>
                  openInfo(
                    "Help center",
                    "Explore the platform preview by changing the futures contract, timeframe, and chart view. Choose a plan to preview the access flow. The AI section contains interactive examples; it is not connected to a live model.",
                  )
                }
              >
                Help center
              </button>
              <button onClick={() => setModal({ type: "login" })}>
                Log in
              </button>
              <button onClick={() => tryPlatform()}>Try the platform</button>
            </div>
            <div className="footer-message">
              Read the flow.
              <br />
              <span>Own the decision.</span>
              <span className="footer-big-star">✳</span>
            </div>
          </div>
          <p className="risk-disclosure">{riskDisclosure}</p>
          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} ExecordusTrade. All rights reserved.
            </span>
            <div>
              <a href="/privacy/">Privacy policy</a>
              <button
                onClick={() =>
                  openInfo(
                    "Terms of this preview",
                    `ExecordusTrade is presented here as a frontend product demonstration. Chart prices and assistant responses are simulated. No orders are placed, accounts created, or payments collected. ${riskDisclosure}`,
                  )
                }
              >
                Terms of service
              </button>
              <a href="#home">Back to top ↑</a>
            </div>
            <span className="footer-status">
              <span className="status-dot" /> Futures & order flow
            </span>
          </div>
        </div>
      </footer>

      <dialog
        ref={dialog}
        className="modal"
        onCancel={() => setModal(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setModal(null);
        }}
        aria-labelledby="modal-title"
      >
        <button
          className="modal-close icon-button"
          onClick={() => setModal(null)}
          aria-label="Close dialog"
        >
          <Icon name="close" />
        </button>
        {modal &&
          (modal.type === "info" ? (
            <>
              <div className="modal-emblem">
                <Icon name="chart" size={27} />
              </div>
              <div className="eyebrow">EXECORDUSTRADE</div>
              <h2 id="modal-title">{modal.title}</h2>
              <p className="modal-body">{modal.body}</p>
              <button
                className="button full-width"
                onClick={() => setModal(null)}
              >
                Got it <Icon name="check" size={18} />
              </button>
            </>
          ) : complete ? (
            <div className="success-content">
              <div className="modal-emblem">
                <Icon name="check" size={30} />
              </div>
              <h2 id="modal-title">Your next perspective starts here.</h2>
              <p>
                You’ve previewed{" "}
                {modal.type === "trial"
                  ? `the ${selectedPlan} access flow`
                  : "the login flow"}
                . No account was created, payment collected, or personal
                information sent.
              </p>
              <button
                className="button full-width"
                onClick={() => {
                  setModal(null);
                  document.getElementById("features")?.scrollIntoView({
                    behavior: window.matchMedia(
                      "(prefers-reduced-motion: reduce)",
                    ).matches
                      ? "instant"
                      : "smooth",
                  });
                }}
              >
                Explore the workspace <Icon name="arrow" size={18} />
              </button>
            </div>
          ) : (
            <>
              <div className="modal-emblem">
                <span className="tiny-planet">≋</span>
              </div>
              <div className="eyebrow">PROFESSIONAL FUTURES TOOLS</div>
              <h2 id="modal-title">
                {modal.type === "trial"
                  ? `Explore ${selectedPlan}.`
                  : "Welcome back."}
              </h2>
              <p className="modal-body">
                {modal.type === "trial"
                  ? "Get a closer look at your order-flow workspace."
                  : "Continue to the ExecordusTrade platform preview."}
              </p>
              <form onSubmit={handleSubmit}>
                {modal.type === "trial" && (
                  <>
                    <label htmlFor="trial-plan">Your toolkit</label>
                    <select
                      className="account-input plan-select"
                      id="trial-plan"
                      value={selectedPlan}
                      onChange={(event) => setSelectedPlan(event.target.value)}
                    >
                      {plans.map((plan) => (
                        <option key={plan.name} value={plan.name}>
                          {plan.name}
                        </option>
                      ))}
                    </select>
                  </>
                )}
                <label htmlFor="account-email">Email address</label>
                <input
                  className="account-input"
                  id="account-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                />
                <p className="form-note">
                  Product preview. Your details are not sent, and no account or
                  subscription is created. Read the{" "}
                  <a href="/privacy/">privacy policy</a>.
                </p>
                <button className="button full-width" type="submit">
                  Continue to preview <Icon name="arrow" size={17} />
                </button>
              </form>
              <button
                className="switch-mode"
                onClick={() =>
                  setModal({
                    type: modal.type === "trial" ? "login" : "trial",
                    plan: "Full",
                  })
                }
              >
                {modal.type === "trial"
                  ? "Already have access? Log in"
                  : "New to ExecordusTrade? Try it"}
              </button>
            </>
          ))}
      </dialog>
    </div>
  );
}
export default App;
