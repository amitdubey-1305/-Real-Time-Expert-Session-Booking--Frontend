import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Clock, Loader2, AlertCircle, Trash2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const MyBookingsPage = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      const fetchBookings = async () => {
        setLoading(true);
        setError('');
        
        try {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/bookings`, {
            params: { email: user.email }
          });
          setBookings(res.data.data);
        } catch (err) {
          setError('Failed to fetch bookings. Please try again later.');
        } finally {
          setLoading(false);
        }
      };

      fetchBookings();
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 px-5">
        <Loader2 className="animate-spin text-blue-500 mb-6" size={48} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleDeleteBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/bookings/${id}`);
      setBookings(prev => prev.filter(b => b._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking.');
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Pending':
        return <span className="px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide bg-amber-500/15 text-amber-400 border border-amber-500/30">Pending</span>;
      case 'Confirmed':
        return <span className="px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide bg-blue-500/15 text-blue-400 border border-blue-500/30">Confirmed</span>;
      case 'Completed':
        return <span className="px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Completed</span>;
      default:
        return <span className="px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide">{status}</span>;
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto px-5 py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">My <span className="bg-gradient-to-br from-blue-400 to-purple-400 bg-clip-text text-transparent">Bookings</span></h1>
        <p className="text-lg text-slate-400">View all your scheduled and past expert sessions below.</p>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg mb-8">{error}</div>}

      <div>
        {loading ? (
          <div className="flex flex-col items-center justify-center text-center py-20 px-5 animate-[fadeIn_0.5s_ease]">
            <Loader2 className="animate-spin text-blue-500 mb-6" size={48} />
            <p className="text-lg text-slate-400">Fetching your bookings...</p>
          </div>
        ) : bookings.length === 0 && !error ? (
          <div className="flex flex-col items-center justify-center text-center py-20 px-5 animate-[fadeIn_0.5s_ease]">
            <Calendar size={48} className="text-slate-400/80 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">No Bookings Found</h3>
            <p className="text-slate-400 mb-6">You haven't scheduled any sessions yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="glass p-6 flex flex-col gap-5 transition-transform duration-200 hover:-translate-y-1 hover:border-white/15">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center font-bold text-white">
                      {booking.expertId?.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <h4 className="text-lg text-white font-semibold mb-0.5">{booking.expertId?.name || 'Unknown Expert'}</h4>
                      <span className="text-sm text-slate-400">{booking.expertId?.category || 'General'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(booking.status)}
                    <button 
                      onClick={() => handleDeleteBooking(booking._id)}
                      className="p-1.5 rounded-md text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                      title="Cancel Booking"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="flex bg-black/20 p-4 rounded-lg gap-6">
                  <div className="flex items-center gap-2 text-slate-200 font-medium">
                    <Calendar size={18} className="text-slate-500" />
                    <span>{booking.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200 font-medium">
                    <Clock size={18} className="text-slate-500" />
                    <span>{booking.slot}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;
