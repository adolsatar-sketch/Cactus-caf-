import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/roboto/latin-400.css";
import "@fontsource/roboto/latin-500.css";
import "@fontsource/almarai/arabic-400.css";
import "@fontsource/almarai/arabic-700.css";
import "@fontsource/almarai/arabic-800.css";
import "@fontsource/noto-sans-arabic/arabic-400.css";
import "@fontsource/noto-sans-arabic/arabic-500.css";
import "@fontsource/noto-sans-arabic/arabic-700.css";
import "@fontsource/lobster/latin-400.css";
import "./styles/base.css";
import "./styles/intro.css";
import "./styles/hero.css";
import "./styles/menu.css";
import "./styles/fx.css";
import App from "./App";
import { I18nProvider } from "./i18n";
import { registerBluestar } from "./lib/fonts";
import { categoryIds } from "./lib/menu";
import { initPerfFlags } from "./lib/perf";
import { parseRoute } from "./lib/route";
import { KEYS, store } from "./lib/storage";
import { isLang } from "./data/ui";

registerBluestar();
initPerfFlags();

// Which language? URL wins (QR codes can point straight at /ar, /ku, /en), then the saved choice.
const route = parseRoute(location.pathname, categoryIds, location.hash);
const saved = store.get(KEYS.lang);
const initial = route.lang ?? (isLang(saved) ? saved : null);
const needIntro = initial === null;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <I18nProvider initial={initial ?? "en"}>
      <App needIntro={needIntro} initialCategory={route.category} />
    </I18nProvider>
  </StrictMode>,
);

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}));
}
