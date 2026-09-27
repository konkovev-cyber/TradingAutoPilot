import { useSeo } from "@/lib/seo";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import Compare from "@/components/Compare";
import Calculator from "@/components/Calculator";
import HowItWorks from "@/components/HowItWorks";
import FAQ from "@/components/FAQ";
import LeadForm from "@/components/LeadForm";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import { useI18n } from "@/lib/i18n";

export default function HomePage() {
  const { t } = useI18n();
  
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
        <Hero />
        <Products />
        <Compare />
        <Calculator />
        <HowItWorks />
        <FAQ />
        <LeadForm />
        <CTA />
      </main>
      <Footer />
      <FloatingContact />
    </>
  );
}
