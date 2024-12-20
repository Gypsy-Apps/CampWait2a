import React, { useState } from 'react';
import { useStaffProfile } from '../hooks/useStaffProfile';
import { useCampground } from '../hooks/useCampground';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import AddGuestModal from '../components/dashboard/AddGuestModal';
import AddAccommodationModal from '../components/dashboard/AddAccommodationModal';

export default function Dashboard() {
  const { staffProfile, loading: staffLoading } = useStaffProfile();
  const { campground, loading: campgroundLoading } = useCampground(
    staffProfile?.campground_id || ''
  );
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);
  const [showAddAccommodationModal, setShowAddAccommodationModal] = useState(false);

  if (staffLoading || campgroundLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <DashboardLayout
        campgroundName={campground?.name || ''}
        onAddGuest={() => setShowAddGuestModal(true)}
        onAddAccommodation={() => setShowAddAccommodationModal(true)}
      />

      {showAddGuestModal && (
        <AddGuestModal
          onClose={() => setShowAddGuestModal(false)}
          onSuccess={() => {
            setShowAddGuestModal(false);
            // Refresh data
          }}
        />
      )}

      {showAddAccommodationModal && (
        <AddAccommodationModal
          onClose={() => setShowAddAccommodationModal(false)}
          onSuccess={() => {
            setShowAddAccommodationModal(false);
            // Refresh data
          }}
        />
      )}
    </>
  );
}