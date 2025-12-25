import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  AlertCircle, 
  TrendingUp, 
  Wallet, 
  UserCheck, 
  Plus, 
  Megaphone, 
  FileText, 
  Check, 
  X,
  Loader2,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { api } from '../lib/api';
import { User, SystemLog } from '../types';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    residents: 0,
    pending_issues: 0,
    monthly_collection: 0,
    pending_approvals: 0
  });
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const [s, u, l] = await Promise.all([
          api.admin.getStats(),
          api.admin.getPendingUsers(),
          api.admin.getLogs()
        ]);
        setStats(s);
        setPendingUsers(u);
        setLogs(l);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadAdminData();
  }, []);

  const handleApproveUser = (id: string, name: string) => {
    // In a real app, call API to verify
    setPendingUsers(prev => prev.filter(u => u.id !== id));
    setStats(prev => ({ ...prev, residents: prev.residents + 1, pending_approvals: prev.pending_approvals - 1 }));
    setToast(`${name} has been approved.`);
    setTimeout(() => setToast(null), 3000);
  };

  const handleRejectUser = (id: string) => {
    setPendingUsers(prev => prev.filter(u => u.id !== id));
    setStats(prev => ({ ...prev, pending_approvals: prev.pending_approvals - 1 }));
  };

  if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-[#6B8E6B]" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
      
      {/* Alert Header if pending approvals */}
      {stats.pending_approvals > 0 && (
        <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20 p-4 rounded-[24px] flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 bg-orange-100 dark:bg-orange-800/30 text-orange-600 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h4 className="font-bold text-[#3D4F3D] dark:text-[#E6E9E0] text-sm">Action Required</h4>
            <p className="text-xs text-[#8C9A8C] dark:text-[#A3B18A]">{stats.pending_approvals} new residents waiting for approval.</p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={<Users size={18} />} label="Total Residents" value={stats.residents.toString()} color="bg-blue-50 text-blue-600" />
        <StatCard icon={<Wallet size={18} />} label="This Month" value={`₹${(stats.monthly_collection/1000).toFixed(1)}k`} color="bg-green-50 text-green-600" />
        <StatCard icon={<AlertCircle size={18} />} label="Open Tickets" value={stats.pending_issues.toString()} color="bg-orange-50 text-orange-600" />
        <StatCard icon={<TrendingUp size={18} />} label="Cash Flow" value="+12%" color="bg-purple-50 text-purple-600" />
      </div>

      {/* Pending Approvals Section */}
      {pendingUsers.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-sm font-bold text-[#8C9A8C] uppercase tracking-widest">Resident Verification</h4>
          </div>
          <div className="space-y-3">
            {pendingUsers.map(user => (
              <div key={user.id} className="glass-card rounded-[24px] p-4 flex items-center justify-between border border-white/70 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold text-sm">
                    {user.fullName.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-bold text-[#3D4F3D] dark:text-[#E6E9E0] text-sm">{user.fullName}</h5>
                    <p className="text-[10px] text-[#8C9A8C] font-bold">Flat {user.flatId} • {user.phone}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleRejectUser(user.id)}
                    className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                  >
                    <X size={16} />
                  </button>
                  <button 
                    onClick={() => handleApproveUser(user.id, user.fullName)}
                    className="w-8 h-8 rounded-full bg-[#6B8E6B] text-white flex items-center justify-center hover:bg-[#5a7a5a] shadow-lg shadow-[#6B8E6B]/20 transition-colors"
                  >
                    <Check size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-[#8C9A8C] uppercase tracking-widest px-2">Administrative Actions</h4>
        <div className="grid grid-cols-2 gap-3">
          <QuickAction 
            icon={<Megaphone size={24} />} 
            label="Post Notice" 
            desc="Broadcast to all" 
            onClick={() => {
                // Since we don't have a dedicated Create Notice page yet, alert the user or redirect
                alert("Feature coming soon: Broadcast Announcement Modal");
            }} 
            color="bg-indigo-50 text-indigo-600" 
          />
          <QuickAction 
            icon={<FileText size={24} />} 
            label="Add Expense" 
            desc="Record spending" 
            onClick={() => navigate('/expenses/new')} 
            color="bg-emerald-50 text-emerald-600" 
          />
          <QuickAction 
            icon={<UserCheck size={24} />} 
            label="Add Vendor" 
            desc="Service providers" 
            onClick={() => navigate('/vendors/new')} 
            color="bg-amber-50 text-amber-600" 
          />
          <QuickAction 
            icon={<Plus size={24} />} 
            label="New Task" 
            desc="Internal todo" 
            onClick={() => alert("Task creation modal")} 
            color="bg-pink-50 text-pink-600" 
          />
        </div>
      </div>

      {/* System Logs */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-[#8C9A8C] uppercase tracking-widest px-2">Live Activity Log</h4>
        <div className="glass-card rounded-[28px] p-5 border border-white/70 space-y-6 relative">
          <div className="absolute left-[29px] top-6 bottom-6 w-px bg-gray-100 dark:bg-white/5"></div>
          {logs.map((log) => (
            <div key={log.id} className="relative pl-8 flex flex-col gap-0.5">
               <div className={`absolute left-0 top-1 w-2.5 h-2.5 rounded-full z-10 border-2 border-white dark:border-[#242B24] ${
                 log.type === 'alert' ? 'bg-orange-500' : 
                 log.type === 'success' ? 'bg-[#6B8E6B]' : 'bg-blue-400'
               }`}></div>
               <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-[#3D4F3D] dark:text-[#E6E9E0] leading-tight">{log.action}</span>
                  <span className="text-[9px] text-[#8C9A8C] whitespace-nowrap">{log.time}</span>
               </div>
               <span className="text-[10px] text-[#8C9A8C]">{log.user}</span>
            </div>
          ))}
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#3D4F3D] text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl z-50 animate-in slide-in-from-bottom-10">
          <Check size={16} className="text-[#6B8E6B]" />
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value, color }: { icon: any, label: string, value: string, color: string }) => (
  <div className="glass-card rounded-[24px] p-4 border border-white/70 shadow-sm flex flex-col justify-between h-28">
    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-bold text-[#8C9A8C] uppercase tracking-wider">{label}</p>
      <p className="text-xl font-serif font-bold text-[#3D4F3D] dark:text-[#E6E9E0]">{value}</p>
    </div>
  </div>
);

const QuickAction = ({ icon, label, desc, onClick, color }: { icon: any, label: string, desc: string, onClick: () => void, color: string }) => (
  <button 
    onClick={onClick}
    className="glass-card rounded-[24px] p-4 border border-white/70 shadow-sm text-left hover:bg-white/40 active:scale-95 transition-all flex flex-col gap-3"
  >
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div>
      <h5 className="font-bold text-[#3D4F3D] dark:text-[#E6E9E0] text-sm">{label}</h5>
      <p className="text-[10px] text-[#8C9A8C]">{desc}</p>
    </div>
  </button>
);

export default AdminDashboard;
