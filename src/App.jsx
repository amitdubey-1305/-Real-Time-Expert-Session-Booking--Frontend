import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ExpertListingPage from './pages/ExpertListingPage';
import ExpertDetailPage from './pages/ExpertDetailPage';
import BookingPage from './pages/BookingPage';
import MyBookingsPage from './pages/MyBookingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  
  return (
    <nav className="glass sticky top-0 z-[100] flex items-center justify-between px-10 py-4 !rounded-none !border-t-0 !border-x-0">
      <Link to="/" className="flex items-center gap-3 text-xl font-bold text-white transition-opacity hover:opacity-80">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-white bg-gradient-to-br from-blue-500 to-purple-400">E</div>
        <span>ExpertBook</span>
      </Link>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-slate-400 text-sm hidden sm:block">Welcome, <strong className="text-white">{user.name}</strong></span>
            <Link to="/my-bookings" className="text-[#cbd5e1] text-base font-medium px-4 py-2 rounded-lg transition-all bg-white/5 border border-white/10 hover:text-white hover:bg-white/10">My Bookings</Link>
            <button onClick={logout} className="text-red-400 text-base font-medium px-4 py-2 rounded-lg transition-all bg-red-500/10 border border-red-500/20 hover:bg-red-500/20">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-[#cbd5e1] text-base font-medium px-4 py-2 rounded-lg transition-all hover:text-white">Login</Link>
            <Link to="/register" className="text-white text-base font-medium px-4 py-2 rounded-lg transition-all bg-blue-500 hover:bg-blue-600">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<ExpertListingPage />} />
              <Route path="/expert/:id" element={<ExpertDetailPage />} />
              <Route path="/book" element={<BookingPage />} />
              <Route path="/my-bookings" element={<MyBookingsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
        </main>
        
        <Footer />
        <Chatbot />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
