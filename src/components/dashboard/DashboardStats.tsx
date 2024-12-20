import React, { useState, useEffect } from 'react';
import { useStaffProfile } from '../../hooks/useStaffProfile';
import { supabase } from '../../lib/supabase';
import { Card, CardContent } from '../ui/Card';
import { Users, Tent, Calendar, ClipboardList } from 'lucide-react';

interface StatsData {
  totalGuests: number;
  totalAccommodations: number;
  activeBookings: number;
  waitlistCount: number;
}

export default function DashboardStats() {
  const [stats, setStats] = useState<StatsData>({
    totalGuests: 0,
    totalAccommodations: 0,
    activeBookings: 0,
    waitlistCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const { staffProfile } = useStaffProfile();

  useEffect(() => {
    loadStats();
  }, [staffProfile?.campground_id]);

  async function loadStats() {
    if (!staffProfile?.campground_id) return;

    try {
      const [
        { count: guestsCount },
        { count: accommodationsCount },
        { count: bookingsCount },
        { count: waitlistCount },
      ] = await Promise.all([
        supabase
          .from('guests')
          .select('*', { count: 'exact', head: true })
          .eq('campground_id', staffProfile.campground_id),
        supabase
          .from('accommodations')
          .select('*', { count: 'exact', head: true })
          .eq('campground_id', staffProfile.campground_id),
        supabase
          .from('guest_bookings')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'Confirmed'),
        supabase
          .from('waitlist')
          .select('*', { count: 'exact', head: true })
          .eq('campground_id', staffProfile.campground_id)
          .eq('status', 'Active'),
      ]);

      setStats({
        totalGuests: guestsCount || 0,
        totalAccommodations: accommodationsCount || 0,
        activeBookings: bookingsCount || 0,
        waitlistCount: waitlistCount || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading stats...</div>;

  const stats_items = [
    {
      title: 'Total Guests',
      value: stats.totalGuests,
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Accommodations',
      value: stats.totalAccommodations,
      icon: Tent,
      color: 'text-green-600',
    },
    {
      title: 'Active Bookings',
      value: stats.activeBookings,
      icon: Calendar,
      color: 'text-purple-600',
    },
    {
      title: 'Waitlist',
      value: stats.waitlistCount,
      icon: ClipboardList,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats_items.map((item, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${item.color} bg-opacity-10`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{item.title}</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {item.value}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}