import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Products from '@/components/Products';
import HowItWorks from '@/components/HowItWorks';
import FAQ from '@/components/FAQ';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import FloatingContact from '@/components/FloatingContact';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Products />
        <HowItWorks />
        <FAQ />
        <CTA />
      </main>
      <Footer />
      <FloatingContact />
    </>
  );
}
