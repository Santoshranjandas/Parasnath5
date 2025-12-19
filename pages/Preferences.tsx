
import React, { useState, useEffect } from 'react';
import { Bell, Eye, Volume2, Moon, Globe, ChevronRight } from 'lucide-react';

const Preferences: React.FC = () => {
  const [toggles, setToggles] = useState(() => {
    const saved = localStorage.getItem('app-preferences');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      push: true,
      email: false,
      privacy: true,
      dark: false,
      highContrast: false
    };
  });

  useEffect(() => {
    localStorage.setItem('app-preferences', JSON.stringify(toggles));
    
    // Handle Dark Mode Class
    if (toggles.dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Handle High Contrast Class
    if (toggles.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [toggles]);

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-10">
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-[#8C9A8C] dark:text-[#A3B18A] uppercase tracking-widest pl-2">Notification Settings</h4>
        <div className="glass-card rounded-[28px] p-3 border border-white/70 space-y-1">
          <PreferenceItem 
            icon={<Bell size={20} />} 
            label="Push Notifications" 
            active={toggles.push} 
            onToggle={() => handleToggle('push')}
            color="bg-blue-50 dark:bg-blue-900/20 text-blue-500"
          />
          <PreferenceItem 
            icon={<Volume2 size={20} />} 
            label="Sound Alerts" 
            active={true} 
            onToggle={() => {}} 
            color="bg-purple-50 dark:bg-purple-900/20 text-purple-500"
          />
          <PreferenceItem 
            icon={<Globe size={20} />} 
            label="Email Digest" 
            active={toggles.email} 
            onToggle={() => handleToggle('email')}
            color="bg-emerald-50 dark:bg-emerald-900/20 text-[#6B8E6B]"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-bold text-[#8C9A8C] dark:text-[#A3B18A] uppercase tracking-widest pl-2">App Appearance</h4>
        <div className="glass-card rounded-[28px] p-3 border border-white/70 space-y-1">
          <PreferenceItem 
            icon={<Eye size={20} />} 
            label="High Contrast Mode" 
            active={toggles.highContrast} 
            onToggle={() => handleToggle('highContrast')}
            color="bg-gray-50 dark:bg-gray-800 text-gray-500"
          />
          <PreferenceItem 
            icon={<Moon size={20} />} 
            label="Dark Theme" 
            active={toggles.dark} 
            onToggle={() => handleToggle('dark')}
            color="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-bold text-[#8C9A8C] dark:text-[#A3B18A] uppercase tracking-widest pl-2">More Options</h4>
        <div className="glass-card rounded-[28px] p-2 border border-white/70">
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors rounded-2xl">
            <span className="text-sm font-semibold text-[#3D4F3D] dark:text-[#E6E9E0]">Language Selection</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#8C9A8C] dark:text-[#A3B18A]">English (US)</span>
              <ChevronRight size={18} className="text-gray-300" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

interface PreferenceItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onToggle: () => void;
  color: string;
}

const PreferenceItem: React.FC<PreferenceItemProps> = ({ icon, label, active, onToggle, color }) => (
  <div className="flex items-center justify-between p-4 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors rounded-2xl">
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
        {icon}
      </div>
      <span className="text-sm font-semibold text-[#3D4F3D] dark:text-[#E6E9E0]">{label}</span>
    </div>
    <button 
      onClick={onToggle}
      className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${active ? 'bg-[#6B8E6B]' : 'bg-gray-200 dark:bg-gray-700'}`}
    >
      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${active ? 'translate-x-6' : ''}`} />
    </button>
  </div>
);

export default Preferences;
