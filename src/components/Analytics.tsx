import { useEffect } from "react";
import { useContent } from "@/lib/site-content";

declare global {
  interface Window {
    dataLayer?: any[];
    ym?: (...args: any[]) => void;
  }
}

export default function Analytics() {
  const c = useContent();
  const ymId = c("meta", "yandex_metrika_id", "");
  const gaId = c("meta", "google_analytics_id", "");

  // Yandex.Metrika Loader
  useEffect(() => {
    const id = String(ymId || "").trim();
    if (!id || !/^\d+$/.test(id)) return;
    if (document.getElementById(`ym-script-${id}`)) return;

    try {
      (function (m: any, e: any, t: any, r: any, i: any, k?: any, a?: any) {
        m[i] =
          m[i] ||
          function () {
            (m[i].a = m[i].a || []).push(arguments);
          };
        m[i].l = 1 * Number(new Date());
        for (let j = 0; j < document.scripts.length; j++) {
          if (document.scripts[j].src === r) {
            return;
          }
        }
        k = e.createElement(t);
        a = e.getElementsByTagName(t)[0];
        k.async = 1;
        k.id = `ym-script-${id}`;
        k.src = r;
        a?.parentNode?.insertBefore(k, a);
      })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

      window.ym?.(parseInt(id, 10), "init", {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true,
      });
    } catch (e) {
      console.warn("[Analytics] Yandex.Metrika init error:", e);
    }
  }, [ymId]);

  // Google Analytics 4 Loader
  useEffect(() => {
    const id = String(gaId || "").trim();
    if (!id || !/^G-[A-Z0-9]+$/i.test(id)) return;
    if (document.getElementById(`ga-script-${id}`)) return;

    try {
      const script = document.createElement("script");
      script.async = true;
      script.id = `ga-script-${id}`;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer?.push(args);
      }
      gtag("js", new Date());
      gtag("config", id);
    } catch (e) {
      console.warn("[Analytics] GA4 init error:", e);
    }
  }, [gaId]);

  return null;
}
