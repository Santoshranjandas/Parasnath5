
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Clock, CheckCircle } from 'lucide-react';
import { Issue } from '../types';

interface IssuesProps {
  issues: Issue[];
}

const Issues: React.FC<IssuesProps> = ({ issues }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-10">
      
      <button 
        onClick={() => navigate('/issues/new')}
        className="w-full bg-[#6B8E6B] text-white rounded-[24px] p-6 flex items-center justify-between shadow-lg shadow-[#6B8E6B]/20 hover:scale-[1.02] active:scale-95 transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
            <Plus size={24} />
          </div>
          <div className="text-left">
            <h4 className="font-serif font-bold text-lg">Raise New Complaint</h4>
            <p className="text-xs text-white/70">Let us help resolve your issue</p>
          </div>
        </div>
      </button>

      <div className="space-y-4">
        <h4 className="text-lg font-serif font-bold text-[#3D4F3D]">Recent Complaints</h4>
        
        <div className="space-y-3">
          {issues.length > 0 ? (
            issues.map((issue) => (
              <div 
                key={issue.id} 
                onClick={() => navigate(`/issues/${issue.id}`)}
                className="glass-card rounded-[24px] p-5 shadow-sm border border-white/70 cursor-pointer hover:bg-white/40 active:scale-[0.98] transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h5 className="font-semibold text-[#3D4F3D] line-clamp-1">{issue.title}</h5>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-bold uppercase tracking-tight">
                        {issue.category}
                      </span>
                      <p className="text-[10px] text-[#8C9A8C] font-bold uppercase tracking-widest">Ticket #{issue.id}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide flex-shrink-0 ${
                    issue.status === 'Resolved' ? 'bg-[#6B8E6B]/20 text-[#6B8E6B]' : 
                    issue.status === 'In Progress' ? 'bg-orange-50 text-orange-500' : 
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {issue.status}
                  </span>
                </div>
                
                <p className="text-xs text-[#3D4F3D]/60 line-clamp-1 mb-3">
                  {issue.description}
                </p>

                <div className="flex justify-between items-center pt-3 mt-1 border-t border-gray-50 text-[11px] text-[#8C9A8C]">
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>Submitted on {issue.createdAt}</span>
                  </div>
                  {issue.status === 'Resolved' && (
                    <div className="flex items-center gap-1 text-[#6B8E6B]">
                      <CheckCircle size={12} />
                      <span className="font-bold">Check Status</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-[#8C9A8C] italic font-serif">
              No complaints found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Issues;
