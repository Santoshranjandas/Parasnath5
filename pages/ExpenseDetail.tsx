import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, CheckCircle2, DollarSign, ZoomIn } from 'lucide-react';
import { Expense } from '../types';

interface ExpenseDetailProps {
  expenses: Expense[];
}

const ExpenseDetail: React.FC<ExpenseDetailProps> = ({ expenses }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const expense = expenses.find(e => e.id === id);

  if (!expense) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h3 className="text-xl font-serif text-[#3D4F3D] font-bold">Expense Record Not Found</h3>
        <button 
          onClick={() => navigate('/expenses')}
          className="mt-6 flex items-center gap-2 text-[#6B8E6B] font-bold active:scale-95 transition-transform"
        >
          <ArrowLeft size={18} /> Back to Register
        </button>
      </div>
    );
  }

  const getCategoryStyles = (category: string) => {
    switch(category) {
      case 'Maintenance':
      case 'Repairs':
        return 'bg-orange-50 text-orange-500';
      case 'Salaries':
      case 'Admin Costs':
      case 'Security':
        return 'bg-blue-50 text-blue-500';
      case 'Utilities':
      case 'Groceries':
        return 'bg-purple-50 text-purple-500';
      case 'Events':
        return 'bg-pink-50 text-pink-500';
      default:
        return 'bg-gray-100 text-gray-500';
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider ${getCategoryStyles(expense.category)}`}>
            {expense.category}
          </span>
          <span className="text-[10px] text-[#8C9A8C] font-bold uppercase tracking-widest">Entry #{expense.id}</span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-[#3D4F3D] leading-tight mb-4">
          {expense.title}
        </h1>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card rounded-[24px] p-4 border border-white/70">
            <p className="text-[10px] font-bold text-[#8C9A8C] uppercase tracking-widest mb-1">Amount</p>
            <p className="text-2xl font-serif font-bold text-[#3D4F3D]">₹ {expense.amount.toLocaleString()}</p>
          </div>
          <div className="glass-card rounded-[24px] p-4 border border-white/70">
            <p className="text-[10px] font-bold text-[#8C9A8C] uppercase tracking-widest mb-1">Date</p>
            <p className="text-lg font-bold text-[#3D4F3D]">{new Date(expense.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Verification Status */}
        <div className="bg-[#6B8E6B]/5 rounded-[28px] p-5 border border-[#6B8E6B]/20 flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#6B8E6B] shadow-sm">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#8C9A8C] uppercase tracking-wider">Approved By</p>
            <p className="text-sm font-bold text-[#3D4F3D]">{expense.recordedBy || 'Society Treasurer'}</p>
          </div>
        </div>

        {/* Receipt Preview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-sm font-bold text-[#3D4F3D] uppercase tracking-widest">Receipt Proof</h4>
            <div className="flex items-center gap-1 text-[#6B8E6B] text-[10px] font-bold uppercase">
              <ZoomIn size={12} /> Click to enlarge
            </div>
          </div>
          <div className="glass-card rounded-[32px] overflow-hidden border border-white/70 shadow-sm relative group cursor-pointer">
            <img 
              src={expense.proofUrl.startsWith('http') ? expense.proofUrl : `https://picsum.photos/seed/${expense.id}/600/800`} 
              alt="Receipt" 
              className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-[#3D4F3D] shadow-xl">
                View Full Document
              </div>
            </div>
          </div>
        </div>

        {/* Audit Info */}
        <div className="glass-card rounded-[28px] p-6 border border-white/70 space-y-4">
          <div className="flex items-center gap-2 text-[#8C9A8C]">
            <FileText size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Audit Trail</span>
          </div>
          <div className="space-y-3">
             <div className="flex justify-between text-xs">
                <span className="text-[#8C9A8C]">Record Created</span>
                <span className="text-[#3D4F3D] font-medium">{expense.date}</span>
             </div>
             <div className="flex justify-between text-xs">
                <span className="text-[#8C9A8C]">Verified By</span>
                <span className="text-[#3D4F3D] font-medium">{expense.recordedBy}</span>
             </div>
             <div className="flex justify-between text-xs">
                <span className="text-[#8C9A8C]">Source</span>
                <span className="text-[#3D4F3D] font-medium uppercase tracking-tighter">Digital Entry</span>
             </div>
          </div>
        </div>

        <button 
          onClick={() => navigate('/expenses')}
          className="w-full bg-white/60 border border-white text-[#3D4F3D] py-4 rounded-[24px] font-bold shadow-sm hover:bg-white active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
        >
          <ArrowLeft size={18} />
          Back to Expenses
        </button>
      </div>
    </div>
  );
};

export default ExpenseDetail;
