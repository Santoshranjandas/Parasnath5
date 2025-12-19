
import React, { useState, useRef } from 'react';
import { Calendar, Users, Upload, Download, ChevronRight, FileText, File, CheckCircle2 } from 'lucide-react';

const AGM: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [toast, setToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      showToast(`Successfully uploaded: ${e.target.files[0].name}`);
    }
  };

  const handleDownloadAll = () => {
    showToast("Preparing archive... Download started.");
  };

  const handleDocClick = (title: string) => {
    showToast(`Downloading ${title}...`);
  };

  const yearData: Record<number, { status: string, attendance: { present: number, absent: number }, venue: string }> = {
    2025: { status: 'Upcoming', attendance: { present: 0, absent: 72 }, venue: 'TBD' },
    2024: { status: 'Active', attendance: { present: 54, absent: 18 }, venue: 'Clubhouse Hall' },
    2023: { status: 'Completed', attendance: { present: 60, absent: 12 }, venue: 'Society Garden' },
  };

  const currentData = yearData[selectedYear] || yearData[2024];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-10">
      {/* Year Selector */}
      <div className="flex justify-center gap-4 py-2">
        {[2025, 2024, 2023].map((year) => (
          <button 
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`px-6 py-2 rounded-full transition-all duration-300 font-medium ${
              selectedYear === year 
                ? 'bg-[#6B8E6B] text-white shadow-lg shadow-[#6B8E6B]/20 px-8' 
                : 'text-[#8C9A8C] hover:bg-white hover:text-[#6B8E6B]'
            }`}
          >
            {year}
          </button>
        ))}
      </div>

      {/* Main Info Card */}
      <div className="relative">
        <div className="bg-[#F2F2EB] rounded-t-[40px] p-8 pb-12 shadow-inner border-t border-white">
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#8C9A8C] shadow-sm">
                <Calendar size={24} />
              </div>
              <div>
                <h3 className="text-xl font-serif font-semibold text-[#3D4F3D]">
                  {selectedYear === 2024 ? '3rd March 2024' : selectedYear === 2025 ? 'TBD' : '15th March 2023'} 
                  <span className="text-base font-normal text-gray-400"> ({selectedYear === 2024 ? 'Sunday' : 'Saturday'})</span>
                </h3>
                <p className="text-sm text-[#8C9A8C]">{currentData.venue}</p>
                <p className="text-base text-[#8C9A8C] mt-1 font-bebas tracking-wider uppercase">Parasnath Nagari Building No 5</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${
              currentData.status === 'Active' ? 'bg-[#6B8E6B]/20 text-[#6B8E6B]' : 
              currentData.status === 'Upcoming' ? 'bg-blue-50 text-blue-500' : 'bg-gray-100 text-gray-500'
            }`}>
              {currentData.status}
            </span>
          </div>

          <div className="bg-white/40 p-3 rounded-2xl border border-white/50 text-xs text-[#8C9A8C] text-center italic">
            {currentData.status === 'Upcoming' 
              ? 'Notice will be issued soon' 
              : `Quorum: Reached with ${currentData.attendance.present} out of 72 members`}
          </div>
        </div>
        
        {/* Attendance Bar */}
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-5 w-[85%] bg-white rounded-full py-3 px-6 shadow-xl flex justify-between items-center text-sm font-semibold z-10 border border-white/80">
          <div className="flex items-center gap-2 text-[#6B8E6B]">
             <span className="text-xl">🍃</span> {currentData.attendance.present} Present
          </div>
          <div className="w-px h-6 bg-gray-100"></div>
          <div className="flex items-center gap-2 text-[#BC6C25]">
             <span className="text-xl">🍂</span> {currentData.attendance.absent} Absent
          </div>
        </div>
      </div>

      <div className="pt-8 space-y-6">
        <div>
          <h4 className="text-lg font-serif font-bold text-[#3D4F3D] mb-4">Agenda</h4>
          <div className="space-y-4">
            {[
              { title: 'Increase Monthly Maintenance', status: 'Approved', progress: 82, yes: 82, no: 9 },
              { title: 'CCTV Camera Upgrade', status: 'Rejected', progress: 61, yes: 61, no: 20 },
              { title: 'Play Area Renovation', status: 'Deferred', progress: 37, yes: 37, no: 32 },
            ].map((item, i) => (
              <div key={i} className="glass-card rounded-[28px] p-5 shadow-sm border border-white/70">
                <div className="flex justify-between items-start mb-1">
                  <h5 className="font-semibold text-[#3D4F3D]">{item.title}</h5>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wide ${
                    item.status === 'Approved' ? 'bg-[#6B8E6B]/10 text-[#6B8E6B]' :
                    item.status === 'Rejected' ? 'bg-red-50 text-red-400' : 'bg-orange-50 text-orange-400'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-[10px] text-[#8C9A8C] mb-4 uppercase tracking-wider">Proposed: {selectedYear === 2024 ? '3 Mar 2024' : 'N/A'}</p>
                
                <div className="flex items-center gap-4 text-[10px] text-[#8C9A8C]">
                  <span className="w-6">Yes</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${item.status === 'Approved' ? 'bg-[#6B8E6B]' : item.status === 'Rejected' ? 'bg-orange-400' : 'bg-[#DDA15E]'}`}
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                  <span className="w-16 text-right font-medium text-gray-700">{item.yes}%</span>
                </div>
                <div className="flex justify-end mt-1">
                  <span className="text-[10px] text-[#8C9A8C]">No: {item.no} ({100 - item.yes}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-serif font-bold text-[#3D4F3D]">AGM Documents</h4>
            <div className="flex gap-4 text-xs font-semibold text-[#8C9A8C]">
              <button 
                onClick={handleUploadClick}
                className="flex items-center gap-1 hover:text-[#6B8E6B] transition-colors"
              >
                <Upload size={14} /> Upload
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
              />
              <span className="text-gray-200">|</span>
              <button 
                onClick={handleDownloadAll}
                className="flex items-center gap-1 hover:text-[#6B8E6B] transition-colors"
              >
                <Download size={14} /> Download All
              </button>
            </div>
          </div>
          
          <div className="space-y-3">
            {[
              { title: 'Minutes of Meeting', date: `${selectedYear === 2024 ? '3rd March 2024' : 'Past Year'}`, icon: FileText },
              { title: 'Balance Sheet', date: `${selectedYear === 2024 ? '3rd March 2024' : 'Past Year'}`, icon: File },
              { title: 'Audit Report', date: `${selectedYear === 2024 ? '3rd March 2024' : 'Past Year'}`, icon: FileText, pdf: true },
            ].map((doc, i) => (
              <button 
                key={i} 
                onClick={() => handleDocClick(doc.title)}
                className="w-full glass-card rounded-[20px] p-4 flex items-center justify-between shadow-sm border border-white/60 hover:bg-white/80 transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100 relative">
                    <doc.icon size={20} />
                    {doc.pdf && <span className="absolute bottom-1 right-1 bg-green-100 text-[8px] px-1 rounded font-bold text-green-700">PDF</span>}
                  </div>
                  <div>
                    <h5 className="font-semibold text-[#3D4F3D] text-sm">{doc.title}</h5>
                    <p className="text-[11px] text-[#8C9A8C]">{doc.date}</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-300" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Toast Feedback */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#3D4F3D] text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl z-50 animate-in slide-in-from-bottom-10 duration-300">
          <CheckCircle2 size={18} className="text-[#6B8E6B]" />
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}
    </div>
  );
};

export default AGM;
