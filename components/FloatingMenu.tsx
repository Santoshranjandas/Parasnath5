import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Bell, MessageSquare, ListTodo, Users, Landmark, CreditCard, LogOut, X, BarChart3, MessageCirclePlus, ShieldCheck } from 'lucide-react';
import { User } from '../types';

interface FloatingMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const FloatingMenu: React.FC<FloatingMenuProps> = ({ isOpen, onClose, onLogout }) => {
  // We need to check if user is admin. Since props don't pass user, we can get it from storage 
  // or rely on context. For simplicity in this structure, we read from localStorage
  // A better approach would be passing user as prop, but this matches current architecture.
  const userStr = localStorage.getItem('user');
  const user: User | null = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user?.role === 'admin';

  if (!isOpen) return null;

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    ...(isAdmin ? [{ icon: ShieldCheck, label: 'Admin Console', path: '/admin' }] : []),
    { icon: Bell, label: 'Notices', path: '/notices' },
    { icon: MessageSquare, label: 'Issues', path: '/issues' },
    { icon: ListTodo, label: 'Tasks', path: '/tasks' },
    { icon: Users, label: 'Vendors', path: '/vendors' },
    { icon: Landmark, label: 'AGM', path: '/agm' },
    { icon: CreditCard, label: 'Payments', path: '/payments' },
    { icon: BarChart3, label: 'Expenses', path: '/expenses' },
    { icon: MessageCirclePlus, label: 'Feedback', path: '/feedback' },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:p-6 bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="w-full max-w-[320px] bg-white dark:bg-[#242B24] rounded-[32px] p-3 sm:p-4 soft-shadow flex flex-col gap-1 mb-20 animate-in fade-in slide-in-from-bottom-6 duration-300 ring-1 ring-black/5"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-50 dark:border-white/10 mb-2">
          <span className="font-serif font-bold text-lg text-[#3D4F3D] dark:text-[#E6E9E0]">Menu</span>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 active:scale-90 rounded-full transition-all">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-1 max-h-[350px] overflow-y-auto pr-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center gap-4 px-4 py-3 rounded-2xl transition-all active:scale-[0.98]
                ${isActive ? 'bg-[#6B8E6B]/10 text-[#6B8E6B]' : 'text-[#3D4F3D] dark:text-[#E6E9E0] hover:bg-gray-50 dark:hover:bg-white/5'}
              `}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={20} className={isActive ? 'text-[#6B8E6B]' : 'text-gray-400'} />
                  <span className="font-bold text-sm tracking-tight">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        <button
          onClick={() => { onLogout(); onClose(); }}
          className="flex items-center gap-4 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 active:bg-red-100 transition-all mt-2"
        >
          <LogOut size={20} />
          <span className="font-bold text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default FloatingMenu;