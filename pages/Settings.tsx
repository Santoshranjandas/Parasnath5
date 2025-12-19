
import React, { useState } from 'react';
import { User as UserIcon, Mail, Home, Shield, ChevronRight, Save, X, Lock, CheckCircle2 } from 'lucide-react';
import { User } from '../types';

const Settings: React.FC<{ user: User }> = ({ user }) => {
  const [fullName, setFullName] = useState(user.fullName);
  const [isSaved, setIsSaved] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = () => {
    setIsSaved(true);
    showToast("Profile settings saved successfully!");
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPassword(false);
    showToast("Password updated successfully!");
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-10">
      <div className="flex flex-col items-center py-6">
        <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-lg relative group">
          <img src="https://picsum.photos/seed/user123/200/200" alt="Profile" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
            <span className="text-white text-xs font-bold uppercase">Edit</span>
          </div>
        </div>
        <h2 className="mt-4 text-2xl font-serif font-bold text-[#3D4F3D]">{user.fullName}</h2>
        <p className="text-[#8C9A8C] text-sm text-center px-4">
          Flat {user.flatId} • <span className="font-bebas tracking-wider">Parasnath Nagari Building No 5</span>
        </p>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-bold text-[#8C9A8C] uppercase tracking-widest pl-2">Personal Information</h4>
        <div className="glass-card rounded-[28px] p-6 space-y-5 border border-white/70">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#8C9A8C] flex items-center gap-2">
              <UserIcon size={14} /> Full Name
            </label>
            <input 
              type="text" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-white/50 border border-gray-100 rounded-xl py-3 px-4 text-[#3D4F3D] text-sm focus:outline-none focus:ring-2 focus:ring-[#6B8E6B]/20 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#8C9A8C] flex items-center gap-2">
              <Mail size={14} /> Email Address
            </label>
            <input 
              type="email" 
              value={user.email}
              disabled
              className="w-full bg-gray-50/50 border border-gray-100 rounded-xl py-3 px-4 text-[#8C9A8C] text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#8C9A8C] flex items-center gap-2">
              <Home size={14} /> Flat Number
            </label>
            <input 
              type="text" 
              value={user.flatId}
              disabled
              className="w-full bg-gray-50/50 border border-gray-100 rounded-xl py-3 px-4 text-[#8C9A8C] text-sm"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-bold text-[#8C9A8C] uppercase tracking-widest pl-2">Security</h4>
        <div className="glass-card rounded-[28px] p-2 border border-white/70">
          <button 
            onClick={() => setIsChangingPassword(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors rounded-2xl group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield size={20} />
              </div>
              <span className="text-sm font-semibold text-[#3D4F3D]">Change Password</span>
            </div>
            <ChevronRight size={18} className="text-gray-300 group-hover:text-[#6B8E6B] group-hover:translate-x-1 transition-all" />
          </button>
        </div>
      </div>

      <button 
        onClick={handleSave}
        className="w-full bg-[#6B8E6B] text-white py-4 rounded-[24px] font-bold shadow-lg shadow-[#6B8E6B]/20 flex items-center justify-center gap-2 hover:bg-[#5a7a5a] active:scale-[0.98] transition-all"
      >
        <Save size={20} />
        {isSaved ? 'Settings Saved!' : 'Save Changes'}
      </button>

      {/* Change Password Modal */}
      {isChangingPassword && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-[32px] p-8 shadow-2xl relative animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setIsChangingPassword(false)}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
            >
              <X size={20} />
            </button>

            <h3 className="text-2xl font-serif font-bold text-[#3D4F3D] mb-2">Update Password</h3>
            <p className="text-sm text-[#8C9A8C] mb-8">Ensure your account stays secure.</p>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#8C9A8C] uppercase tracking-wider">Current Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C9A8C]" />
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B8E6B]/20"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#8C9A8C] uppercase tracking-wider">New Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C9A8C]" />
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B8E6B]/20"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-[#6B8E6B] text-white py-4 rounded-2xl font-bold shadow-lg shadow-[#6B8E6B]/20 mt-4 hover:bg-[#5a7a5a] transition-all"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toast Feedback */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#3D4F3D] text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl z-[70] animate-in slide-in-from-bottom-10 duration-300">
          <CheckCircle2 size={18} className="text-[#6B8E6B]" />
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}
    </div>
  );
};

export default Settings;
