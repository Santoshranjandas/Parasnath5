
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Phone, Mail, User as UserIcon, Calendar, ArrowLeft, Shield, Clock, FileText, ExternalLink } from 'lucide-react';
import { Vendor } from '../types';

interface VendorDetailProps {
  vendors: Vendor[];
}

const VendorDetail: React.FC<VendorDetailProps> = ({ vendors }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const vendor = vendors.find(v => v.id === id);

  if (!vendor) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h3 className="text-xl font-serif text-[#3D4F3D] font-bold">Vendor Not Found</h3>
        <button onClick={() => navigate('/vendors')} className="mt-6 text-[#6B8E6B] font-bold flex items-center gap-2">
          <ArrowLeft size={18} /> Back to Vendors
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
            vendor.status === 'Active' ? 'bg-[#6B8E6B]/10 text-[#6B8E6B]' : 
            vendor.status === 'Expiring' ? 'bg-orange-50 text-orange-500' : 'bg-red-50 text-red-500'
          }`}>
            {vendor.status}
          </span>
          <span className="text-[10px] text-[#8C9A8C] font-bold uppercase tracking-widest">ID: VEN-{vendor.id}</span>
        </div>
        <h1 className="text-2xl font-serif font-bold text-[#3D4F3D] leading-tight mb-1">{vendor.name}</h1>
        <p className="text-[#8C9A8C] font-semibold uppercase text-xs tracking-wider">{vendor.service}</p>
      </div>

      <div className="space-y-6">
        {/* About Section */}
        <div className="glass-card rounded-[32px] p-6 border border-white/70 space-y-4">
          <div className="flex items-center gap-2 text-[#8C9A8C]">
            <FileText size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">About Services</span>
          </div>
          <p className="text-sm text-[#3D4F3D]/80 leading-relaxed font-light">
            {vendor.description || 'Professional maintenance services dedicated to ensuring operational excellence at Parasnath Nagari.'}
          </p>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-[#8C9A8C] uppercase tracking-widest px-2">Contact Details</h4>
          <div className="glass-card rounded-[32px] p-4 border border-white/70 space-y-1">
            <ContactRow icon={<UserIcon size={18} />} label="Contact Person" value={vendor.contactPerson || 'N/A'} />
            <div className="h-px bg-gray-50 mx-4 my-1" />
            <ContactRow 
              icon={<Phone size={18} />} 
              label="Phone" 
              value={vendor.phone || 'N/A'} 
              action={() => window.location.href = `tel:${vendor.phone}`}
            />
            <div className="h-px bg-gray-50 mx-4 my-1" />
            <ContactRow 
              icon={<Mail size={18} />} 
              label="Email" 
              value={vendor.email || 'N/A'} 
              action={() => window.location.href = `mailto:${vendor.email}`}
            />
          </div>
        </div>

        {/* Contract Info */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-[#8C9A8C] uppercase tracking-widest px-2">Contract Period</h4>
          <div className="glass-card rounded-[32px] p-6 border border-white/70">
            <div className="flex items-center justify-between mb-6">
              <div className="text-center">
                <p className="text-[10px] text-[#8C9A8C] uppercase font-bold mb-1">Starts</p>
                <p className="text-sm font-bold text-[#3D4F3D]">{vendor.contractStart}</p>
              </div>
              <div className="flex-1 flex items-center px-4">
                <div className="h-0.5 bg-gray-100 flex-1 relative">
                  <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${vendor.status === 'Active' ? 'bg-[#6B8E6B]' : 'bg-gray-300'}`} />
                  <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${vendor.status === 'Expired' ? 'bg-red-500' : 'bg-gray-300'}`} />
                </div>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-[#8C9A8C] uppercase font-bold mb-1">Ends</p>
                <p className="text-sm font-bold text-[#3D4F3D]">{vendor.contractEnd}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
              <Clock size={16} className="text-[#8C9A8C]" />
              <span className="text-xs text-[#8C9A8C]">
                {vendor.status === 'Expired' ? 'Contract has ended.' : `Renewal due in ${vendor.contractEnd}`}
              </span>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <button 
          onClick={() => navigate('/vendors')}
          className="w-full bg-white/60 border border-white text-[#3D4F3D] py-4 rounded-[24px] font-bold shadow-sm hover:bg-white active:scale-95 transition-all flex items-center justify-center gap-2 mt-8"
        >
          <ArrowLeft size={18} />
          Back to List
        </button>
      </div>
    </div>
  );
};

const ContactRow = ({ icon, label, value, action }: { icon: any, label: string, value: string, action?: () => void }) => (
  <button 
    onClick={action}
    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-colors ${action ? 'hover:bg-[#6B8E6B]/5 active:bg-[#6B8E6B]/10' : ''}`}
  >
    <div className="flex items-center gap-4">
      <div className="text-[#6B8E6B]">{icon}</div>
      <div className="text-left">
        <p className="text-[10px] text-[#8C9A8C] font-bold uppercase tracking-tight">{label}</p>
        <p className="text-sm font-semibold text-[#3D4F3D]">{value}</p>
      </div>
    </div>
    {action && <ExternalLink size={14} className="text-gray-300" />}
  </button>
);

export default VendorDetail;
