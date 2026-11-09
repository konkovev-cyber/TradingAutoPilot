import { useEffect } from "react";
import { useSeo } from "@/lib/seo";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import Hero from "@/components/Hero";
import Why from "@/components/Why";
import Products from "@/components/Products";
import Connect from "@/components/Connect";
import Calculator from "@/components/Calculator";
import FAQ from "@/components/FAQ";
import LeadForm from "@/components/LeadForm";
import CTA from "@/components/CTA";
import Advantages from "@/components/Advantages";
import Benefits from "@/components/Benefits";
import PricingNote from "@/components/PricingNote";
import Conclusion from "@/components/Conclusion";
import type { ComponentType } from "react";
import { useSections } from "@/lib/sections";
import { useContent } from "@/lib/site-content";
import { useI18n } from "@/lib/i18n";
import { recordPageView } from "@/lib/page-views";

const componentMap: Record<string, ComponentType> = {
  hero: Hero,
  products: Products,
  why: Why,
  connect: Connect,
  advantages: Advantages,
  benefits: Benefits,
  pricing: PricingNote,
  conclusion: Conclusion,
  questions: CTA,
  faq: FAQ,
  calculator: Calculator,
  lead: LeadForm,
};

export default function HomePage() {
  const { t, lang } = useI18n();
  const { sections } = useSections();
  const c = useContent();

  useSeo({
    title: c("meta", "title", lang === "en" ? "Trading bots for crypto and stock exchanges | TradingAutoPilot (no subscription)" : "Торговые боты для криптобирж и акций | TradingAutoPilot (без подписки)"),
    description: c("meta", "description", t("hero.desc")),
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "TradingAutoPilot",
      "description": c("meta", "description", t("hero.desc"))
    }
  });

  // Record page view counter
  useEffect(() => {
    recordPageView("/");
  }, []);

  return (
    <>
      <Header />
      <main>
        {sections
          .filter((s) => s.enabled)
          .map((s) => {
            const C = componentMap[s.key];
            return C ? <C key={s.key} /> : null;
          })}
      </main>
      <Footer />
      <FloatingContact />
    </>
  );
}
