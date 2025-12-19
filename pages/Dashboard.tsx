
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, MessageSquare, ListTodo, Bell, RefreshCw } from 'lucide-react';
import { User, Notice } from '../types';
import { api } from '../lib/api';

interface DashboardProps {
  user: User;
  notices: Notice[];
  setNotices: React.Dispatch<React.SetStateAction<Notice[]>>;
  refreshData: () => Promise<void>;
}

const Dashboard: React.FC<DashboardProps> = ({ user, notices, setNotices, refreshData }) => {
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);

  const unreadCount = notices.filter(n => !n.isRead).length;

  const handleMarkAllAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real app, this would be a bulk API call
    const promises = notices.filter(n => !n.isRead).map(n => api.notices.markRead(n.id));
    await Promise.all(promises);
    setNotices(notices.map(n => ({ ...n, isRead: true, isNew: false })));
  };

  const handleNoticeClick = async (id: string) => {
    await api.notices.markRead(id);
    setNotices(notices.map(n => n.id === id ? { ...n, isRead: true, isNew: false } : n));
    navigate(`/notices/${id}`);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Welcome Message */}
      <div className="pt-2 flex justify-between items-start">
        <div>
          <h2 className="text-xl font-serif text-[#3D4F3D] dark:text-[#E6E9E0] font-bold">Hello, {user.fullName.split(' ')[0]} 👋</h2>
          <p className="text-sm text-[#8C9A8C] dark:text-[#A3B18A]">Welcome to your society portal</p>
        </div>
        <button 
          onClick={handleRefresh}
          className={`p-2 rounded-full hover:bg-black/5 active:scale-90 transition-all ${refreshing ? 'animate-spin' : ''}`}
        >
          <RefreshCw size={20} className="text-[#8C9A8C]" />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <StatCard 
          icon={<CreditCard size={18} />} 
          label="Due" 
          value="₹ 2,500" 
          bgColor="bg-emerald-50 dark:bg-emerald-900/20" 
          iconColor="text-[#6B8E6B]" 
          onClick={() => navigate('/payments')}
        />
        <StatCard 
          icon={<MessageSquare size={18} />} 
          label="Issues" 
          value="4" 
          bgColor="bg-orange-50 dark:bg-orange-900/20" 
          iconColor="text-orange-500" 
          onClick={() => navigate('/issues')}
        />
        <StatCard 
          icon={<ListTodo size={18} />} 
          label="Tasks" 
          value="2" 
          bgColor="bg-blue-50 dark:bg-blue-900/20" 
          iconColor="text-blue-500" 
          onClick={() => navigate('/tasks')}
        />
        <StatCard 
          icon={<Bell size={18} />} 
          label="Notices" 
          value={unreadCount.toString()} 
          bgColor="bg-green-50 dark:bg-green-900/20" 
          iconColor="text-green-600" 
          onClick={() => navigate('/notices')}
        />
      </div>

      {/* Notices Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="bg-[#DDA15E]/10 px-4 py-1.5 rounded-full flex items-center gap-2">
            <span className="text-orange-800 dark:text-orange-300 font-bold text-xs uppercase tracking-tight">
              {unreadCount > 0 ? `${unreadCount} New Notices` : 'No new notices'}
            </span>
          </div>
          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAllAsRead}
              className="text-[#8C9A8C] dark:text-[#A3B18A] text-xs font-semibold hover:text-[#6B8E6B] transition-colors active:scale-95"
            >
              Mark All As Read
            </button>
          )}
        </div>

        <div className="space-y-4">
          {notices.slice(0, 3).map(notice => (
            <div 
              key={notice.id} 
              onClick={() => handleNoticeClick(notice.id)}
              className="glass-card rounded-[24px] sm:rounded-[28px] p-5 shadow-sm space-y-3 relative border border-white/60 dark:border-white/10 hover:scale-[1.01] transition-transform active:scale-[0.99] cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${notice.isRead ? 'bg-gray-50 dark:bg-gray-800 text-gray-400' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600'}`}>
                    <Bell size={18} />
                  </div>
                  <div>
                    <h4 className={`font-bold text-[#3D4F3D] dark:text-[#E6E9E0] text-sm leading-tight ${notice.isRead ? 'opacity-60' : ''}`}>{notice.title}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[9px] bg-gray-100 dark:bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded-md flex items-center gap-1 font-bold uppercase tracking-tighter">
                        {notice.type}
                      </span>
                      <span className="text-[10px] text-[#8C9A8C] dark:text-[#A3B18A] font-medium">{notice.postedAt}</span>
                    </div>
                  </div>
                </div>
                {notice.isNew && !notice.isRead && (
                  <span className="bg-[#6B8E6B] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0 shadow-sm">NEW</span>
                )}
              </div>
              
              <p className={`text-sm leading-relaxed pl-1 line-clamp-2 ${notice.isRead ? 'text-[#8C9A8C] dark:text-[#A3B18A]' : 'text-[#3D4F3D]/80 dark:text-[#E6E9E0]/80'}`}>
                {notice.content}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {notice.tags.map(tag => (
                  <span key={tag} className={`text-[9px] px-2.5 py-1 rounded-full font-bold uppercase tracking-tight ${notice.isRead ? 'bg-gray-100 dark:bg-gray-800 text-gray-400' : 'bg-[#DDA15E]/10 text-[#BC6C25] dark:text-[#DDA15E]'}`}>
                    {tag}
                  </span>
                ))}
              </div>

              <div className="pt-2 border-t border-gray-50 dark:border-white/5 flex justify-between items-center text-[10px] font-medium">
                <span className="text-[#8C9A8C] dark:text-[#A3B18A]">By {notice.postedBy}</span>
                {!notice.isRead && (
                  <span className="text-[#DDA15E] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DDA15E] animate-pulse"></span>
                    Unread
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ 
  icon, 
  label, 
  value, 
  bgColor, 
  iconColor, 
  onClick 
}: { 
  icon: any, 
  label: string, 
  value: string, 
  bgColor: string, 
  iconColor: string, 
  onClick?: () => void 
}) => (
  <button 
    onClick={onClick}
    className="w-full text-left glass-card rounded-[22px] p-4 shadow-sm border border-white/50 dark:border-white/10 active:scale-95 transition-transform"
  >
    <div className="flex justify-between items-start mb-2">
      <div className={`${bgColor} p-1.5 rounded-xl ${iconColor}`}>
        {icon}
      </div>
      <span className="text-[10px] font-bold text-[#8C9A8C] dark:text-[#A3B18A] uppercase tracking-wider">{label}</span>
    </div>
    <p className="text-xl sm:text-2xl font-serif text-[#3D4F3D] dark:text-[#E6E9E0] font-bold">{value}</p>
  </button>
);

export default Dashboard;
