
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserCheck, Droplets, Zap, Shield, HelpCircle, Plus, ChevronRight, HardHat } from 'lucide-react';
import { Vendor } from '../types';

interface VendorsProps {
  vendors: Vendor[];
}

const Vendors: React.FC<VendorsProps> = ({ vendors }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVendors = vendors.filter(v => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getIcon = (service: string) => {
    const s = service.toLowerCase();
    if (s.includes('water')) return Droplets;
    if (s.includes('electric')) return Zap;
    if (s.includes('security')) return Shield;
    if (s.includes('elevator') || s.includes('lift')) return UserCheck;
    if (s.includes('house') || s.includes('clean')) return HelpCircle;
    return HardHat;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-10">
      
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search size={20} className="text-[#8C9A8C]" />
        </div>
        <input
          type="text"
          placeholder="Search by vendor name or service..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/60 border border-white rounded-full py-4 pl-12 pr-4 text-[#3D4F3D] text-sm focus:ring-2 focus:ring-[#6B8E6B]/20 focus:outline-none shadow-inner"
        />
      </div>

      {/* Vendor List */}
      <div className="space-y-3">
        {filteredVendors.length > 0 ? (
          filteredVendors.map((vendor) => {
            const Icon = getIcon(vendor.service);
            return (
              <div 
                key={vendor.id} 
                onClick={() => navigate(`/vendors/${vendor.id}`)}
                className="glass-card rounded-[24px] p-5 shadow-sm border border-white/70 cursor-pointer hover:bg-white/40 active:scale-[0.98] transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-[#6B8E6B]/5 text-[#6B8E6B] rounded-2xl flex items-center justify-center border border-[#6B8E6B]/10">
                      <Icon size={24} />
                    </div>
                    <div>
                      <h5 className="font-semibold text-[#3D4F3D]">{vendor.name}</h5>
                      <p className="text-xs text-[#8C9A8C]">{vendor.service}</p>
                      <p className="text-[10px] text-[#8C9A8C] mt-2 font-medium">
                        Contract: {vendor.contractStart} – {vendor.contractEnd}
                      </p>
                      {vendor.expiresInDays && vendor.status === 'Expiring' && (
                        <p className="text-[10px] text-orange-500 font-bold mt-1 uppercase tracking-tight">
                          ⚠️ Expires in {vendor.expiresInDays} days
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm ${
                      vendor.status === 'Active' ? 'bg-[#6B8E6B]/10 text-[#6B8E6B]' :
                      vendor.status === 'Expiring' ? 'bg-orange-50 text-orange-500' : 'bg-red-50 text-red-400'
                    }`}>
                      {vendor.status}
                    </span>
                    <ChevronRight size={16} className="text-gray-300" />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-10 text-[#8C9A8C] font-serif italic">
            No vendors match your search.
          </div>
        )}
      </div>

      {/* Add New Button */}
      <button 
        onClick={() => navigate('/vendors/new')}
        className="w-full bg-[#6B8E6B] text-white rounded-full py-4 flex items-center justify-center gap-2 font-bold shadow-lg shadow-[#6B8E6B]/20 hover:bg-[#5a7a5a] active:scale-[0.98] transition-all"
      >
        <Plus size={20} />
        Add New Vendor
      </button>
    </div>
  );
};

export default Vendors;
