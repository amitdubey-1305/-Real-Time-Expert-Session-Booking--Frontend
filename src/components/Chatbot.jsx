import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi there! I'm your booking assistant. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState('');

  const getBotResponse = (text) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('book') || lowerText.includes('how to')) {
      return "To book an expert, simply go to the Home page, browse or search for an expert, click their profile, select an available date and time slot, and click 'Select a Slot'!";
    }
    if (lowerText.includes('cancel') || lowerText.includes('delete')) {
      return "You can cancel any of your bookings by navigating to the 'My Bookings' page and clicking the red trash can icon next to the booking you wish to cancel.";
    }
    if (lowerText.includes('already booked') || lowerText.includes('conflict')) {
      return "If someone else books the exact same slot right before you do, our system will prevent double-booking and alert you immediately.";
    }
    return "I can only answer basic questions about the booking process right now. Try asking 'How do I book?' or 'How do I cancel?'.";
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    setTimeout(() => {
      setMessages(prev => [...prev, { text: getBotResponse(userMessage.text), isBot: true }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {isOpen ? (
        <div className="w-[320px] h-[400px] glass flex flex-col overflow-hidden animate-[fadeIn_0.2s_ease]">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2 font-semibold">
              <MessageCircle size={20} />
              Booking Assistant
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-md transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-black/40">
            {messages.map((msg, idx) => (
              <div key={idx} className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.isBot ? 'bg-white/10 text-slate-200 self-start rounded-tl-none' : 'bg-blue-500 text-white self-end rounded-tr-none'}`}>
                {msg.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="p-3 border-t border-white/10 flex gap-2 bg-black/60">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..." 
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors">
              <Send size={18} />
            </button>
          </form>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white shadow-[0_4px_20px_rgba(147,51,234,0.4)] hover:scale-105 transition-transform"
        >
          <MessageCircle size={28} />
        </button>
      )}
    </div>
  );
};

export default Chatbot;
