import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useStaffProfile } from '../hooks/useStaffProfile';
import { supabase } from '../lib/supabase';
import type { WaitlistEntry } from '../types/database';
import { formatPhoneNumber } from '../utils/format';

export default function Waitlist() {
  const [entries, setEntries] = React.useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { staffProfile } = useStaffProfile();

  React.useEffect(() => {
    async function loadWaitlist() {
      if (!staffProfile?.campground_id) return;
      
      try {
        const { data, error } = await supabase
          .from('waitlist')
          .select('*')
          .eq('campground_id', staffProfile.campground_id)
          .eq('status', 'Active')
          .order('created_at');
          
        if (error) throw error;
        setEntries(data || []);
      } catch (error) {
        console.error('Error loading waitlist:', error);
      } finally {
        setLoading(false);
      }
    }

    loadWaitlist();
  }, [staffProfile?.campground_id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Waitlist</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage guest waitlist requests
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {entries.map((entry) => (
          <Card key={entry.id}>
            <CardHeader>
              <CardTitle>{entry.guest_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="mt-1">
                    <Badge 
                      variant={
                        entry.status === 'Active' ? 'info' : 
                        entry.status === 'Fulfilled' ? 'success' : 
                        'error'
                      }
                    >
                      {entry.status}
                    </Badge>
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Contact</p>
                  <p className="mt-1 text-sm text-gray-900">{entry.guest_email}</p>
                  <p className="text-sm text-gray-900">{formatPhoneNumber(entry.guest_phone)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Preferred Site Type</p>
                  <p className="mt-1 text-sm text-gray-900">{entry.site_type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Preferred Dates</p>
                  <p className="mt-1 text-sm text-gray-900">{entry.preferred_dates}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}