import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Products from '@/components/Products';
import HowItWorks from '@/components/HowItWorks';
import Calculator from '@/components/Calculator';
import LiveTrades from '@/components/LiveTrades';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Products />
        <HowItWorks />
        <Calculator />
        <LiveTrades />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
