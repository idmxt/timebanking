import React from 'react';
import HeroSection from './Landing/HeroSection';
import ProblemSection from './Landing/ProblemSection';
import SolutionSection from './Landing/SolutionSection';
import FeaturesSection from './Landing/FeaturesSection';
import HowItWorksSection from './Landing/HowItWorksSection';
import BenefitsSection from './Landing/BenefitsSection';
import StatsSection from './Landing/StatsSection';
import TestimonialsSection from './Landing/TestimonialsSection';
import CTASection from './Landing/CTASection';
import Footer from './Landing/Footer';
import Navbar from './Landing/Navbar';

const Landing = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <div id="features">
        <FeaturesSection />
      </div>
      <div id="how-it-works">
        <HowItWorksSection />
      </div>
      <div id="benefits">
        <BenefitsSection />
      </div>
      <StatsSection />
      <div id="testimonials">
        <TestimonialsSection />
      </div>
      <CTASection />
      <Footer />
    </div>
  );
};

export default Landing;
