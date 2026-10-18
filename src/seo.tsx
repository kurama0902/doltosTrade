import { site, pageDefinitions } from "./site";
import type { PagePath } from "./site";
export function SeoHead({
  path,
  notFound = false,
}: {
  path: PagePath;
  notFound?: boolean;
}) {
  const page = pageDefinitions[path];
  const title = notFound ? "Page Not Found | ExecordusTrade" : page.title;
  const description = notFound
    ? "Return to the ExecordusTrade futures and order-flow platform."
    : page.description;
  const origin = site.origin;
  const url = origin ? `${origin}${path}` : "";
  const indexable = Boolean(origin && site.indexable && !notFound);
  const organization = {
    "@type": "Organization",
    "@id": origin ? `${origin}/#organization` : "#organization",
    name: site.name,
    ...(origin
      ? {
          url: `${origin}/`,
          logo: { "@type": "ImageObject", url: `${origin}/brand-logo.svg` },
        }
      : {}),
    ...(site.operator ? { legalName: site.operator } : {}),
    ...(site.privacyEmail
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "privacy inquiries",
            email: site.privacyEmail,
          },
        }
      : {}),
  };
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      organization,
      {
        "@type": "WebSite",
        "@id": origin ? `${origin}/#website` : "#website",
        name: site.name,
        description: pageDefinitions["/"].description,
        inLanguage: "en",
        ...(origin ? { url: `${origin}/` } : {}),
        publisher: { "@id": organization["@id"] },
      },
      {
        "@type": "WebPage",
        name: title,
        description,
        inLanguage: "en",
        ...(url ? { "@id": `${url}#webpage`, url } : {}),
        isPartOf: { "@id": origin ? `${origin}/#website` : "#website" },
        ...(path === "/privacy/"
          ? {
              dateModified: site.policyUpdated,
              about: { "@id": organization["@id"] },
            }
          : {}),
      },
      ...(path === "/" || path === "/desktop/"
        ? [
            {
              "@type": "SoftwareApplication",
              name: site.name,
              applicationCategory: "FinanceApplication",
              description: pageDefinitions["/"].description,
              featureList: [
                "Footprint charts",
                "Volume & Delta Profile",
                "DeepDOM liquidity heatmap",
                "Order Flow Analyzer",
                "Deep Replay",
                "DeepGamma",
                "AI Assistant",
              ],
              publisher: { "@id": organization["@id"] },
              ...(origin ? { url: `${origin}/desktop/` } : {}),
              ...(site.desktopUrl ? { downloadUrl: site.desktopUrl } : {}),
            },
          ]
        : []),
      ...(path !== "/" && origin
        ? [
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: `${origin}/`,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: page.label,
                  item: url,
                },
              ],
            },
          ]
        : []),
    ],
  };
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="robots"
        content={
          indexable
            ? "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
            : "noindex, follow"
        }
      />
      <meta name="author" content={site.name} />
      <meta name="application-name" content={site.name} />
      <meta name="referrer" content="strict-origin-when-cross-origin" />
      <meta name="format-detection" content="telephone=no" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {origin && (
        <>
          {!notFound && <link rel="canonical" href={url} />}
          {!notFound && <meta property="og:url" content={url} />}
          <meta property="og:image" content={`${origin}/social-card.png`} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:type" content="image/png" />
          <meta
            property="og:image:alt"
            content="ExecordusTrade — Order flow, liquidity, and AI-assisted futures analysis"
          />
          <meta name="twitter:image" content={`${origin}/social-card.png`} />
          <meta
            name="twitter:image:alt"
            content="ExecordusTrade futures and order-flow trading platform"
          />
        </>
      )}
      {!notFound && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
          }}
        />
      )}
    </>
  );
}
