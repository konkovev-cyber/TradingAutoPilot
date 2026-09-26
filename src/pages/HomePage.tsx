import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProblemSolution from '@/components/ProblemSolution';
import HowItWorks from '@/components/HowItWorks';
import Products from '@/components/Products';
import Calculator from '@/components/Calculator';
import Advantages from '@/components/Advantages';
import Stats from '@/components/Stats';
import LiveTrades from '@/components/LiveTrades';
import Testimonials from '@/components/Testimonials';
import Pricing from '@/components/Pricing';
import FAQ from '@/components/FAQ';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ProblemSolution />
        <HowItWorks />
        <Products />
        <Calculator />
        <Advantages />
        <Stats />
        <LiveTrades />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
