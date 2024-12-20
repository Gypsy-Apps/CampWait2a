import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  Tent, 
  Calendar, 
  ClipboardList, 
  LogOut 
} from 'lucide-react';

function Layout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-xl font-bold text-gray-800">Campground Manager</h1>
        </div>
        <nav className="mt-4">
          <Link
            to="/"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <Home className="w-5 h-5 mr-2" />
            Dashboard
          </Link>
          <Link
            to="/sites"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <Tent className="w-5 h-5 mr-2" />
            Sites
          </Link>
          <Link
            to="/bookings"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Bookings
          </Link>
          <Link
            to="/waitlist"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <ClipboardList className="w-5 h-5 mr-2" />
            Waitlist
          </Link>
        </nav>
        <div className="absolute bottom-0 w-64 p-4">
          <button
            onClick={handleSignOut}
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;