export interface Organization {
  id: string;
  name: string;
  created_at: string;
}

export interface Campground {
  id: string;
  org_id: string;
  name: string;
  location: string;
  created_at: string;
}

export interface Accommodation {
  id: string;
  campground_id: string;
  name: string;
  type: 'Site' | 'Suite';
  image_url: string | null;
  room_count: number | null;
  capacity: number;
  amenities: string[];
  description: string | null;
  created_at: string;
}

export interface Guest {
  id: string;
  campground_id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  created_at: string;
}

export interface GuestBooking {
  id: string;
  guest_id: string;
  accommodation_id: string;
  check_in: string;
  check_out: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
  created_at: string;
}

// ... (rest of the existing types)