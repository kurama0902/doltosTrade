import { PageLayout } from "../components/PageLayout";
import { Icon } from "../components/Icons";
import { site } from "../site";
const sections = [
  ["scope", "Scope of this policy"],
  ["operator", "Who is responsible"],
  ["information", "Information handled by this website"],
  ["purposes", "Purposes and legal grounds"],
  ["forms", "Forms and account previews"],
  ["ai", "AI and trading information"],
  ["cookies", "Cookies and browser storage"],
  ["providers", "Hosting and service providers"],
  ["links", "External links and desktop software"],
  ["sharing", "Disclosure and transfers"],
  ["retention", "Retention and deletion"],
  ["security", "Security"],
  ["rights", "Your privacy rights"],
  ["children", "Children and eligibility"],
  ["choices", "Your controls and choices"],
  ["changes", "Changes to this policy"],
  ["contact", "Contact and requests"],
];
export default function PrivacyPolicy() {
  return (
    <PageLayout
      title="Privacy policy."
      eyebrow="YOUR INFORMATION. A CLEARER PICTURE."
      description="What this website handles, what stays in your browser, and the choices available to you."
      current="Privacy policy"
    >
      <div className="policy-meta">
        <span>
          <Icon name="shield" size={15} /> Website privacy notice
        </span>
        <span>
          Last updated{" "}
          <time dateTime={site.policyUpdated}>October 18, 2026</time>
        </span>
      </div>
      <div className="policy-summary">
        <h2>Privacy at a glance</h2>
        <ul>
          <li>
            The demonstration forms do not send your email address or create an
            account.
          </li>
          <li>
            Charts use simulated data; the AI examples are prewritten and do not
            connect to a live model.
          </li>
          <li>
            The website code does not install analytics or advertising trackers.
          </li>
          <li>
            Your browser still makes technical requests to the website’s hosting
            service.
          </li>
        </ul>
        <p>
          This notice covers the current website preview. A desktop application,
          live trading service, or future account system may have different data
          practices and must provide its own applicable notice.
        </p>
      </div>
      <div className="policy-layout">
        <aside className="policy-toc">
          <nav aria-label="Privacy policy contents">
            <span>IN THIS POLICY</span>
            <ol>
              {sections.map(([id, label]) => (
                <li key={id}>
                  <a href={`#${id}`}>{label}</a>
                </li>
              ))}
            </ol>
          </nav>
          <a className="policy-back" href="/">
            ← Back to ExecordusTrade
          </a>
        </aside>
        <article className="policy-article">
          <section id="scope">
            <span className="policy-section-number">01 /</span>
            <h2>Scope of this policy</h2>
            <p>
              This policy explains how information is handled when you browse
              the ExecordusTrade website, interact with its charts and replay
              tools, select a plan, open its demonstration forms, or follow a
              link to desktop access. “Website” means these public pages and the
              interactive browser preview.
            </p>
            <p>
              The site currently presents a futures and order-flow product
              demonstration. It does not execute trades, maintain a user-account
              database, process subscriptions, connect to your broker, or
              provide a live AI conversation. This policy does not describe the
              independent practices of brokers, market-data providers, community
              services, or desktop software that you may choose to use
              separately.
            </p>
          </section>
          <section id="operator">
            <span className="policy-section-number">02 /</span>
            <h2>Who is responsible</h2>
            <p>
              ExecordusTrade is the name of the product and website. The legal
              person responsible for a deployed website is its operator, rather
              than the product name alone.
            </p>
            <dl className="policy-details">
              <div>
                <dt>Legal operator</dt>
                <dd>
                  {site.operator ||
                    "Legal operator details have not yet been published for this preview."}
                </dd>
              </div>
              {site.legalAddress && (
                <div>
                  <dt>Business address</dt>
                  <dd>{site.legalAddress}</dd>
                </div>
              )}
              <div>
                <dt>Privacy contact</dt>
                <dd>
                  {site.privacyEmail ? (
                    <a href={`mailto:${site.privacyEmail}`}>
                      {site.privacyEmail}
                    </a>
                  ) : (
                    "A dedicated privacy contact has not yet been published."
                  )}
                </dd>
              </div>
            </dl>
            <p>
              Where data-protection law applies, the controller’s identity and
              contact details must be made available with the relevant
              collection notice. Operator and hosting details should be
              confirmed before enabling services that collect personal
              information.
            </p>
          </section>
          <section id="information">
            <span className="policy-section-number">03 /</span>
            <h2>Information handled by this website</h2>
            <div className="policy-table-scroll">
              <table className="policy-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Examples</th>
                    <th>Current handling</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Technical request information</td>
                    <td>
                      IP address, requested URL, request time, browser headers,
                      and connection information
                    </td>
                    <td>
                      Sent to the hosting infrastructure as part of loading
                      pages and assets. Hosting logs depend on the deployment.
                    </td>
                  </tr>
                  <tr>
                    <td>Demonstration form input</td>
                    <td>
                      An email address typed into a trial or login preview
                    </td>
                    <td>
                      Handled in your browser only. No form endpoint, account
                      creation, or email delivery is implemented.
                    </td>
                  </tr>
                  <tr>
                    <td>Interactive selections</td>
                    <td>
                      Contract, timeframe, replay position, plan selection,
                      chart filters, and AI-example selection
                    </td>
                    <td>
                      Used in page memory to display the preview. The
                      application does not send interaction events to an
                      analytics service.
                    </td>
                  </tr>
                  <tr>
                    <td>Privacy correspondence</td>
                    <td>
                      Information you choose to send to a published privacy
                      contact
                    </td>
                    <td>
                      If you contact an operator independently, the recipient
                      handles that correspondence under the applicable contact
                      notice and law.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              The preview does not request payment-card information, identity
              documents, broker credentials, account balances, real trading
              history, or sensitive personal information. Please do not place
              such information in any demonstration field.
            </p>
          </section>
          <section id="purposes">
            <span className="policy-section-number">04 /</span>
            <h2>Purposes and legal grounds</h2>
            <p>
              Technical requests are necessary to deliver the pages and assets
              you request. Your browser-side selections are used to show the
              chart, replay, plan, or example response you choose. They are not
              used by this application to create a marketing profile.
            </p>
            <p>
              Where the GDPR or a comparable law applies to an operator’s
              processing, that operator must identify an appropriate legal basis
              for each purpose. Necessary website delivery and proportionate
              security logging may rely on legitimate interests in operating and
              protecting the site, subject to the required balancing assessment.
              Processing required by a legal obligation must rely on the
              relevant obligation. Optional tracking, if introduced, must use
              consent where required.
            </p>
            <p>
              No account contract, marketing subscription, or consent to
              advertising is created by completing a preview form. If a live
              service is enabled later, its purposes, legal grounds, and
              collection notices must be explained before personal information
              is collected for that service.
            </p>
          </section>
          <section id="forms">
            <span className="policy-section-number">05 /</span>
            <h2>Forms and account previews</h2>
            <p>
              The current trial and login dialogs use browser validation and
              update the page to demonstrate a flow. Clicking “Continue to
              preview” does not transmit the entered address, create an account,
              subscribe you to communications, or collect a payment.
            </p>
            <p>
              Form controls may retain their values while their dialog remains
              mounted. Closing a dialog removes its form controls; refreshing or
              leaving the page clears this application’s in-memory state. Your
              browser or password manager may independently offer to remember or
              autofill a value according to your own settings. This website does
              not control that separate browser feature.
            </p>
            <p>
              If a future version connects a form to a backend, this policy and
              the notice shown at collection must be updated to identify the
              actual recipients, purpose, retention period, and relevant rights.
            </p>
          </section>
          <section id="ai">
            <span className="policy-section-number">06 /</span>
            <h2>AI and trading information</h2>
            <p>
              The AI Assistant section on this website displays curated example
              questions and prewritten responses. It does not send a prompt to
              an external model, record a conversation on a server, or use your
              interactions to train an AI model.
            </p>
            <p>
              The charts, footprint clusters, order book, profiles, and market
              replay are generated from deterministic simulated data. Changing a
              futures contract or chart setting does not access your brokerage
              account, retrieve your trading history, or place an order.
            </p>
            <p>
              The website does not make decisions with legal or similarly
              significant effects about you through automated processing. A
              future live AI or brokerage integration must separately disclose
              what data is transmitted, who receives it, any model-training use,
              retention, and the controls available to users.
            </p>
          </section>
          <section id="cookies">
            <span className="policy-section-number">07 /</span>
            <h2>Cookies and browser storage</h2>
            <p>
              The current website application does not set cookies, write
              interaction data to localStorage or sessionStorage, or install
              analytics pixels, advertising tags, session-recording tools, or
              cross-site tracking scripts. Fonts, icons, and presentation assets
              are served with the website.
            </p>
            <p>
              Your browser may cache downloaded files as part of ordinary
              browsing. A hosting or security provider may also apply
              infrastructure-level controls; the deployed operator must disclose
              any provider-specific cookies or storage that it enables. This
              policy does not assume that an unidentified host uses no logs or
              cookies.
            </p>
            <p>
              No optional tracking consent is requested by the current
              application because it does not implement optional tracking. If
              optional cookies or similar technologies are introduced, the
              notice and controls must be updated, including consent and
              withdrawal options where required.
            </p>
          </section>
          <section id="providers">
            <span className="policy-section-number">08 /</span>
            <h2>Hosting and service providers</h2>
            <p>
              A website host, content-delivery service, domain provider, or
              security service may process technical requests to deliver and
              protect a deployed website. Such providers may receive network
              identifiers and request information even when the application has
              no analytics integration.
            </p>
            <p>
              No specific production hosting provider, processing location, or
              log-retention schedule has been supplied for this preview. These
              details must be documented for the actual deployment. The browser
              preview does not currently call an email provider, payment
              processor, broker API, market-data API, or AI API.
            </p>
            <p>
              The names Rithmic, CQG, and dxFeed describe the platform’s
              presented connectivity. Merely viewing these names on the website
              does not connect your browser to those providers.
            </p>
          </section>
          <section id="links">
            <span className="policy-section-number">09 /</span>
            <h2>External links and desktop software</h2>
            <p>
              A desktop-access button may lead to an external official app
              destination when a release or application URL is configured.
              Following that link sends a request to the destination website or
              service, which may receive your IP address, browser information,
              and other data under its own policy.
            </p>
            <p>
              The current external desktop button opens a new tab with referrer
              suppression. Other links, such as references to privacy
              regulators, may be handled according to the browser’s and
              website’s referrer settings. Review the policy of any destination
              before entering personal information or downloading software.
            </p>
            <p>
              This website’s notice does not establish the privacy practices of
              the desktop application. Before installing or signing in to
              desktop software, review its applicable privacy notice,
              permissions, account requirements, and data-feed or broker
              disclosures. No desktop application is installed or launched
              simply by browsing this website.
            </p>
          </section>
          <section id="sharing">
            <span className="policy-section-number">10 /</span>
            <h2>Disclosure and international transfers</h2>
            <p>
              The current preview application does not sell personal
              information, send browsing events for targeted advertising, or
              share form entries with an account, marketing, payment, or AI
              service. Technical delivery still involves the hosting
              infrastructure described above.
            </p>
            <p>
              A deployed operator may need to disclose information to service
              providers acting on documented instructions, to comply with a
              lawful obligation, or to establish or defend legal claims. Any
              such processing must have an applicable legal basis and
              appropriate limits.
            </p>
            <p>
              The actual hosting and service locations determine whether
              cross-border transfers occur. Where applicable law requires
              safeguards, such as an adequacy decision or appropriate
              contractual protections, the responsible operator must identify
              and apply those safeguards. No specific transfer mechanism is
              claimed for an unconfigured deployment.
            </p>
          </section>
          <section id="retention">
            <span className="policy-section-number">11 /</span>
            <h2>Retention and deletion</h2>
            <p>
              Interactive chart selections, example choices, and demonstration
              form entries are not stored in an application database. Their
              browser-side lifecycle is described above. Cached assets and
              browser autofill are managed through your browser’s settings.
            </p>
            <p>
              Hosting logs, security records, and any independently sent privacy
              correspondence may have different retention requirements. An
              actual operator should keep identifiable information only for as
              long as reasonably necessary for the stated purpose, a relevant
              legal obligation, or a proportionate legal-claims period.
            </p>
            <p>
              No fixed hosting-log retention period is stated because no
              production host or log configuration has been identified. Those
              periods, or meaningful criteria for determining them, must be
              disclosed for the deployed service rather than invented for this
              preview.
            </p>
          </section>
          <section id="security">
            <span className="policy-section-number">12 /</span>
            <h2>Security</h2>
            <p>
              The preview limits application-side collection by avoiding live
              forms, account storage, broker credentials, and AI requests.
              External desktop destinations configured through the site settings
              must use HTTPS. Transport security for this website itself depends
              on how it is deployed and should use HTTPS in production.
            </p>
            <p>
              No website or transmission method can guarantee absolute security.
              Do not submit passwords, payment details, identity documents, or
              private trading credentials through the preview. If you believe
              you have disclosed sensitive information, contact the responsible
              service or operator through a verified channel.
            </p>
          </section>
          <section id="rights">
            <span className="policy-section-number">13 /</span>
            <h2>Your privacy rights</h2>
            <p>
              Depending on where you live, the law that applies, and the
              information an operator actually holds, you may have rights to
              request access, correction, erasure, restriction, portability, or
              objection to certain processing. Where processing relies on
              consent, you may withdraw it without changing the lawfulness of
              processing already carried out.
            </p>
            <p>
              These rights are subject to applicable conditions and exceptions.
              They do not require a website to create or retain identifying
              information solely to identify a visitor who otherwise remains
              unidentifiable. An operator may need proportionate information to
              verify a request, but should not ask for more than is necessary.
            </p>
            <p>
              Under the GDPR, applicable requests generally receive a response
              within one month, with extensions permitted in specified
              circumstances. Other jurisdictions may set different periods. You
              may also have a right to complain to the relevant supervisory
              authority, including where you live or work. The{" "}
              <a
                href="https://www.edpb.europa.eu/about-edpb/about-edpb/members_en"
                target="_blank"
                rel="noopener noreferrer"
              >
                EDPB directory of supervisory authorities
              </a>{" "}
              can help EU/EEA visitors identify a regulator.
            </p>
            <p>
              Where US state privacy laws apply, additional rights may include
              information about disclosures, correction, deletion, portability,
              appeal, and opting out of sale, targeted advertising, or specified
              profiling. The current application does not implement those
              advertising or sale activities. Exercising an applicable privacy
              right should not result in unlawful discrimination.
            </p>
          </section>
          <section id="children">
            <span className="policy-section-number">14 /</span>
            <h2>Children and eligibility</h2>
            <p>
              The website presents professional futures-trading software and is
              not directed to children. Its demonstration forms do not require
              age information or establish eligibility for a real trading
              service.
            </p>
            <p>
              Do not submit a child’s personal information through the preview.
              If a deployed operator learns that it has received children’s
              information in circumstances requiring deletion or parental
              authorization, it should assess and address that information under
              the applicable law. The age and eligibility requirements for any
              future account or trading service must be stated in that service’s
              terms.
            </p>
          </section>
          <section id="choices">
            <span className="policy-section-number">15 /</span>
            <h2>Your controls and choices</h2>
            <ul>
              <li>
                Explore the charts, replay, plans, and educational material
                without entering an email address.
              </li>
              <li>
                Close demonstration dialogs, refresh the page, or leave the
                website to clear its temporary application state.
              </li>
              <li>
                Manage cached files and autofill independently through your
                browser settings.
              </li>
              <li>
                Review an external destination’s policy before signing in,
                downloading an app, or submitting information.
              </li>
              <li>
                Use any applicable privacy rights with the responsible operator
                or hosting service.
              </li>
            </ul>
            <p>
              The current application has no targeted-advertising processing to
              switch off. A future version that introduces optional tracking or
              activities covered by a legally recognized opt-out signal must
              provide the controls and signal handling required by the
              applicable law.
            </p>
          </section>
          <section id="changes">
            <span className="policy-section-number">16 /</span>
            <h2>Changes to this policy</h2>
            <p>
              The “Last updated” date identifies the version of this notice. It
              should be reviewed when the operator, host, data practices, forms,
              AI features, desktop destination, or legal requirements change.
            </p>
            <p>
              New processing purposes should not be introduced silently. Where
              required, an operator must give a clear updated notice or obtain
              consent before beginning a materially different use of personal
              information. You can return to this page through the privacy link
              in the website footer.
            </p>
          </section>
          <section id="contact">
            <span className="policy-section-number">17 /</span>
            <h2>Contact and privacy requests</h2>
            {site.privacyEmail ? (
              <p>
                For privacy questions or an applicable rights request, email{" "}
                <a href={`mailto:${site.privacyEmail}`}>{site.privacyEmail}</a>
                {site.operator
                  ? `, the privacy contact for ${site.operator}`
                  : ""}
                . Describe the website interaction and the information involved.
                Avoid including identity documents, payment details, or broker
                credentials unless a verified and proportionate process
                specifically requires them.
              </p>
            ) : (
              <p>
                A dedicated privacy contact and legal operator identity have not
                yet been published for this preview. Do not send sensitive
                information through its demonstration forms. For a concern about
                technical hosting records, use the verified contact details of
                the party operating the deployed website or its identified
                hosting provider.
              </p>
            )}
            <p>
              For further information about EU data-protection rights and
              transparency obligations, consult the{" "}
              <a
                href="https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng"
                target="_blank"
                rel="noopener noreferrer"
              >
                official GDPR text
              </a>
              . The applicable law and the actual processing determine which
              rights and obligations apply; this notice does not assert a
              blanket compliance certification.
            </p>
          </section>
        </article>
      </div>
    </PageLayout>
  );
}
