import React from 'react';
import { Tent, Compass, Users, Calendar } from 'lucide-react';

const features = [
  {
    name: 'Site Management',
    description: 'Easily manage all your camping sites, their availability, and maintenance schedules.',
    icon: Tent,
  },
  {
    name: 'Booking System',
    description: 'Handle reservations efficiently with our intuitive booking management system.',
    icon: Calendar,
  },
  {
    name: 'Guest Management',
    description: 'Keep track of guest information and preferences for a personalized experience.',
    icon: Users,
  },
  {
    name: 'Location Tracking',
    description: 'Monitor and manage multiple campground locations from a single dashboard.',
    icon: Compass,
  },
];

export default function Features() {
  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to manage your campground
          </p>
        </div>

        <div className="mt-10">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                <p className="mt-2 ml-16 text-base text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}