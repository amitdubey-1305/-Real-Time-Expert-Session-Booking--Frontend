import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, User, Mail, Phone, Calendar, Clock, FileText, CheckCircle, Loader2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { expertId, expertName, expertCategory, date, slot } = location.state || {};
  
  const { user, loading } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 px-5">
        <Loader2 className="animate-spin text-blue-500 mb-6" size={48} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!expertId || !date || !slot) {
    navigate('/');
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.includes('@') || !formData.email.includes('.')) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.trim().length < 10) {
      newErrors.phone = 'Phone number must be at least 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL}/bookings`, {
        expertId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        date,
        slot,
        notes: formData.notes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsSuccess(true);
    } catch (err) {
      setErrors({ 
        submit: err.response?.data?.message || 'Failed to complete booking. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-[1000px] mx-auto px-5 py-10 flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="glass text-center p-12 max-w-[500px] w-full">
          <CheckCircle size={64} className="text-emerald-500 mx-auto mb-6" />
          <h2 className="text-4xl mb-4 bg-gradient-to-br from-emerald-400 to-emerald-500 bg-clip-text text-transparent font-bold">Booking Confirmed!</h2>
          <p className="text-slate-300 text-lg mb-8 leading-relaxed">Your session with <strong className="text-white">{expertName}</strong> has been successfully scheduled.</p>
          <div className="flex justify-center gap-8 bg-black/20 p-5 rounded-xl mb-8">
            <div className="flex items-center gap-2 text-white font-medium"><Calendar size={18} /> {date}</div>
            <div className="flex items-center gap-2 text-white font-medium"><Clock size={18} /> {slot}</div>
          </div>
          <button className="w-full p-4 rounded-xl bg-btn-primary text-white font-semibold text-lg transition-all hover:bg-btn-primary-hover hover:shadow-[0_4px_20px_rgba(59,130,246,0.5)]" onClick={() => navigate('/')}>Return to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto px-5 py-10">
      <button className="flex items-center gap-2 bg-white/5 border border-white/10 text-slate-300 px-5 py-2.5 rounded-lg cursor-pointer transition-colors hover:bg-white/10 hover:text-white mb-8" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} /> Back to Expert
      </button>

      <div className="flex flex-col-reverse md:flex-row gap-8 items-start">
        <div className="glass flex-1 p-8 sticky top-[100px] w-full md:w-auto">
          <h3 className="text-xl mb-6 text-white font-semibold">Session Summary</h3>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-[50px] h-[50px] rounded-full bg-expert-avatar flex items-center justify-center text-xl font-bold text-white">
              {expertName.charAt(0)}
            </div>
            <div>
              <h4 className="text-lg text-white mb-1 font-semibold">{expertName}</h4>
              <span className="text-sm text-slate-400">{expertCategory}</span>
            </div>
          </div>
          
          <div className="h-px bg-white/10 my-6"></div>
          
          <div className="flex flex-col gap-5">
            <div className="flex items-start gap-4">
              <Calendar className="text-slate-500 mt-0.5" size={20} />
              <div>
                <label className="text-xs uppercase tracking-wider text-slate-400 block mb-1">Date</label>
                <p className="text-white font-medium text-lg">{date}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Clock className="text-slate-500 mt-0.5" size={20} />
              <div>
                <label className="text-xs uppercase tracking-wider text-slate-400 block mb-1">Time Slot</label>
                <p className="text-white font-medium text-lg">{slot}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass flex-[2] p-10 w-full md:w-auto">
          <h2 className="text-3xl text-white mb-2 font-bold">Complete Your Booking</h2>
          <p className="text-slate-400 mb-8">Please provide your details so we can send you the meeting link.</p>
          
          {errors.submit && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg mb-6">{errors.submit}</div>}

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-slate-300 text-sm font-medium"><User size={16} /> Full Name</label>
              <input 
                type="text" 
                name="name" 
                placeholder="John Doe" 
                value={formData.name}
                onChange={handleInputChange}
                className={`bg-black/20 border ${errors.name ? 'border-red-500' : 'border-white/10'} rounded-lg p-4 text-white text-base outline-none transition-all focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.2)]`}
                readOnly
              />
              {errors.name && <span className="text-red-400 text-xs">{errors.name}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-slate-300 text-sm font-medium"><Mail size={16} /> Email Address</label>
              <input 
                type="email" 
                name="email" 
                placeholder="john@example.com" 
                value={formData.email}
                onChange={handleInputChange}
                className={`bg-black/20 border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-lg p-4 text-white text-base outline-none transition-all focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.2)] opacity-70 cursor-not-allowed`}
                readOnly
              />
              {errors.email && <span className="text-red-400 text-xs">{errors.email}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-slate-300 text-sm font-medium"><Phone size={16} /> Phone Number</label>
              <input 
                type="tel" 
                name="phone" 
                placeholder="+1 (555) 000-0000" 
                value={formData.phone}
                onChange={handleInputChange}
                className={`bg-black/20 border ${errors.phone ? 'border-red-500' : 'border-white/10'} rounded-lg p-4 text-white text-base outline-none transition-all focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.2)]`}
              />
              {errors.phone && <span className="text-red-400 text-xs">{errors.phone}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-slate-300 text-sm font-medium"><FileText size={16} /> Notes for the Expert (Optional)</label>
              <textarea 
                name="notes" 
                placeholder="Briefly describe what you'd like to discuss..." 
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                className="bg-black/20 border border-white/10 rounded-lg p-4 text-white text-base outline-none transition-all focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.2)]"
              ></textarea>
            </div>

            <button type="submit" className="mt-4 p-4 rounded-xl bg-btn-primary text-white font-semibold text-lg transition-all hover:not-disabled:bg-btn-primary-hover hover:not-disabled:shadow-[0_4px_20px_rgba(59,130,246,0.5)] disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed" disabled={isSubmitting}>
              {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
