
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, TrendingUp, Calendar, FileText, ChevronRight, X, ArrowLeft, ZoomIn } from 'lucide-react';
import { Expense, User } from '../types';

interface ExpensesProps {
  expenses: Expense[];
  user: User;
}

const Expenses: React.FC<ExpensesProps> = ({ expenses, user }) => {
  const navigate = useNavigate();
  const [selectedMonthFilter, setSelectedMonthFilter] = useState<string | null>(null);

  // Helper to get month name
  const getMonthName = (monthIdx: number) => {
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][monthIdx];
  };

  // Aggregate monthly data for chart (Last 6 months)
  const getMonthlyData = () => {
    const now = new Date();
    const currentMonthIndex = now.getMonth();
    const result = [];
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), currentMonthIndex - i, 1);
      const monthIdx = d.getMonth();
      const year = d.getFullYear();
      const monthKey = `${year}-${String(monthIdx + 1).padStart(2, '0')}`;
      
      const total = expenses
        .filter(e => e.date.startsWith(monthKey))
        .reduce((sum, e) => sum + e.amount, 0);
        
      result.push({ 
        name: getMonthName(monthIdx), 
        value: total, 
        key: monthKey,
        fullName: `${getMonthName(monthIdx)} ${year}`
      });
    }
    return result;
  };

  const chartData = getMonthlyData();
  const maxValue = Math.max(...chartData.map(d => d.value), 1000);
  
  const currentMonthKey = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
  const currentMonthTotal = expenses
    .filter(e => e.date.startsWith(currentMonthKey))
    .reduce((sum, e) => sum + e.amount, 0);

  const yearTotal = expenses
    .filter(e => new Date(e.date).getFullYear() === new Date().getFullYear())
    .reduce((sum, e) => sum + e.amount, 0);

  // Filtered entries based on selection
  const filteredExpenses = selectedMonthFilter 
    ? expenses.filter(e => e.date.startsWith(selectedMonthFilter))
    : expenses;

  const handleBarClick = (key: string) => {
    setSelectedMonthFilter(key);
  };

  const resetFilter = () => {
    setSelectedMonthFilter(null);
  };

  const getFilterLabel = () => {
    if (!selectedMonthFilter) return "All Time Register";
    const [year, month] = selectedMonthFilter.split('-');
    return `Register for ${getMonthName(parseInt(month) - 1)} ${year}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-10">
      
      {/* Admin Action: Add New Entry */}
      {user.role === 'admin' && (
        <button 
          onClick={() => navigate('/expenses/new')}
          className="w-full bg-[#6B8E6B] text-white p-5 rounded-[28px] flex items-center justify-between shadow-lg shadow-[#6B8E6B]/20 active:scale-95 transition-all mb-2"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Plus size={24} />
            </div>
            <div className="text-left">
              <h4 className="font-serif font-bold text-lg">Add New Entry</h4>
              <p className="text-xs text-white/70">Record a new society expense</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-white/70" />
        </button>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => handleBarClick(currentMonthKey)}
          className={`glass-card rounded-[28px] p-5 border text-left transition-all active:scale-95 ${selectedMonthFilter === currentMonthKey ? 'ring-2 ring-[#6B8E6B] border-[#6B8E6B]' : 'border-white/70'}`}
        >
          <div className="w-10 h-10 bg-[#6B8E6B]/10 text-[#6B8E6B] rounded-xl flex items-center justify-center mb-3">
            <Calendar size={20} />
          </div>
          <p className="text-[10px] font-bold text-[#8C9A8C] uppercase tracking-widest">This Month</p>
          <h3 className="text-xl font-serif font-bold text-[#3D4F3D]">₹ {currentMonthTotal.toLocaleString()}</h3>
        </button>
        <button 
          onClick={resetFilter}
          className={`glass-card rounded-[28px] p-5 border text-left transition-all active:scale-95 ${!selectedMonthFilter ? 'ring-2 ring-blue-500 border-blue-500' : 'border-white/70'}`}
        >
          <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mb-3">
            <TrendingUp size={20} />
          </div>
          <p className="text-[10px] font-bold text-[#8C9A8C] uppercase tracking-widest">Yearly Total</p>
          <h3 className="text-xl font-serif font-bold text-[#3D4F3D]">₹ {yearTotal.toLocaleString()}</h3>
        </button>
      </div>

      {/* Chart Section */}
      <div className="glass-card rounded-[32px] p-6 border border-white/70">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-sm font-bold text-[#3D4F3D] flex items-center gap-2">
            <TrendingUp size={16} className="text-[#6B8E6B]" />
            Expense Trends (Click bars to view)
          </h4>
          {selectedMonthFilter && (
            <button onClick={resetFilter} className="text-[10px] font-bold text-[#6B8E6B] underline">Show All</button>
          )}
        </div>
        <div className="flex items-end justify-between h-40 gap-2 px-2">
          {chartData.map((data, idx) => {
            const barHeight = Math.max((data.value / maxValue) * 140, 4);
            return (
              <div 
                key={idx} 
                className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                onClick={() => handleBarClick(data.key)}
              >
                <div className="relative w-full flex justify-center">
                  <div 
                    className={`w-full max-w-[24px] rounded-t-lg transition-all duration-500 ${
                      selectedMonthFilter === data.key ? 'bg-[#6B8E6B]' : 'bg-[#6B8E6B]/20 group-hover:bg-[#6B8E6B]/40'
                    }`}
                    style={{ height: `${barHeight}px` }}
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#3D4F3D] text-white text-[8px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      ₹{data.value.toLocaleString()}
                    </div>
                  </div>
                </div>
                <span className={`text-[10px] font-bold transition-colors ${selectedMonthFilter === data.key ? 'text-[#6B8E6B]' : 'text-[#8C9A8C]'}`}>
                  {data.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex flex-col">
            <button onClick={resetFilter} className="text-left group active:scale-95 transition-transform">
              <h4 className="text-lg font-serif font-bold text-[#3D4F3D] group-hover:text-[#6B8E6B] transition-colors">{getFilterLabel()}</h4>
            </button>
            {selectedMonthFilter && (
              <button 
                onClick={resetFilter}
                className="text-[10px] text-[#6B8E6B] font-bold flex items-center gap-1 mt-1"
              >
                <ArrowLeft size={10} /> Clear selection
              </button>
            )}
          </div>
          {/* Keep the small button for accessibility and quick access */}
          {user.role === 'admin' && (
            <button 
              onClick={() => navigate('/expenses/new')}
              className="bg-[#6B8E6B] text-white flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg shadow-[#6B8E6B]/20 active:scale-95 transition-all text-xs font-bold"
            >
              <Plus size={16} />
              Add Entry
            </button>
          )}
        </div>
        
        <div className="space-y-3">
          {filteredExpenses.length > 0 ? (
            filteredExpenses.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(expense => (
              <button 
                key={expense.id} 
                onClick={() => navigate(`/expenses/${expense.id}`)}
                className="w-full text-left glass-card rounded-[24px] p-4 border border-white/70 flex items-center justify-between group hover:bg-white/40 transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold ${
                    expense.category === 'Maintenance' ? 'bg-orange-50 text-orange-500' :
                    expense.category === 'Salary' ? 'bg-blue-50 text-blue-500' :
                    expense.category === 'Utility' ? 'bg-purple-50 text-purple-500' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {expense.category[0]}
                  </div>
                  <div>
                    <h5 className="font-semibold text-[#3D4F3D] text-sm">{expense.title}</h5>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-[#8C9A8C]">{new Date(expense.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                      <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                      <span className="text-[10px] text-[#8C9A8C] uppercase tracking-tighter">{expense.category}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-bold text-[#3D4F3D]">₹{expense.amount.toLocaleString()}</p>
                    <p className="text-[8px] font-bold text-[#6B8E6B] uppercase tracking-widest mt-0.5">Details</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-[#6B8E6B] transition-colors" />
                </div>
              </button>
            ))
          ) : (
            <div className="text-center py-12 glass-card rounded-[32px] border border-dashed border-gray-200">
              <p className="text-[#8C9A8C] font-serif italic">No entries found for this selection.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Expenses;
