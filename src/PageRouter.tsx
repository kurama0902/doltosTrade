import App from "./App";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import DesktopPage from "./pages/DesktopPage";
import NotFoundPage from "./pages/NotFoundPage";
export function PageRouter({ path }: { path: string }) {
  if (/^\/privacy(?:\/|\/index\.html)?$/.test(path)) return <PrivacyPolicy />;
  if (/^\/desktop(?:\/|\/index\.html)?$/.test(path)) return <DesktopPage />;
  if (path === "/" || path === "/index.html") return <App />;
  return <NotFoundPage />;
}
