
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, User, Tag, ArrowLeft, Bell } from 'lucide-react';
import { Notice } from '../types';

interface NoticeDetailProps {
  notices: Notice[];
  setNotices: React.Dispatch<React.SetStateAction<Notice[]>>;
}

const NoticeDetail: React.FC<NoticeDetailProps> = ({ notices, setNotices }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const notice = notices.find(n => n.id === id);

  useEffect(() => {
    // Mark as read when the detail page is opened
    if (notice && !notice.isRead) {
      setNotices(prev => prev.map(n => n.id === id ? { ...n, isRead: true, isNew: false } : n));
    }
  }, [id, notice, setNotices]);

  if (!notice) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
          <Bell size={32} />
        </div>
        <h3 className="text-xl font-serif text-[#3D4F3D] font-bold">Notice Not Found</h3>
        <button 
          onClick={() => navigate('/notices')}
          className="mt-6 flex items-center gap-2 text-[#6B8E6B] font-bold active:scale-95 transition-transform"
        >
          <ArrowLeft size={18} /> Back to Notices
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header Info */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] bg-[#6B8E6B]/10 text-[#6B8E6B] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
            {notice.type}
          </span>
          <span className="text-[10px] text-[#8C9A8C] font-medium">{notice.postedAt}</span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-[#3D4F3D] leading-tight mb-4">
          {notice.title}
        </h1>
        <div className="flex flex-wrap gap-4 text-xs text-[#8C9A8C]">
          <div className="flex items-center gap-1.5">
            <User size={14} className="text-[#6B8E6B]" />
            <span>By {notice.postedBy}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className="text-[#6B8E6B]" />
            <span>June 2024</span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="glass-card rounded-[32px] p-8 shadow-sm border border-white/70 mb-8 min-h-[300px]">
        <div className="prose prose-sm max-w-none text-[#3D4F3D]/90 leading-relaxed whitespace-pre-wrap font-light">
          {notice.content}
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-2 text-[#8C9A8C] mr-2">
          <Tag size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">Tags:</span>
        </div>
        {notice.tags.map(tag => (
          <span key={tag} className="text-[10px] bg-[#DDA15E]/10 text-[#BC6C25] px-4 py-1.5 rounded-full font-bold uppercase tracking-wide">
            {tag}
          </span>
        ))}
      </div>

      {/* Navigation */}
      <div className="mt-12 flex gap-4">
        <button 
          onClick={() => navigate('/notices')}
          className="flex-1 bg-white/60 border border-white text-[#3D4F3D] py-4 rounded-[24px] font-bold shadow-sm hover:bg-white active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <ArrowLeft size={18} />
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NoticeDetail;
