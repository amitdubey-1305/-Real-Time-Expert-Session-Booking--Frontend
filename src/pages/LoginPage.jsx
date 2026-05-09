import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[500px] mx-auto px-5 py-20 animate-[fadeIn_0.5s_ease]">
      <div className="glass p-10 flex flex-col gap-6">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold mb-2 text-white">Welcome Back</h1>
          <p className="text-slate-400">Login to your account to book sessions.</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg">
            <AlertCircle size={20} />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300 font-medium">Email Address</label>
            <div className="flex items-center bg-black/20 border border-white/10 rounded-xl px-4 focus-within:border-blue-500 focus-within:shadow-[0_0_0_2px_rgba(59,130,246,0.2)] transition-all">
              <Mail size={18} className="text-slate-500 mr-2" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                required
                className="flex-1 bg-transparent border-none py-3.5 text-white outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300 font-medium">Password</label>
            <div className="flex items-center bg-black/20 border border-white/10 rounded-xl px-4 focus-within:border-blue-500 focus-within:shadow-[0_0_0_2px_rgba(59,130,246,0.2)] transition-all">
              <Lock size={18} className="text-slate-500 mr-2" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="flex-1 bg-transparent border-none py-3.5 text-white outline-none"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="mt-4 w-full py-4 bg-btn-primary text-white rounded-xl font-semibold hover:bg-btn-primary-hover hover:shadow-[0_4px_15px_rgba(59,130,246,0.4)] transition-all disabled:opacity-70 flex justify-center items-center"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : 'Login'}
          </button>
        </form>

        <p className="text-center text-slate-400 mt-4 text-sm">
          Don't have an account? <Link to="/register" className="text-blue-400 hover:text-blue-300 transition-colors">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
