import { Suspense } from "react";
import type { Metadata } from "next";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/sections/hero";
import AboutSection from "@/components/sections/about";
import SermonsSection from "@/components/sections/sermons";
import EventsSection from "@/components/sections/events";
import ContactSection from "@/components/sections/contact";

export const metadata: Metadata = {
  title: "Home",
};

/**
 * Home page — the main landing page of the church website.
 *
 * Each section is wrapped in <Suspense> so that if a database-dependent
 * section (like Sermons or Events) is slow, the rest of the page still
 * loads and displays quickly while the data is being fetched.
 */
export default function HomePage() {
  return (
    <>
      <Header />

      <main id="main-content">
        {/* Hero banner */}
        <HeroSection />

        {/* About section */}
        <AboutSection />

        {/* Sermons — database-driven, wrapped in Suspense for streaming */}
        <Suspense
          fallback={
            <div className="bg-gray-50 py-20 text-center text-gray-500">
              Loading sermons…
            </div>
          }
        >
          <SermonsSection />
        </Suspense>

        {/* Events — database-driven, wrapped in Suspense */}
        <Suspense
          fallback={
            <div className="bg-white py-20 text-center text-gray-500">
              Loading events…
            </div>
          }
        >
          <EventsSection />
        </Suspense>

        {/* Contact section */}
        <ContactSection />
      </main>

      <Footer />
    </>
  );
}
