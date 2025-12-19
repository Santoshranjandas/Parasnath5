
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Upload, CheckCircle2, DollarSign, FileText, User as UserIcon, ChevronDown, AlertCircle } from 'lucide-react';
import { Expense, User } from '../types';
import { api } from '../lib/api';

interface ExpenseNewProps {
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  user: User;
}

type ApprovalRole = 'Secretary' | 'Chairman' | 'Treasurer' | 'Other';

const ExpenseNew: React.FC<ExpenseNewProps> = ({ setExpenses, user }) => {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Maintenance' as Expense['category'],
    date: new Date().toISOString().split('T')[0],
    proofName: '',
  });

  const [approvalRole, setApprovalRole] = useState<ApprovalRole>('Secretary');
  const [otherApproverName, setOtherApproverName] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUploadClick = (e: React.MouseEvent) => {
    e.preventDefault(); 
    fileRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, proofName: file.name }));
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validation
    const amountNum = parseFloat(formData.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    if (!formData.proofName) {
      setError("Please upload a receipt proof.");
      return;
    }

    if (approvalRole === 'Other' && !otherApproverName.trim()) {
      setError("Please enter the authority name.");
      return;
    }

    setLoading(true);

    const finalRecordedBy = approvalRole === 'Other' 
      ? otherApproverName.trim() 
      : approvalRole;
    
    try {
      const newExpense = await api.expenses.create({
        title: formData.title,
        amount: amountNum,
        category: formData.category,
        date: formData.date,
        proofUrl: 'https://picsum.photos/seed/' + Date.now() + '/600/800',
        recordedBy: finalRecordedBy
      });

      setExpenses(prev => [newExpense, ...prev]);
      setShowSuccessToast(true);
      
      setTimeout(() => {
        navigate('/expenses');
      }, 2000);
    } catch (err) {
      setError("Failed to save expense. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="mb-6">
        <h2 className="text-2xl font-serif font-bold text-[#3D4F3D] dark:text-[#E6E9E0]">New Expense</h2>
        <p className="text-sm text-[#8C9A8C] dark:text-[#A3B18A]">Record a society expenditure</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 animate-in slide-in-from-top-2">
          <AlertCircle size={18} />
          <span className="text-sm font-bold">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-card rounded-[32px] p-6 sm:p-8 space-y-5 border border-white/70 shadow-sm">
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#8C9A8C] uppercase tracking-wider px-1">Expense Title</label>
            <div className="relative">
              <FileText size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C9A8C]" />
              <input
                type="text"
                required
                placeholder="e.g. Lift Cable Repair"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full bg-white/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#6B8E6B]/20 focus:outline-none dark:text-[#E6E9E0]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#8C9A8C] uppercase tracking-wider px-1">Amount (₹)</label>
              <div className="relative">
                <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C9A8C]" />
                <input
                  type="number"
                  required
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                  className="w-full bg-white/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-3.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#6B8E6B]/20 focus:outline-none dark:text-[#E6E9E0]"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#8C9A8C] uppercase tracking-wider px-1">Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
                className="w-full bg-white/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-3.5 px-4 text-sm focus:ring-2 focus:ring-[#6B8E6B]/20 focus:outline-none dark:text-[#E6E9E0]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#8C9A8C] uppercase tracking-wider px-1">Approved By</label>
            <div className="relative">
              <UserIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C9A8C] z-10" />
              <select
                value={approvalRole}
                onChange={e => setApprovalRole(e.target.value as ApprovalRole)}
                className="w-full bg-white/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-3.5 pl-12 pr-10 text-sm focus:ring-2 focus:ring-[#6B8E6B]/20 focus:outline-none appearance-none dark:text-[#E6E9E0]"
              >
                <option value="Secretary">Secretary</option>
                <option value="Chairman">Chairman</option>
                <option value="Treasurer">Treasurer</option>
                <option value="Other">Other</option>
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8C9A8C] pointer-events-none" />
            </div>
          </div>

          {approvalRole === 'Other' && (
            <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
              <label className="text-xs font-bold text-[#8C9A8C] uppercase tracking-wider px-1">Authority Name</label>
              <input
                type="text"
                required
                placeholder="Enter Name / Position"
                value={otherApproverName}
                onChange={e => setOtherApproverName(e.target.value)}
                className="w-full bg-white/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-3.5 px-4 text-sm focus:ring-2 focus:ring-[#6B8E6B]/20 focus:outline-none dark:text-[#E6E9E0]"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#8C9A8C] uppercase tracking-wider px-1">Category</label>
            <div className="flex flex-wrap gap-2">
              {(['Utility', 'Salary', 'Maintenance', 'Security', 'Event', 'Other'] as const).map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFormData({...formData, category: cat})}
                  className={`px-3 py-2 rounded-xl text-[10px] font-bold transition-all border ${
                    formData.category === cat 
                    ? 'bg-[#6B8E6B] text-white border-[#6B8E6B] shadow-md scale-105' 
                    : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 text-[#8C9A8C]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <label className="text-xs font-bold text-[#8C9A8C] uppercase tracking-wider px-1 mb-2 block">Upload Proof (Receipt/Bill)</label>
            <button
              type="button"
              onClick={handleUploadClick}
              className={`w-full py-10 border-2 border-dashed rounded-[32px] flex flex-col items-center justify-center gap-3 transition-all active:scale-[0.98] ${
                formData.proofName 
                  ? 'bg-[#6B8E6B]/10 border-[#6B8E6B] text-[#6B8E6B]' 
                  : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-[#8C9A8C]'
              }`}
            >
              <Upload size={32} className={formData.proofName ? 'text-[#6B8E6B]' : 'text-gray-400'} />
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-wide">
                  {formData.proofName ? formData.proofName : 'Click to Upload Receipt'}
                </p>
                <p className="text-[10px] opacity-70 mt-1">Images or PDF accepted • Max 5MB</p>
              </div>
            </button>
            <input 
              type="file" 
              ref={fileRef} 
              className="hidden" 
              accept="image/*,application/pdf"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/expenses')}
            className="flex-1 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-[#8C9A8C] py-4 rounded-[24px] font-bold active:scale-95 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-[2] bg-[#6B8E6B] text-white py-4 rounded-[24px] font-bold shadow-xl shadow-[#6B8E6B]/20 flex items-center justify-center gap-2 hover:bg-[#5a7a5a] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Saving...
              </span>
            ) : (
              <><Save size={18} /> Record Expense</>
            )}
          </button>
        </div>
      </form>

      {/* Success Notification */}
      {showSuccessToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-[#3D4F3D] text-white px-8 py-4 rounded-full flex items-center gap-4 shadow-2xl z-[100] animate-in slide-in-from-bottom-10 duration-500">
          <div className="w-8 h-8 bg-[#6B8E6B] rounded-full flex items-center justify-center">
            <CheckCircle2 size={20} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight">Record saved successfully!</span>
            <span className="text-[10px] opacity-70 uppercase font-bold tracking-widest">Register Updated</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseNew;
