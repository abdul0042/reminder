import React, { useState } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { X, Calendar, CreditCard, Tag, Edit3, Trash2, Check } from 'lucide-react';

export default function SubscriptionDetailModal() {
  const { selectedSub, setSelectedSub, updateSubscription, deleteSubscription, formatPrice } = useSubscriptions();
  const [isEditing, setIsEditing] = useState(false);

  const [serviceName, setServiceName] = useState('');
  const [price, setPrice] = useState('');
  const [planType, setPlanType] = useState('');
  const [billingCycle, setBillingCycle] = useState('monthly');

  if (!selectedSub) return null;

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

        {/* Top Branding */}
        <div className="flex items-center gap-3 pt-2">
          <div className="w-12 h-12 rounded-2xl bg-black text-white font-extrabold text-xl flex items-center justify-center shadow-md">
            {selectedSub.serviceName.charAt(0)}
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
                className="w-full px-3 py-2 rounded-xl bg-[#EBE6DD] dark:bg-[#1A1918] border border-black/5 dark:border-white/10 text-xs font-bold text-[#1C1917] dark:text-[#F5F5F3]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold block mb-1">Price (₹)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#EBE6DD] dark:bg-[#1A1918] border border-black/5 dark:border-white/10 text-xs font-bold text-[#1C1917] dark:text-[#F5F5F3]"
                />
              </div>
              <div>
                <label className="text-xs font-bold block mb-1">Cycle</label>
                <select
                  value={billingCycle}
                  onChange={(e) => setBillingCycle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#EBE6DD] dark:bg-[#1A1918] border border-black/5 dark:border-white/10 text-xs font-bold text-[#1C1917] dark:text-[#F5F5F3]"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold block mb-1">Plan Tier</label>
              <input
                type="text"
                value={planType}
                onChange={(e) => setPlanType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#EBE6DD] dark:bg-[#1A1918] border border-black/5 dark:border-white/10 text-xs font-bold text-[#1C1917] dark:text-[#F5F5F3]"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSaveUpdate}
                className="flex-1 py-2.5 rounded-xl bg-[#1C1917] dark:bg-white text-white dark:text-[#1C1917] text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-2.5 rounded-xl bg-[#EBE6DD] dark:bg-[#1A1918] text-xs font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          /* View Mode Details */
          <div className="p-4 rounded-[22px] bg-[#E2DDD4] dark:bg-[#24221E] border border-black/5 dark:border-white/5 space-y-3">
            <div className="flex items-center justify-between py-1">
              <span className="text-xs font-bold text-[#78746D] dark:text-[#A8A29E] flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5" /> Monthly Outflow
              </span>
              <span className="text-base font-extrabold">
                {formatPrice(selectedSub.price)}
              </span>
            </div>

            <div className="h-px bg-black/5 dark:bg-white/5" />

            <div className="flex items-center justify-between py-1 text-xs">
              <span className="font-bold text-[#78746D] dark:text-[#A8A29E] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Next Billing Date
              </span>
              <span className="font-extrabold">
                {selectedSub.nextBillingDate ? new Date(selectedSub.nextBillingDate).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}
              </span>
            </div>

            <div className="h-px bg-black/5 dark:bg-white/5" />

            <div className="flex items-center justify-between py-1 text-xs">
              <span className="font-bold text-[#78746D] dark:text-[#A8A29E] flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" /> Current Plan Tier
              </span>
              <span className="font-extrabold">
                {selectedSub.planType || 'Standard'}
              </span>
            </div>
          </div>
        )}

        {/* Modal Bottom Actions */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={handleOpenEdit}
            className="py-3 rounded-[18px] bg-[#E2DDD4] dark:bg-[#24221E] hover:bg-[#D5CFC5] dark:hover:bg-[#2D2A25] font-extrabold text-xs flex items-center justify-center gap-2 border border-black/5 dark:border-white/10 transition-all touch-shrink"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Plan Details</span>
          </button>

          <button
            onClick={handleDelete}
            className="py-3 rounded-[18px] bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-900/60 font-extrabold text-xs flex items-center justify-center gap-2 transition-all touch-shrink border border-rose-200 dark:border-rose-900/50"
          >
            <Trash2 className="w-4 h-4" />
            <span>Cancel Subscription</span>
          </button>
        </div>

      </div>
    </div>
  );
}
