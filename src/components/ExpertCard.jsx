import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Clock } from 'lucide-react';

const ExpertCard = ({ expert }) => {
  const navigate = useNavigate();

  return (
    <div className="glass p-6 flex flex-col gap-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(59,130,246,0.5)] hover:border-white/10">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-expert-avatar flex items-center justify-center text-2xl font-semibold text-white">
          {expert.name.charAt(0)}
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-1">{expert.name}</h3>
          <span className="text-sm text-slate-400 bg-slate-400/10 px-2 py-1 rounded-full">{expert.category}</span>
        </div>
      </div>
      
      <div className="flex gap-6">
        <div className="flex items-center gap-1.5 text-sm text-slate-300">
          <Star size={16} className="text-amber-400" />
          <span>{expert.rating ? expert.rating.toFixed(1) : 'New'}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-slate-300">
          <Clock size={16} className="text-sky-400" />
          <span>{expert.experience} Yrs Exp</span>
        </div>
      </div>

      <div>
        <h4 className="text-sm text-slate-400 font-medium mb-2">Next Available:</h4>
        {expert.slots && expert.slots.length > 0 && expert.slots[0].times.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {expert.slots[0].times.slice(0, 3).map((time, idx) => (
              <span key={idx} className="bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-lg text-xs text-slate-200">{time}</span>
            ))}
            {expert.slots[0].times.length > 3 && <span className="bg-blue-500/20 border border-blue-500/30 text-blue-400 px-2.5 py-1.5 rounded-lg text-xs">+{expert.slots[0].times.length - 3}</span>}
          </div>
        ) : (
          <p className="text-sm text-slate-500 italic">No slots available right now</p>
        )}
      </div>

      <button 
        className="mt-auto w-full p-3 rounded-lg bg-btn-primary text-white font-semibold transition-all duration-200 hover:bg-btn-primary-hover hover:shadow-[0_4px_15px_rgba(59,130,246,0.4)]" 
        onClick={() => navigate(`/expert/${expert._id}`)}
      >
        Book Session
      </button>
    </div>
  );
};

export default ExpertCard;
