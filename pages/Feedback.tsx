import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Star, Send, CheckCircle2, ThumbsUp, AlertTriangle, Lightbulb } from 'lucide-react';

const Feedback: React.FC = () => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState<'General' | 'Bug' | 'Feature'>('General');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // In a real app, this would send data to the backend
    setTimeout(() => {
      navigate('/');
    }, 2500);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-serif font-bold text-[#3D4F3D] dark:text-[#E6E9E0]">We Value Your Input</h2>
        <p className="text-sm text-[#8C9A8C] dark:text-[#A3B18A]">Help us improve Parasnath Nagari</p>
      </div>

      {submitted ? (
        <div className="glass-card rounded-[32px] p-10 flex flex-col items-center text-center animate-in zoom-in duration-300 border border-white/50">
          <div className="w-20 h-20 bg-[#6B8E6B]/10 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 size={40} className="text-[#6B8E6B]" />
          </div>
          <h3 className="text-xl font-bold text-[#3D4F3D] dark:text-[#E6E9E0] mb-2">Thank You!</h3>
          <p className="text-[#8C9A8C] text-sm mb-6">Your feedback has been sent to the admin team.</p>
          <button 
            onClick={() => navigate('/')}
            className="text-[#6B8E6B] font-bold text-sm hover:underline"
          >
            Return to Dashboard
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div className="glass-card rounded-[32px] p-6 border border-white/70 flex flex-col items-center gap-4">
            <span className="text-xs font-bold text-[#8C9A8C] uppercase tracking-widest">Rate your experience</span>
            <div className="flex gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`transition-all active:scale-90 ${rating >= star ? 'text-[#DDA15E] scale-110' : 'text-gray-200 hover:text-[#DDA15E]/50'}`}
                >
                  <Star size={32} fill={rating >= star ? "currentColor" : "none"} />
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#8C9A8C] uppercase tracking-widest px-2">Feedback Type</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setCategory('General')}
                className={`p-3 rounded-2xl flex flex-col items-center gap-2 border transition-all ${
                  category === 'General' 
                    ? 'bg-[#6B8E6B] text-white border-[#6B8E6B] shadow-lg shadow-[#6B8E6B]/20' 
                    : 'bg-white/60 dark:bg-white/5 border-transparent text-[#8C9A8C]'
                }`}
              >
                <ThumbsUp size={20} />
                <span className="text-[10px] font-bold uppercase">General</span>
              </button>
              <button
                type="button"
                onClick={() => setCategory('Bug')}
                className={`p-3 rounded-2xl flex flex-col items-center gap-2 border transition-all ${
                  category === 'Bug' 
                    ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20' 
                    : 'bg-white/60 dark:bg-white/5 border-transparent text-[#8C9A8C]'
                }`}
              >
                <AlertTriangle size={20} />
                <span className="text-[10px] font-bold uppercase">Bug</span>
              </button>
              <button
                type="button"
                onClick={() => setCategory('Feature')}
                className={`p-3 rounded-2xl flex flex-col items-center gap-2 border transition-all ${
                  category === 'Feature' 
                    ? 'bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/20' 
                    : 'bg-white/60 dark:bg-white/5 border-transparent text-[#8C9A8C]'
                }`}
              >
                <Lightbulb size={20} />
                <span className="text-[10px] font-bold uppercase">Idea</span>
              </button>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#8C9A8C] uppercase tracking-widest px-2">Your Message</label>
            <div className="relative">
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={category === 'Bug' ? "Describe what went wrong..." : category === 'Feature' ? "What should we add next?" : "Tell us what you think..."}
                rows={5}
                className="w-full bg-white/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[24px] p-5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B8E6B]/20 resize-none dark:text-[#E6E9E0]"
              />
              <MessageSquare size={16} className="absolute right-5 bottom-5 text-[#8C9A8C]" />
            </div>
          </div>

          <button
            type="submit"
            disabled={!message}
            className="w-full bg-[#6B8E6B] text-white py-4 rounded-[24px] font-bold shadow-xl shadow-[#6B8E6B]/20 flex items-center justify-center gap-2 hover:bg-[#5a7a5a] active:scale-[0.98] transition-all disabled:opacity-50 disabled:shadow-none"
          >
            <Send size={18} />
            Submit Feedback
          </button>
        </form>
      )}
    </div>
  );
};

export default Feedback;