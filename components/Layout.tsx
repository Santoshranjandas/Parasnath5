import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { ChevronLeft, Grid, Settings, Heart, LogOut, Share2, Check } from 'lucide-react';
import { User } from '../types';
import FloatingMenu from './FloatingMenu';
import { FloralPattern, BottomFloral } from '../constants';

interface LayoutProps { user: User; onLogout: () => void; }

const Layout: React.FC<LayoutProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTitle = () => {
    if (location.pathname === '/') return '';
    if (location.pathname.startsWith('/notices/')) return 'Notice Details';
    if (location.pathname.startsWith('/issues/')) {
      if (location.pathname === '/issues/new') return 'Raise Complaint';
      return 'Ticket Status';
    }
    if (location.pathname.startsWith('/vendors/')) {
      if (location.pathname === '/vendors/new') return 'Add Vendor';
      return 'Vendor Details';
    }
    if (location.pathname.startsWith('/expenses/')) {
      if (location.pathname === '/expenses/new') return 'New Expense';
      return 'Expense Details';
    }
    
    switch (location.pathname) {
      case '/admin': return 'Admin Console';
      case '/notices': return 'Notices';
      case '/payments': return 'Payments';
      case '/agm': return 'AGM';
      case '/vendors': return 'Vendors';
      case '/issues': return 'Issues';
      case '/tasks': return 'Tasks';
      case '/expenses': return 'Expenses';
      case '/settings': return 'Settings';
      case '/preferences': return 'Preferences';
      case '/feedback': return 'Feedback';
      default: return '';
    }
  };

  const isHome = location.pathname === '/';

  const handleBack = () => {
    if (location.pathname.startsWith('/notices/')) {
      navigate('/notices');
    } else if (location.pathname.startsWith('/issues/')) {
      navigate('/issues');
    } else if (location.pathname.startsWith('/vendors/')) {
      navigate('/vendors');
    } else if (location.pathname.startsWith('/expenses/')) {
      navigate('/expenses');
    } else {
      navigate('/');
    }
  };

  const handleShare = async () => {
    const url = window.location.origin;
    const shareData = {
      title: 'Parasnath Nagari',
      text: 'Join our society portal!',
      url: url
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setIsProfileOpen(false);
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setLinkCopied(true);
        setTimeout(() => {
          setLinkCopied(false);
          setIsProfileOpen(false);
        }, 2000);
      } catch (err) {
        console.error('Failed to copy');
      }
    }
  };

  return (
    <div className="min-h-screen relative max-w-[500px] mx-auto pb-24 overflow-hidden shadow-2xl bg-[#F8F9F5] dark:bg-[#1A1F1A] ring-1 ring-black/5">
      <FloralPattern />
      <BottomFloral />

      <header className="px-4 sm:px-6 pt-10 pb-4 flex items-center justify-between z-40 sticky top-0 bg-[#F8F9F5]/90 dark:bg-[#1A1F1A]/90 backdrop-blur-lg">
        <div className="flex items-center gap-3">
          {!isHome && (
            <button 
              onClick={handleBack}
              className="p-2 -ml-2 rounded-full hover:bg-black/5 active:bg-black/10 transition-colors"
            >
              <ChevronLeft size={24} className="text-[#3D4F3D] dark:text-[#E6E9E0]" />
            </button>
          )}
          {isHome ? (
            <div className="flex flex-col">
              <span className="text-[#3D4F3D] dark:text-[#E6E9E0] font-bebas text-lg sm:text-xl flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#6B8E6B] shadow-[0_0_8px_rgba(107,142,107,0.5)] flex-shrink-0"></span>
                Parasnath Nagari Building No 5
              </span>
            </div>
          ) : (
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#3D4F3D] dark:text-[#E6E9E0] truncate max-w-[200px]">{getTitle()}</h1>
          )}
        </div>
        
        <div className="relative" ref={profileRef}>
          <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 hover:opacity-80 active:scale-95 transition-all">
            <div className="text-right mr-1 flex flex-col justify-center">
              <p className="text-xs sm:text-sm font-bold text-[#3D4F3D] dark:text-[#E6E9E0] truncate max-w-[120px] leading-tight">
                {user.fullName.split(' ')[0]}
              </p>
              <p className="text-[10px] sm:text-xs font-bold text-[#8C9A8C] dark:text-[#A3B18A] uppercase tracking-tighter mt-0.5">
                Flat {user.flatId}
              </p>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white dark:border-white/10 overflow-hidden shadow-md">
              <img src="https://picsum.photos/seed/user123/100/100" alt="Profile" className="w-full h-full object-cover" />
            </div>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#2D372D] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
               <button 
                onClick={handleShare}
                className="flex items-center gap-3 px-5 py-3 text-sm font-bold text-[#6B8E6B] hover:bg-[#6B8E6B]/10 w-full text-left transition-colors"
              >
                {linkCopied ? <Check size={18} /> : <Share2 size={18} />}
                {linkCopied ? 'Link Copied!' : 'Share App'}
              </button>
              <div className="h-px bg-gray-100 dark:bg-white/10 my-1 mx-3" />
              <Link to="/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-5 py-3 text-sm font-semibold text-[#3D4F3D] dark:text-[#E6E9E0] hover:bg-[#6B8E6B]/10 transition-colors">
                <Settings size={18} className="text-[#8C9A8C]" /> Settings
              </Link>
              <Link to="/preferences" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-5 py-3 text-sm font-semibold text-[#3D4F3D] dark:text-[#E6E9E0] hover:bg-[#6B8E6B]/10 transition-colors">
                <Heart size={18} className="text-[#8C9A8C]" /> Preferences
              </Link>
              <div className="h-px bg-gray-100 dark:bg-white/10 my-1 mx-3" />
              <button onClick={() => { onLogout(); setIsProfileOpen(false); }} className="flex items-center gap-3 px-5 py-3 text-sm font-bold text-red-500 hover:bg-red-50 w-full text-left transition-colors">
                <LogOut size={18} /> Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="px-4 sm:px-6 pb-20 relative z-10 page-transition">
        <Outlet />
      </main>

      <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="fixed bottom-6 fab-position w-14 h-14 sm:w-16 sm:h-16 bg-[#6B8E6B] text-white rounded-full flex items-center justify-center shadow-2xl z-30 hover:scale-105 active:scale-90 transition-all">
        <Grid size={28} />
      </button>

      <FloatingMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onLogout={onLogout} />
    </div>
  );
};

export default Layout;