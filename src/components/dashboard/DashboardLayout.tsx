import React from 'react';
import DashboardStats from './DashboardStats';
import QuickActions from './QuickActions';
import RecentActivity from './RecentActivity';
import GuestTable from './GuestTable';
import AccommodationList from './AccommodationList';

interface DashboardLayoutProps {
  campgroundName: string;
  onAddGuest: () => void;
  onAddAccommodation: () => void;
}

export default function DashboardLayout({ 
  campgroundName, 
  onAddGuest, 
  onAddAccommodation 
}: DashboardLayoutProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome to {campgroundName || 'your campground'} management dashboard
        </p>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <QuickActions 
            onAddGuest={onAddGuest}
            onAddAccommodation={onAddAccommodation}
          />
          <div className="mt-6 grid grid-cols-1 gap-6">
            <GuestTable />
            <AccommodationList />
          </div>
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}