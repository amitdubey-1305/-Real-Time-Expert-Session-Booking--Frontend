import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, Clock, ArrowLeft, Loader2, AlertCircle, Calendar } from 'lucide-react';
import { io } from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

const ExpertDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchExpertDetails = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/experts/${id}`);
        setExpert(res.data.data);
        if (res.data.data.slots && res.data.data.slots.length > 0) {
          setSelectedDate(res.data.data.slots[0].date);
        }
      } catch (err) {
        setError('Failed to load expert details.');
      } finally {
        setLoading(false);
      }
    };
    fetchExpertDetails();
  }, [id]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL);

    socket.on('slotBooked', (data) => {
      if (data.expertId === id) {
        setExpert(prevExpert => {
          if (!prevExpert) return prevExpert;
          const updatedSlots = prevExpert.slots.map(slot => {
            if (slot.date === data.date) {
              return { ...slot, times: slot.times.filter(t => t !== data.slot) };
            }
            return slot;
          });
          return { ...prevExpert, slots: updatedSlots };
        });

        if (selectedDate === data.date && selectedSlot === data.slot) {
          setSelectedSlot('');
          alert('Sorry, the slot you selected was just booked by someone else!');
        }
      }
    });

    return () => socket.disconnect();
  }, [id, selectedDate, selectedSlot]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 px-5 animate-[fadeIn_0.5s_ease]">
        <Loader2 className="animate-spin text-blue-500 mb-6" size={48} />
        <p className="text-lg text-slate-400">Loading expert profile...</p>
      </div>
    );
  }

  if (error || !expert) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 px-5 animate-[fadeIn_0.5s_ease]">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <p className="text-red-400 mb-6">{error || 'Expert not found'}</p>
        <button className="px-6 py-2.5 bg-white/10 border border-white/20 text-white rounded-lg transition-colors hover:bg-white/20" onClick={() => navigate('/')}>Back to Experts</button>
      </div>
    );
  }

  const handleBookSession = async () => {
    if (!selectedSlot || !selectedDate) {
      alert("Please select a date and time slot first.");
      return;
    }
    
    navigate('/book', { 
      state: { 
        expertId: expert._id,
        expertName: expert.name,
        expertCategory: expert.category,
        date: selectedDate, 
        slot: selectedSlot 
      } 
    });
  };

  const activeDateObj = expert.slots.find(s => s.date === selectedDate);

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-10">
      <button 
        className="flex items-center gap-2 bg-white/5 border border-white/10 text-slate-300 px-5 py-2.5 rounded-lg cursor-pointer transition-colors hover:bg-white/10 hover:text-white mb-8" 
        onClick={() => navigate('/')}
      >
        <ArrowLeft size={20} /> Back to Search
      </button>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="glass flex-1 p-10 flex flex-col gap-8 w-full md:w-auto">
          <div className="flex items-center gap-6">
            <div className="w-[100px] h-[100px] rounded-full bg-expert-avatar flex items-center justify-center text-[40px] font-bold text-white shadow-[0_10px_25px_rgba(59,130,246,0.3)]">
              {expert.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-4xl mb-2 text-white font-bold">{expert.name}</h1>
              <span className="text-lg text-slate-400 bg-slate-400/10 px-4 py-1.5 rounded-full inline-block">{expert.category}</span>
            </div>
          </div>
          
          <div className="flex gap-6">
            <div className="flex-1 flex items-center gap-4 bg-black/20 p-5 rounded-2xl border border-white/5">
              <Star size={24} className="text-amber-400" />
              <div className="flex flex-col">
                <span className="text-2xl font-semibold text-white">{expert.rating ? expert.rating.toFixed(1) : 'N/A'}</span>
                <span className="text-sm text-slate-400">Rating</span>
              </div>
            </div>
            <div className="flex-1 flex items-center gap-4 bg-black/20 p-5 rounded-2xl border border-white/5">
              <Clock size={24} className="text-sky-400" />
              <div className="flex flex-col">
                <span className="text-2xl font-semibold text-white">{expert.experience} Yrs</span>
                <span className="text-sm text-slate-400">Experience</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl mb-3 text-slate-200 font-semibold">About {expert.name}</h3>
            <p className="leading-relaxed text-slate-400">
              An experienced professional in {expert.category} with a passion for mentoring. 
              Book a session to get personalized advice, code reviews, and career guidance.
            </p>
          </div>
        </div>

        <div className="glass flex-1 p-10 w-full md:w-auto flex flex-col h-full min-h-[500px]">
          <h2 className="flex items-center gap-3 text-2xl mb-6 font-semibold">
            <Calendar size={24} className="text-purple-400" /> Availability
          </h2>
          
          {expert.slots && expert.slots.length > 0 ? (
            <>
              <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
                {expert.slots.map(slotObj => {
                  const hasTimes = slotObj.times.length > 0;
                  return (
                    <button 
                      key={slotObj.date}
                      className={`px-6 py-3 rounded-lg cursor-pointer transition-colors whitespace-nowrap border 
                        ${selectedDate === slotObj.date ? 'bg-blue-500/20 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'} 
                        ${!hasTimes ? 'opacity-40 cursor-not-allowed line-through hover:bg-white/5' : ''}`}
                      onClick={() => setSelectedDate(slotObj.date)}
                      disabled={!hasTimes}
                    >
                      {slotObj.date}
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-4 mb-10">
                {activeDateObj && activeDateObj.times.length > 0 ? (
                  activeDateObj.times.map((time, idx) => (
                    <button 
                      key={idx}
                      className={`p-4 rounded-lg cursor-pointer transition-all text-base border
                        ${selectedSlot === time 
                          ? 'bg-slot-selected border-transparent text-white shadow-[0_5px_20px_rgba(147,51,234,0.4)]' 
                          : 'bg-white/5 border-white/10 text-slate-200 hover:border-purple-400 hover:shadow-[0_0_15px_rgba(192,132,252,0.2)]'
                        }`}
                      onClick={() => setSelectedSlot(time)}
                    >
                      {time}
                    </button>
                  ))
                ) : (
                  <div className="text-slate-500 italic p-5 bg-black/20 rounded-lg text-center col-span-full">No slots available for this date.</div>
                )}
              </div>

              <div className="mt-auto pt-6">
                <button 
                  className="w-full p-4 rounded-xl bg-btn-primary text-white font-semibold text-lg transition-all hover:not-disabled:bg-btn-primary-hover hover:not-disabled:shadow-[0_4px_20px_rgba(59,130,246,0.5)] disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed" 
                  disabled={!selectedSlot}
                  onClick={handleBookSession}
                >
                  {!selectedSlot 
                    ? 'Select a Slot' 
                    : user 
                      ? `Confirm Booking for ${selectedSlot}` 
                      : `Login to Book ${selectedSlot}`
                  }
                </button>
              </div>
            </>
          ) : (
            <div className="text-slate-500 italic p-5 bg-black/20 rounded-lg text-center">This expert currently has no upcoming availability.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpertDetailPage;
