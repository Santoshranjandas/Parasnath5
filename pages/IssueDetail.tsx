
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, MessageSquare, CheckCircle, ArrowLeft, History, AlertCircle } from 'lucide-react';
import { Issue } from '../types';

interface IssueDetailProps {
  issues: Issue[];
}

const IssueDetail: React.FC<IssueDetailProps> = ({ issues }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const issue = issues.find(i => i.id === id);

  if (!issue) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle size={48} className="text-gray-200 mb-4" />
        <h3 className="text-xl font-serif text-[#3D4F3D] font-bold">Complaint Not Found</h3>
        <button 
          onClick={() => navigate('/issues')}
          className="mt-6 flex items-center gap-2 text-[#6B8E6B] font-bold"
        >
          <ArrowLeft size={18} /> Back to Issues
        </button>
      </div>
    );
  }

  const isResolved = issue.status === 'Resolved';

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header Info */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
            isResolved ? 'bg-[#6B8E6B]/10 text-[#6B8E6B]' : 'bg-orange-50 text-orange-500'
          }`}>
            {issue.status}
          </span>
          <span className="text-[10px] text-[#8C9A8C] font-bold uppercase tracking-widest">Ticket #{issue.id}</span>
        </div>
        <h1 className="text-2xl font-serif font-bold text-[#3D4F3D] leading-tight mb-2">
          {issue.title}
        </h1>
        <div className="flex items-center gap-2 text-xs text-[#8C9A8C]">
          <span className="bg-gray-100 px-2 py-0.5 rounded font-bold uppercase">{issue.category}</span>
          <span>•</span>
          <span>Submitted on {issue.createdAt}</span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Description Section */}
        <div className="glass-card rounded-[32px] p-6 border border-white/70 space-y-4">
          <div className="flex items-center gap-2 text-[#8C9A8C]">
            <MessageSquare size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Complaint Details</span>
          </div>
          <p className="text-sm text-[#3D4F3D]/80 leading-relaxed font-light">
            {issue.description}
          </p>
        </div>

        {/* Resolution Section (if any) */}
        {isResolved && (
          <div className="bg-[#6B8E6B]/5 rounded-[32px] p-6 border border-[#6B8E6B]/20 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#6B8E6B]">
                <CheckCircle size={18} />
                <span className="text-xs font-bold uppercase tracking-wider">Resolution Update</span>
              </div>
              <span className="text-[10px] text-[#6B8E6B]/60 font-medium italic">{issue.resolvedAt}</span>
            </div>
            <p className="text-sm text-[#3D4F3D] leading-relaxed font-semibold italic">
              "{issue.resolution || 'The issue has been successfully resolved by our maintenance team.'}"
            </p>
            <div className="pt-2">
              <button className="text-[10px] text-[#6B8E6B] font-bold uppercase underline tracking-tighter hover:opacity-70 transition-opacity">
                Rate this Resolution
              </button>
            </div>
          </div>
        )}

        {/* Status Timeline */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2 text-[#8C9A8C] px-2">
            <History size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Ticket Timeline</span>
          </div>
          <div className="space-y-6 relative pl-4">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-100" />
            
            {isResolved && (
              <TimelineItem 
                title="Resolution Applied" 
                subtitle={issue.resolvedAt || 'N/A'} 
                active 
                success 
              />
            )}
            
            <TimelineItem 
              title="Work In Progress" 
              subtitle="Technician assigned to inspect" 
              active={issue.status !== 'Pending'} 
            />
            
            <TimelineItem 
              title="Ticket Received" 
              subtitle={issue.createdAt} 
              active 
            />
          </div>
        </div>

        <button 
          onClick={() => navigate('/issues')}
          className="w-full bg-white/60 border border-white text-[#3D4F3D] py-4 rounded-[24px] font-bold shadow-sm hover:bg-white active:scale-95 transition-all flex items-center justify-center gap-2 mt-8"
        >
          <ArrowLeft size={18} />
          Back to Issues
        </button>
      </div>
    </div>
  );
};

const TimelineItem = ({ title, subtitle, active, success }: { title: string, subtitle: string, active?: boolean, success?: boolean }) => (
  <div className="relative pl-8 flex flex-col gap-0.5">
    <div className={`absolute left-[-4.5px] top-1.5 w-2.5 h-2.5 rounded-full z-10 ${
      success ? 'bg-[#6B8E6B] shadow-[0_0_8px_rgba(107,142,107,0.5)]' : 
      active ? 'bg-[#6B8E6B]' : 'bg-gray-200'
    }`} />
    <span className={`text-xs font-bold ${active ? 'text-[#3D4F3D]' : 'text-gray-300'}`}>{title}</span>
    <span className="text-[10px] text-[#8C9A8C]">{subtitle}</span>
  </div>
);

export default IssueDetail;
