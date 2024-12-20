import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useStaffProfile } from '../hooks/useStaffProfile';
import { supabase } from '../lib/supabase';
import type { Site } from '../types/database';
import { formatCurrency } from '../utils/format';

export default function Sites() {
  const [sites, setSites] = React.useState<Site[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { staffProfile } = useStaffProfile();

  React.useEffect(() => {
    async function loadSites() {
      if (!staffProfile?.campground_id) return;
      
      try {
        const { data, error } = await supabase
          .from('sites')
          .select('*')
          .eq('campground_id', staffProfile.campground_id)
          .order('name');
          
        if (error) throw error;
        setSites(data || []);
      } catch (error) {
        console.error('Error loading sites:', error);
      } finally {
        setLoading(false);
      }
    }

    loadSites();
  }, [staffProfile?.campground_id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Campground Sites</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage and view all available camping sites
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sites.map((site) => (
          <Card key={site.id}>
            <CardHeader>
              <CardTitle>{site.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Type</p>
                  <p className="mt-1">
                    <Badge variant="info">{site.type}</Badge>
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="mt-1">
                    <Badge 
                      variant={
                        site.status === 'Available' ? 'success' : 
                        site.status === 'Occupied' ? 'warning' : 
                        'error'
                      }
                    >
                      {site.status}
                    </Badge>
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Capacity</p>
                  <p className="mt-1 text-sm text-gray-900">{site.capacity} people</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Price per night</p>
                  <p className="mt-1 text-sm text-gray-900">{formatCurrency(site.price_per_night)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}