import { PageLayout } from "../components/PageLayout";
export default function NotFoundPage() {
  return (
    <PageLayout
      title="This page is out of range."
      eyebrow="404 · PAGE NOT FOUND"
      description="The page you requested could not be found. Return to the platform to explore order flow, liquidity, and futures tools."
      current="Page not found"
    >
      <a className="button not-found-link" href="/">
        Back to ExecordusTrade
      </a>
    </PageLayout>
  );
}
