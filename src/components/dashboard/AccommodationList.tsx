import React, { useState, useEffect } from 'react';
import { useStaffProfile } from '../../hooks/useStaffProfile';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Plus } from 'lucide-react';
import type { Accommodation } from '../../types/database';
import AddAccommodationModal from './AddAccommodationModal';
import { formatCurrency } from '../../utils/format';

export default function AccommodationList() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const { staffProfile } = useStaffProfile();

  useEffect(() => {
    loadAccommodations();
  }, [staffProfile?.campground_id]);

  async function loadAccommodations() {
    if (!staffProfile?.campground_id) return;
    
    try {
      const { data, error } = await supabase
        .from('accommodations')
        .select('*')
        .eq('campground_id', staffProfile.campground_id)
        .order('name');
        
      if (error) throw error;
      setAccommodations(data || []);
    } catch (error) {
      console.error('Error loading accommodations:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Accommodations</CardTitle>
        <Button
          size="sm"
          onClick={() => setShowAddModal(true)}
          className="flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Accommodation
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {accommodations.map((accommodation) => (
            <div
              key={accommodation.id}
              className="border rounded-lg p-4 space-y-2"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{accommodation.name}</h3>
                  <Badge variant="info">{accommodation.type}</Badge>
                </div>
                {accommodation.image_url && (
                  <img
                    src={accommodation.image_url}
                    alt={accommodation.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}
              </div>
              <p className="text-sm text-gray-600">{accommodation.description}</p>
              <div className="flex gap-4 text-sm">
                <span>Rooms: {accommodation.room_count || 'N/A'}</span>
                <span>Capacity: {accommodation.capacity} people</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      {showAddModal && (
        <AddAccommodationModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            loadAccommodations();
          }}
        />
      )}
    </Card>
  );
}