import React from 'react';
import { Plus, Users, Tent, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';

interface QuickActionsProps {
  onAddGuest: () => void;
  onAddAccommodation: () => void;
}

export default function QuickActions({ onAddGuest, onAddAccommodation }: QuickActionsProps) {
  const actions = [
    {
      title: 'Add Guest',
      icon: Users,
      onClick: onAddGuest
    },
    {
      title: 'New Booking',
      icon: Calendar,
      onClick: onAddGuest // This will open the guest modal first
    },
    {
      title: 'Add Accommodation',
      icon: Tent,
      onClick: onAddAccommodation
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {actions.map((action, index) => (
        <Button
          key={index}
          variant="outline"
          className="flex items-center justify-center p-6 h-24"
          onClick={action.onClick}
        >
          <div className="flex flex-col items-center space-y-2">
            <action.icon className="w-6 h-6" />
            <span>{action.title}</span>
          </div>
        </Button>
      ))}
    </div>
  );
}