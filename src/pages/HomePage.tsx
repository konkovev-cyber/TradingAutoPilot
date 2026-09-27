import { useSeo } from "@/lib/seo";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import Compare from "@/components/Compare";
import Calculator from "@/components/Calculator";
import HowItWorks from "@/components/HowItWorks";
import FAQ from "@/components/FAQ";
import LeadForm from "@/components/LeadForm";
import CTA from "@/components/CTA";
import type { ComponentType } from "react";
import { useSections } from "@/lib/sections";
import { useI18n } from "@/lib/i18n";

const componentMap: Record<string, ComponentType> = {
  hero: Hero,
  products: Products,
  compare: Compare,
  calculator: Calculator,
  how: HowItWorks,
  faq: FAQ,
  lead: LeadForm,
  cta: CTA,
};

export default function HomePage() {
  const { t } = useI18n();
  const { sections } = useSections();

  useSeo({
    title: t("hero.title") + " \u2014 Coinsofter",
    description: t("hero.desc"),
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Coinsofter",
      "description": t("hero.desc")
    }
  });

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
