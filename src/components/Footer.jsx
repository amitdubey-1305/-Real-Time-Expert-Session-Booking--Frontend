import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="glass !rounded-none !border-b-0 !border-x-0 mt-auto py-6 px-10 text-center">
      <p className="text-slate-400 text-sm">
        &copy; {currentYear} ExpertBook Inc. All rights reserved. 
        <span className="block mt-1 text-slate-500 text-xs">Real-Time Expert Session Booking System</span>
      </p>
    </footer>
  );
};

export default Footer;
