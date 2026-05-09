import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Loader2, AlertCircle } from 'lucide-react';
import { io } from 'socket.io-client';
import ExpertCard from '../components/ExpertCard';

const ExpertListingPage = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchExperts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/experts`, {
        params: { search, category, page, limit: 6 }
      });
      setExperts(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      setError('Failed to load experts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL);
    socket.on('slotBooked', (data) => {
      setExperts(prevExperts => prevExperts.map(expert => {
        if (expert._id === data.expertId) {
          const updatedSlots = expert.slots.map(slot => {
            if (slot.date === data.date) {
              return { ...slot, times: slot.times.filter(t => t !== data.slot) };
            }
            return slot;
          });
          return { ...expert, slots: updatedSlots };
        }
        return expert;
      }));
    });
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(1);
      fetchExperts();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search, category]);

  useEffect(() => {
    fetchExperts();
  }, [page]);

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-10">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 leading-tight">
          Find Your Perfect <span className="bg-gradient-to-br from-blue-400 to-purple-400 bg-clip-text text-transparent">Expert</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-[600px] mx-auto">
          Book real-time sessions with top professionals around the globe.
        </p>
      </div>

      <div className="glass flex flex-wrap items-center gap-4 p-4 mb-10">
        <div className="flex-1 min-w-[250px] flex items-center bg-black/20 rounded-xl px-4 border border-white/5 transition-colors focus-within:border-blue-500/50">
          <Search size={20} className="text-slate-500 mr-3" />
          <input 
            type="text" 
            placeholder="Search experts by name or category..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent border-none py-4 text-white text-base outline-none placeholder:text-slate-500"
          />
        </div>
        <div className="flex items-center bg-black/20 rounded-xl px-4 border border-white/5 min-w-[200px]">
          <Filter size={20} className="text-slate-500 mr-3" />
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-transparent border-none py-4 text-white text-base outline-none appearance-none cursor-pointer [&>option]:bg-slate-800 [&>option]:text-white"
          >
            <option value="">All Categories</option>
            <option value="Web Development">Web Development</option>
            <option value="Data Science">Data Science</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>
      </div>

      <div className="min-h-[400px] relative">
        {loading && experts.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 px-5 animate-[fadeIn_0.5s_ease]">
            <Loader2 className="animate-spin text-blue-500 mb-6" size={48} />
            <p className="text-lg text-slate-400">Discovering experts...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center text-center py-20 px-5 animate-[fadeIn_0.5s_ease]">
            <AlertCircle size={48} className="text-red-500 mb-4" />
            <p className="text-red-400 mb-6">{error}</p>
            <button className="px-6 py-2.5 bg-white/10 border border-white/20 text-white rounded-lg transition-colors hover:bg-white/20" onClick={fetchExperts}>
              Try Again
            </button>
          </div>
        ) : experts.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 px-5 animate-[fadeIn_0.5s_ease]">
            <div className="text-5xl mb-4 opacity-80">🔍</div>
            <h3 className="text-2xl mb-2">No experts found</h3>
            <p className="text-slate-400 mb-6">We couldn't find anyone matching your search criteria.</p>
            <button className="px-6 py-2.5 bg-white/10 border border-white/20 text-white rounded-lg transition-colors hover:bg-white/20" onClick={() => { setSearch(''); setCategory(''); }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6 mb-12">
              {experts.map(expert => (
                <ExpertCard key={expert._id} expert={expert} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-6">
                <button 
                  disabled={page === 1} 
                  onClick={() => setPage(p => p - 1)}
                  className="bg-black/20 border border-white/10 text-white px-5 py-2.5 rounded-lg transition-colors hover:not-disabled:bg-blue-500/20 hover:not-disabled:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-slate-400">Page {page} of {totalPages}</span>
                <button 
                  disabled={page === totalPages} 
                  onClick={() => setPage(p => p + 1)}
                  className="bg-black/20 border border-white/10 text-white px-5 py-2.5 rounded-lg transition-colors hover:not-disabled:bg-blue-500/20 hover:not-disabled:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ExpertListingPage;
