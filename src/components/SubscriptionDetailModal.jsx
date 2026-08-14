import React, { useState } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { getLogoUrl } from '../utils/getLogoUrl';
import { X, Calendar, CreditCard, Tag, Edit3, Trash2, Check } from 'lucide-react';

export default function SubscriptionDetailModal() {
  const { selectedSub, setSelectedSub, updateSubscription, deleteSubscription, formatPrice } = useSubscriptions();
  const [isEditing, setIsEditing] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const [serviceName, setServiceName] = useState('');
  const [price, setPrice] = useState('');
  const [planType, setPlanType] = useState('');
  const [billingCycle, setBillingCycle] = useState('monthly');

  if (!selectedSub) return null;

  const logoUrl = getLogoUrl(selectedSub.serviceName, selectedSub.website);

  const handleOpenEdit = () => {
    setServiceName(selectedSub.serviceName);
    setPrice(selectedSub.price);
    setPlanType(selectedSub.planType || '');
    setBillingCycle(selectedSub.billingCycle || 'monthly');
    setIsEditing(true);
  };

  const handleSaveUpdate = async () => {
    const success = await updateSubscription(selectedSub.id, {
      serviceName,
      price: parseFloat(price),
      planType,
      billingCycle
    });
    if (success) {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to cancel and remove ${selectedSub.serviceName}?`)) {
      await deleteSubscription(selectedSub.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-t-[32px] sm:rounded-[32px] bg-[#EBE6DD] dark:bg-[#121212] border border-black/5 dark:border-white/10 shadow-2xl p-6 text-[#1C1917] dark:text-[#F5F5F3] space-y-5 animate-in slide-in-from-bottom-8 duration-300 relative">
        
        {/* Close Button */}
        <button
          onClick={() => { setSelectedSub(null); setIsEditing(false); }}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#E2DDD4] dark:bg-[#24221E] text-[#1C1917] dark:text-[#F5F5F3] flex items-center justify-center hover:bg-[#D5CFC5] dark:hover:bg-[#2D2A25] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Branding with Real Logo */}
        <div className="flex items-center gap-3.5 pt-2">
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#1A1918] p-2 flex items-center justify-center shadow-md border border-black/10 dark:border-white/10 overflow-hidden">
            {logoUrl && !logoError ? (
              <img
                src={logoUrl}
                alt={selectedSub.serviceName}
                onError={() => setLogoError(true)}
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="font-extrabold text-xl text-[#1C1917] dark:text-[#F5F5F3]">
                {selectedSub.serviceName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <div>
            <h2 className="text-xl font-extrabold tracking-tight">
              {selectedSub.serviceName}
            </h2>
            <span className="text-xs font-bold text-[#78746D] dark:text-[#A8A29E]">
              {selectedSub.category || 'Subscription'}
            </span>
          </div>
        </div>

        {isEditing ? (
          /* Edit Mode Form */
          <div className="p-4 rounded-[22px] bg-[#E2DDD4] dark:bg-[#24221E] border border-black/5 dark:border-white/5 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#78746D] dark:text-[#A8A29E]">
              Edit Subscription Details
            </h3>

            <div>
              <label className="text-xs font-bold block mb-1">Service Name</label>
              <input
                type="text"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#EBE6DD] dark:bg-[#1A1918] border border-black/10 dark:border-white/10 text-xs font-bold focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold block mb-1">Price (₹)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#EBE6DD] dark:bg-[#1A1918] border border-black/10 dark:border-white/10 text-xs font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold block mb-1">Cycle</label>
                <select
                  value={billingCycle}
                  onChange={(e) => setBillingCycle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#EBE6DD] dark:bg-[#1A1918] border border-black/10 dark:border-white/10 text-xs font-bold focus:outline-none"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSaveUpdate}
                className="flex-1 py-2.5 rounded-xl bg-[#1C1917] dark:bg-white text-white dark:text-[#1C1917] text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Check className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 rounded-xl bg-[#C5BEB3] dark:bg-[#2F2C27] text-xs font-extrabold"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          /* View Mode Details */
          <div className="space-y-4">
            <div className="p-4 rounded-[22px] bg-[#E2DDD4] dark:bg-[#24221E] border border-black/5 dark:border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#78746D] dark:text-[#A8A29E] block">Billing Cost</span>
                <span className="text-2xl font-black text-[#DF4F38]">{formatPrice(selectedSub.price)}</span>
                <span className="text-xs font-bold text-[#78746D] dark:text-[#A8A29E]"> / {selectedSub.billingCycle || 'month'}</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs">
                Active Plan
              </span>
            </div>

            <div className="space-y-2 text-xs font-bold text-[#1C1917] dark:text-[#F5F5F3]">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#E2DDD4]/60 dark:bg-[#24221E]/60">
                <span className="flex items-center gap-2 text-[#78746D] dark:text-[#A8A29E]">
                  <Calendar className="w-4 h-4 text-[#DF4F38]" /> Next Billing Date
                </span>
                <span>{selectedSub.nextBillingDate ? new Date(selectedSub.nextBillingDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#E2DDD4]/60 dark:bg-[#24221E]/60">
                <span className="flex items-center gap-2 text-[#78746D] dark:text-[#A8A29E]">
                  <Tag className="w-4 h-4 text-[#DF4F38]" /> Plan Tier
                </span>
                <span>{selectedSub.planType || 'Standard'}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#E2DDD4]/60 dark:bg-[#24221E]/60">
                <span className="flex items-center gap-2 text-[#78746D] dark:text-[#A8A29E]">
                  <CreditCard className="w-4 h-4 text-[#DF4F38]" /> Payment Method
                </span>
                <span>{selectedSub.paymentMethod || '•••• 0205'}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={handleOpenEdit}
                className="py-3 rounded-[18px] bg-[#E2DDD4] dark:bg-[#24221E] hover:bg-[#D5CFC5] font-extrabold text-xs flex items-center justify-center gap-2 transition-all touch-shrink border border-black/5 dark:border-white/5"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Details</span>
              </button>

              <button
                onClick={handleDelete}
                className="py-3 rounded-[18px] bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-extrabold text-xs flex items-center justify-center gap-2 transition-all touch-shrink border border-rose-500/20"
              >
                <Trash2 className="w-4 h-4" />
                <span>Cancel Plan</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
