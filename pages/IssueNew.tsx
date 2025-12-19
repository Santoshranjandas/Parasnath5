
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';
import { Issue, User } from '../types';

interface IssueNewProps {
  setIssues: React.Dispatch<React.SetStateAction<Issue[]>>;
  user: User;
}

const IssueNew: React.FC<IssueNewProps> = ({ setIssues, user }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Issue['category']>('Other');
  const [description, setDescription] = useState('');
  const [toast, setToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newIssue: Issue = {
      id: Math.floor(100 + Math.random() * 900).toString(),
      userId: user.id,
      title,
      category,
      description,
      status: 'Pending',
      createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    setIssues(prev => [newIssue, ...prev]);
    setToast(true);
    
    setTimeout(() => {
      navigate('/issues');
    }, 2000);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="mb-6">
        <h2 className="text-2xl font-serif font-bold text-[#3D4F3D]">New Complaint</h2>
        <p className="text-sm text-[#8C9A8C]">Provide details about your issue</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-card rounded-[32px] p-6 sm:p-8 space-y-5 border border-white/70">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#8C9A8C] uppercase tracking-wider px-1">Issue Category</label>
            <div className="grid grid-cols-2 gap-2">
              {(['Plumbing', 'Electrical', 'Maintenance', 'Security', 'Other'] as const).map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                    category === cat 
                    ? 'bg-[#6B8E6B] text-white border-[#6B8E6B] shadow-lg shadow-[#6B8E6B]/20' 
                    : 'bg-white border-gray-100 text-[#8C9A8C] hover:border-[#6B8E6B]/30'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#8C9A8C] uppercase tracking-wider px-1">Subject / Title</label>
            <input
              type="text"
              required
              placeholder="Brief summary of the issue"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/50 border border-gray-100 rounded-2xl py-3.5 px-4 text-sm focus:ring-2 focus:ring-[#6B8E6B]/20 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#8C9A8C] uppercase tracking-wider px-1">Detailed Description</label>
            <textarea
              required
              rows={5}
              placeholder="Describe the problem in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/50 border border-gray-100 rounded-2xl py-3.5 px-4 text-sm focus:ring-2 focus:ring-[#6B8E6B]/20 focus:outline-none resize-none"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/issues')}
            className="flex-1 bg-white border border-gray-100 text-[#8C9A8C] py-4 rounded-[24px] font-bold active:scale-95 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-[2] bg-[#6B8E6B] text-white py-4 rounded-[24px] font-bold shadow-lg shadow-[#6B8E6B]/20 flex items-center justify-center gap-2 hover:bg-[#5a7a5a] active:scale-[0.98] transition-all"
          >
            <Send size={18} />
            Submit Ticket
          </button>
        </div>
      </form>

      {/* Toast Feedback */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#3D4F3D] text-white px-6 py-4 rounded-full flex items-center gap-3 shadow-2xl z-50 animate-in slide-in-from-bottom-10 duration-300">
          <CheckCircle2 size={20} className="text-[#6B8E6B]" />
          <div className="flex flex-col">
            <span className="text-sm font-bold">Complaint Submitted!</span>
            <span className="text-[10px] opacity-70">Redirecting to list...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueNew;
