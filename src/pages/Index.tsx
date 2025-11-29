
import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import SEO from '@/components/SEO';
import Hero from "../components/Hero";
import WorkerCategories from "../components/WorkerCategories";
import ServiceCategories from "../components/ServiceCategories";
import HowItWorks from "../components/HowItWorks";
import FeaturedProfessionals from "../components/FeaturedProfessionals";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";
import HeroForm from "@/components/HeroForm";
import FAQ from "../components/FAQ";
import Bmodel from "@/components/Bmodel";
import VideoTestimonials from "@/components/VideoTestimonials";
import Solutions from "@/components/Solutions";
import OfferRibbon from "@/components/OfferRibbon";
import PopupWhatsApp from "@/components/PopupWhatsApp";
// import { Banner } from "@/components/Banner";

const Index: React.FC = () => {
  // Smooth scroll functionality
  useEffect(() => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId && targetId !== "#") {
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            const navbarHeight = 80; // Approximate navbar height
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    });

    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', function (e) { });
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      
      <Navbar />
      <SEO title="Hire Verified Construction Labour Near You" description="Find and hire verified masons, carpenters, electricians and helpers in Jammu and Delhi. Trusted professionals for construction and repair work." keywords="hire construction workers, masons near me, carpenters near me, GoBuild" url="https://www.gobuild.in/" />
      <Hero />
      {/* <Banner/> */}
      <Bmodel />
      <OfferRibbon />
      <HeroForm />
      <Solutions />
      <WorkerCategories />
      {/* <ServiceCategories /> */}
      <HowItWorks />
      <Testimonials />
      <VideoTestimonials />
      <FAQ />
      {/* <FeaturedProfessionals /> */}
      <PopupWhatsApp/>
      <Footer />
    </div>
  );
};

export default Index;
