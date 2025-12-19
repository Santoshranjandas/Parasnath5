
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Filter, CheckCircle, ChevronDown, Check } from 'lucide-react';
import { Notice } from '../types';

interface NoticesProps {
  notices: Notice[];
  setNotices: React.Dispatch<React.SetStateAction<Notice[]>>;
}

const Notices: React.FC<NoticesProps> = ({ notices, setNotices }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Announcement' | 'Event' | 'Reminder'>('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredNotices = notices.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = filterType === 'All' || n.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const unreadCount = notices.filter(n => !n.isRead).length;

  const handleMarkAllAsRead = () => {
    setNotices(notices.map(n => ({ ...n, isRead: true, isNew: false })));
  };

  const handleNoticeClick = (id: string) => {
    setNotices(notices.map(n => n.id === id ? { ...n, isRead: true, isNew: false } : n));
    navigate(`/notices/${id}`);
  };

  const filterOptions: ('All' | 'Announcement' | 'Event' | 'Reminder')[] = ['All', 'Announcement', 'Event', 'Reminder'];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-10">
      
      {/* Search & Actions Row */}
      <div className="space-y-3">
        <div className="flex gap-2 relative">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-300" />
            </div>
            <input
              type="text"
              placeholder="Search notices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/60 border border-white rounded-full py-3 pl-12 pr-4 text-sm text-[#3D4F3D] focus:ring-2 focus:ring-[#6B8E6B]/20 focus:outline-none shadow-inner"
            />
          </div>
          
          <div className="relative" ref={filterRef}>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`p-3 rounded-full border border-white shadow-sm active:scale-95 transition-all flex items-center justify-center gap-1 ${isFilterOpen ? 'bg-[#6B8E6B] text-white' : 'bg-white/60 text-[#8C9A8C]'}`}
            >
              <Filter size={18} />
              {filterType !== 'All' && <span className="text-[10px] font-bold uppercase ml-1">{filterType}</span>}
            </button>

            {/* Filter Dropdown */}
            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-48 glass-card rounded-[24px] shadow-2xl border border-white/60 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-2 border-b border-gray-100 mb-1">
                  <span className="text-[10px] font-bold text-[#8C9A8C] uppercase tracking-widest">Filter By</span>
                </div>
                {filterOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setFilterType(option);
                      setIsFilterOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold transition-colors ${
                      filterType === option 
                        ? 'text-[#6B8E6B] bg-[#6B8E6B]/5' 
                        : 'text-[#3D4F3D] hover:bg-gray-50'
                    }`}
                  >
                    {option}
                    {filterType === option && <Check size={14} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center px-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#8C9A8C] uppercase tracking-wider">
              {unreadCount} UNREAD
            </span>
            {filterType !== 'All' && (
              <span className="text-[9px] bg-[#6B8E6B]/10 text-[#6B8E6B] px-2 py-0.5 rounded-full font-bold uppercase">
                {filterType}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-1.5 text-xs font-bold text-[#6B8E6B] hover:opacity-70 transition-opacity active:scale-95"
            >
              <CheckCircle size={14} />
              Mark all as read
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {filteredNotices.length > 0 ? (
          filteredNotices.map((notice) => (
            <div 
              key={notice.id} 
              onClick={() => handleNoticeClick(notice.id)}
              className="glass-card rounded-[28px] p-6 shadow-sm border border-white/70 space-y-4 relative cursor-pointer active:scale-[0.98] transition-all hover:bg-white/40"
            >
               <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${notice.isRead ? 'bg-gray-50 text-gray-300' : 'bg-blue-50 text-blue-500'}`}>
                      <Bell size={24} />
                    </div>
                    <div>
                      <h4 className={`font-semibold text-[#3D4F3D] leading-snug pr-8 ${notice.isRead ? 'opacity-60' : ''}`}>{notice.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md font-medium uppercase tracking-wider">{notice.type}</span>
                        <span className="text-[10px] text-[#8C9A8C] font-medium">{notice.postedAt}</span>
                      </div>
                    </div>
                  </div>
                  {notice.isNew && !notice.isRead && (
                    <span className="bg-[#6B8E6B] text-white text-[10px] font-bold px-2 py-0.5 rounded-md absolute top-6 right-6 shadow-sm">NEW</span>
                  )}
               </div>

               <p className={`text-sm leading-relaxed font-light line-clamp-2 ${notice.isRead ? 'text-[#8C9A8C]' : 'text-[#3D4F3D]/80'}`}>
                 {notice.content}
               </p>

               <div className="flex flex-wrap gap-2">
                  {notice.tags.map(tag => (
                    <span key={tag} className={`text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-wide ${notice.isRead ? 'bg-gray-100 text-gray-400' : 'bg-[#DDA15E]/10 text-[#BC6C25]'}`}>
                      {tag}
                    </span>
                  ))}
               </div>

               <div className="pt-3 border-t border-gray-50 flex justify-between items-center text-[10px]">
                  <span className="text-[#8C9A8C] font-medium uppercase tracking-widest">Posted by {notice.postedBy}</span>
                  {!notice.isRead && (
                    <span className="flex items-center gap-1 font-bold text-[#DDA15E]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#DDA15E]"></span>
                      Unread
                    </span>
                  )}
               </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20">
            <Bell size={48} className="mx-auto text-gray-100 mb-4" />
            <p className="text-[#8C9A8C] font-serif italic">No notices found for this filter</p>
            <button 
              onClick={() => {setFilterType('All'); setSearchQuery('');}}
              className="mt-4 text-xs font-bold text-[#6B8E6B] underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notices;
