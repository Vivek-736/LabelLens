import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Footer />
    </main>
  );
}