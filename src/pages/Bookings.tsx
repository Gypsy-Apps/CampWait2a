import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useStaffProfile } from '../hooks/useStaffProfile';
import { supabase } from '../lib/supabase';
import type { Booking } from '../types/database';
import { formatDate } from '../utils/date';
import { formatPhoneNumber } from '../utils/format';

export default function Bookings() {
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { staffProfile } = useStaffProfile();

  React.useEffect(() => {
    async function loadBookings() {
      if (!staffProfile?.campground_id) return;
      
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            sites!inner (
              name,
              campground_id
            )
          `)
          .eq('sites.campground_id', staffProfile.campground_id)
          .order('check_in');
          
        if (error) throw error;
        setBookings(data || []);
      } catch (error) {
        console.error('Error loading bookings:', error);
      } finally {
        setLoading(false);
      }
    }

    loadBookings();
  }, [staffProfile?.campground_id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage guest bookings and reservations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bookings.map((booking) => (
          <Card key={booking.id}>
            <CardHeader>
              <CardTitle>{booking.guest_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="mt-1">
                    <Badge 
                      variant={
                        booking.status === 'Confirmed' ? 'success' : 
                        booking.status === 'Cancelled' ? 'error' : 
                        'info'
                      }
                    >
                      {booking.status}
                    </Badge>
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Contact</p>
                  <p className="mt-1 text-sm text-gray-900">{booking.guest_email}</p>
                  <p className="text-sm text-gray-900">{formatPhoneNumber(booking.guest_phone)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Dates</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatDate(booking.check_in)} - {formatDate(booking.check_out)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}