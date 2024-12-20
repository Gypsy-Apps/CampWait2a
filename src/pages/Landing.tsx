import React from 'react';
import { Link } from 'react-router-dom';
import { Tent, Compass, Users, Calendar } from 'lucide-react';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import Testimonials from '../components/landing/Testimonials';
import CallToAction from '../components/landing/CallToAction';

export default function Landing() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <Testimonials />
      <CallToAction />
    </div>
  );
}