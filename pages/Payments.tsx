
import React, { useRef, useState, useEffect } from 'react';
import { CreditCard, Check, AlertTriangle, Upload, ChevronRight, Wallet, CheckCircle2, FileText as FileIcon, Loader2 } from 'lucide-react';
import { api } from '../lib/api';
import { PaymentRecord } from '../types';

const Payments: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState('');

  useEffect(() => {
    const loadPayments = async () => {
      const data = await api.payments.list();
      setPayments(data);
      if (data.length > 0) setSelectedMonth(data[0].date);
      setLoading(false);
    };
    loadPayments();
  }, []);

  const currentPayment = payments.find(p => p.date === selectedMonth);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length && currentPayment) {
      const fileName = e.target.files[0].name;
      await api.payments.uploadProof(currentPayment.id, fileName);
      const updated = await api.payments.list();
      setPayments(updated);
      showToast(`Proof "${fileName}" uploaded successfully!`);
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-[#6B8E6B]" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Summary Card */}
      <div className="relative">
        <div className="bg-[#F2F2EB] dark:bg-[#242B24] rounded-t-[40px] p-8 pb-10 shadow-inner border-t border-white/50 space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#8C9A8C] font-medium">Monthly Charge</span>
            <span className="text-xl font-serif text-[#3D4F3D] dark:text-[#E6E9E0]">₹ {currentPayment?.amount.toLocaleString()}</span>
          </div>
          <div className="h-px bg-gray-200/50"></div>
          <div className="flex justify-between items-center">
            <span className="text-[#8C9A8C] font-semibold">Status</span>
            <span className={`${
              currentPayment?.status === 'Paid' ? 'bg-[#6B8E6B]/10 text-[#6B8E6B]' : 'bg-orange-50 text-[#DDA15E]'
            } px-4 py-1.5 rounded-full text-xs font-bold tracking-wide`}>
              {currentPayment?.status}
            </span>
          </div>
        </div>
        <div className="h-4 bg-[#F2F2EB] dark:bg-[#242B24] rounded-full w-[95%] mx-auto -mt-2 opacity-50"></div>
      </div>

      {/* Month Tabs */}
      <div className="flex justify-center gap-1 py-1 px-1 bg-gray-100/50 dark:bg-white/5 rounded-full w-fit mx-auto border border-white/20">
        {payments.map((p) => (
          <button 
            key={p.id}
            onClick={() => setSelectedMonth(p.date)}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              selectedMonth === p.date 
                ? 'bg-white dark:bg-gray-800 shadow-sm text-[#3D4F3D] dark:text-white font-bold' 
                : 'text-[#8C9A8C] hover:text-[#3D4F3D]'
            }`}
          >
            {p.date}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-serif font-bold text-[#3D4F3D] dark:text-[#E6E9E0]">Payment History</h4>
        <div className="glass-card rounded-[24px] p-5 shadow-sm border border-white/70 dark:border-white/10">
           <div className="flex justify-between items-start">
             <div>
               <p className="text-2xl font-serif font-bold text-[#3D4F3D] dark:text-[#E6E9E0]">₹ {currentPayment?.amount.toLocaleString()}</p>
               <p className="text-xs text-[#8C9A8C] mt-1">{currentPayment?.method} Payment • {currentPayment?.date}</p>
             </div>
             {currentPayment?.status === 'Paid' ? (
               <div className="w-10 h-10 bg-[#6B8E6B]/10 text-[#6B8E6B] rounded-full flex items-center justify-center">
                 <Check size={20} />
               </div>
             ) : (
               <div className="w-10 h-10 bg-orange-50 text-[#DDA15E] rounded-full flex items-center justify-center">
                 <AlertTriangle size={20} />
               </div>
             )}
           </div>
           
           {currentPayment?.proofUrl && (
             <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 flex items-center gap-2 text-[#6B8E6B] text-[11px] font-bold uppercase">
               <FileIcon size={14} />
               Proof: {currentPayment.proofUrl}
             </div>
           )}
        </div>

        {currentPayment?.status !== 'Paid' && (
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-[#6B8E6B] text-white rounded-[28px] p-6 flex items-center justify-between shadow-lg shadow-[#6B8E6B]/20 active:scale-95 transition-all group"
          >
            <div className="flex items-center gap-4">
              <Upload size={24} />
              <span className="font-serif font-semibold text-lg">Upload Payment Proof</span>
            </div>
            <ChevronRight size={20} />
          </button>
        )}
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,.pdf" />
      </div>

      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#3D4F3D] text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl z-50 animate-in slide-in-from-bottom-10">
          <CheckCircle2 size={18} className="text-[#6B8E6B]" />
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}
    </div>
  );
};

export default Payments;
