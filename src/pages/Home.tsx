import React from 'react';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Testimonials } from '../components/Testimonials';
import { FAQ } from '../components/FAQ';
import { DownloadCTA } from '../components/DownloadCTA';

export const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <About />
      <Testimonials />
      <FAQ />
      <DownloadCTA />
    </>
  );
};
