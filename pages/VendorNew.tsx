
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, HardHat, CheckCircle2, User as UserIcon, Phone, Mail } from 'lucide-react';
import { Vendor } from '../types';

interface VendorNewProps {
  setVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
}

const VendorNew: React.FC<VendorNewProps> = ({ setVendors }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    service: '',
    contactPerson: '',
    phone: '',
    email: '',
    contractStart: '',
    contractEnd: '',
    description: ''
  });
  const [toast, setToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newVendor: Vendor = {
      id: Math.floor(100 + Math.random() * 900).toString(),
      name: formData.name,
      service: formData.service,
      contactPerson: formData.contactPerson,
      phone: formData.phone,
      email: formData.email,
      contractStart: new Date(formData.contractStart).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      contractEnd: new Date(formData.contractEnd).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      description: formData.description,
      status: 'Active'
    };

    setVendors(prev => [newVendor, ...prev]);
    setToast(true);
    
    setTimeout(() => {
      navigate('/vendors');
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="mb-6">
        <h2 className="text-2xl font-serif font-bold text-[#3D4F3D]">Add New Vendor</h2>
        <p className="text-sm text-[#8C9A8C]">Register a new service provider</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-card rounded-[32px] p-6 sm:p-8 space-y-5 border border-white/70">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#8C9A8C] uppercase tracking-wider px-1">Vendor Name</label>
            <input
              name="name"
              type="text"
              required
              placeholder="e.g. Metro Electricals"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-white/50 border border-gray-100 rounded-2xl py-3.5 px-4 text-sm focus:ring-2 focus:ring-[#6B8E6B]/20 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#8C9A8C] uppercase tracking-wider px-1">Service Provided</label>
            <input
              name="service"
              type="text"
              required
              placeholder="e.g. Electrical Maintenance"
              value={formData.service}
              onChange={handleChange}
              className="w-full bg-white/50 border border-gray-100 rounded-2xl py-3.5 px-4 text-sm focus:ring-2 focus:ring-[#6B8E6B]/20 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#8C9A8C] uppercase tracking-wider px-1">Contract Start</label>
              <input
                name="contractStart"
                type="date"
                required
                value={formData.contractStart}
                onChange={handleChange}
                className="w-full bg-white/50 border border-gray-100 rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#6B8E6B]/20 focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#8C9A8C] uppercase tracking-wider px-1">Contract End</label>
              <input
                name="contractEnd"
                type="date"
                required
                value={formData.contractEnd}
                onChange={handleChange}
                className="w-full bg-white/50 border border-gray-100 rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#6B8E6B]/20 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-[32px] p-6 sm:p-8 space-y-5 border border-white/70">
          <h4 className="text-xs font-bold text-[#8C9A8C] uppercase tracking-widest mb-2 px-1">Primary Contact</h4>
          
          <div className="space-y-1.5">
            <div className="relative">
              <UserIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C9A8C]" />
              <input
                name="contactPerson"
                type="text"
                required
                placeholder="Contact Person Name"
                value={formData.contactPerson}
                onChange={handleChange}
                className="w-full bg-white/50 border border-gray-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#6B8E6B]/20 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="relative">
              <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C9A8C]" />
              <input
                name="phone"
                type="tel"
                required
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-white/50 border border-gray-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#6B8E6B]/20 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C9A8C]" />
              <input
                name="email"
                type="email"
                required
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white/50 border border-gray-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#6B8E6B]/20 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/vendors')}
            className="flex-1 bg-white border border-gray-100 text-[#8C9A8C] py-4 rounded-[24px] font-bold active:scale-95 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-[2] bg-[#6B8E6B] text-white py-4 rounded-[24px] font-bold shadow-lg shadow-[#6B8E6B]/20 flex items-center justify-center gap-2 hover:bg-[#5a7a5a] active:scale-[0.98] transition-all"
          >
            <Save size={18} />
            Save Vendor
          </button>
        </div>
      </form>

      {/* Toast Feedback */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#3D4F3D] text-white px-6 py-4 rounded-full flex items-center gap-3 shadow-2xl z-50 animate-in slide-in-from-bottom-10 duration-300">
          <CheckCircle2 size={20} className="text-[#6B8E6B]" />
          <div className="flex flex-col">
            <span className="text-sm font-bold">Vendor Registered!</span>
            <span className="text-[10px] opacity-70">Redirecting to list...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorNew;
