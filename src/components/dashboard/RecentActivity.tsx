import React from 'react';
import { useStaffProfile } from '../../hooks/useStaffProfile';
import { supabase } from '../../lib/supabase';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { formatDateTime } from '../../utils/date';

interface Activity {
  id: string;
  type: 'booking' | 'guest' | 'accommodation';
  description: string;
  created_at: string;
}

export default function RecentActivity() {
  const [activities, setActivities] = React.useState<Activity[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { staffProfile } = useStaffProfile();

  React.useEffect(() => {
    loadActivity();
  }, [staffProfile?.campground_id]);

  async function loadActivity() {
    if (!staffProfile?.campground_id) return;

    try {
      const [bookings, guests] = await Promise.all([
        supabase
          .from('guest_bookings')
          .select('id, created_at, status')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('guests')
          .select('id, full_name, created_at')
          .eq('campground_id', staffProfile.campground_id)
          .order('created_at', { ascending: false })
          .limit(5)
      ]);

      const combinedActivities = [
        ...(bookings.data?.map(booking => ({
          id: booking.id,
          type: 'booking' as const,
          description: `New booking ${booking.status}`,
          created_at: booking.created_at
        })) || []),
        ...(guests.data?.map(guest => ({
          id: guest.id,
          type: 'guest' as const,
          description: `New guest added: ${guest.full_name}`,
          created_at: guest.created_at
        })) || [])
      ].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ).slice(0, 5);

      setActivities(combinedActivities);
    } catch (error) {
      console.error('Error loading activity:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading activity...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-900">{activity.description}</p>
                <p className="text-xs text-gray-500">
                  {formatDateTime(activity.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}