import React, { useState, useEffect } from 'react';
import { useStaffProfile } from '../../hooks/useStaffProfile';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Plus } from 'lucide-react';
import type { Guest } from '../../types/database';
import AddGuestModal from './AddGuestModal';

export default function GuestTable() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const { staffProfile } = useStaffProfile();

  useEffect(() => {
    loadGuests();
  }, [staffProfile?.campground_id]);

  async function loadGuests() {
    if (!staffProfile?.campground_id) return;
    
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .eq('campground_id', staffProfile.campground_id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setGuests(data || []);
    } catch (error) {
      console.error('Error loading guests:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Guests</CardTitle>
        <Button
          size="sm"
          onClick={() => setShowAddModal(true)}
          className="flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Guest
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {guests.map((guest) => (
                <tr key={guest.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {guest.full_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{guest.email}</div>
                    <div className="text-sm text-gray-500">{guest.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">{guest.notes}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
      {showAddModal && (
        <AddGuestModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            loadGuests();
          }}
        />
      )}
    </Card>
  );
}