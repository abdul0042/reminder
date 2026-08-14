import React, { useState } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { PRESET_SERVICES, CATEGORIES } from '../data/presets';
import { Plus, Sparkles } from 'lucide-react';

export default function AddSubscriptionForm({ isModal = false }) {
  const { isAddModalOpen, setIsAddModalOpen, addSubscription, setActiveTab } = useSubscriptions();

  const [serviceName, setServiceName] = useState('');
  const [category, setCategory] = useState('Entertainment');
  const [price, setPrice] = useState('');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [nextBillingDate, setNextBillingDate] = useState(() => {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 30);
    return defaultDate.toISOString().split('T')[0];
  });
  const [planType, setPlanType] = useState('Standard');
  const [paymentMethod, setPaymentMethod] = useState('•••• 0205');
  const [notes, setNotes] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(null);

  if (isModal && !isAddModalOpen) return null;

  const handleSelectPreset = (preset) => {
    setSelectedPreset(preset.name);
    setServiceName(preset.name);
    setCategory(preset.category);
    setPrice(preset.defaultPrice);
    if (preset.planTiers && preset.planTiers.length > 0) {
      setPlanType(preset.planTiers[0].split(' (')[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!serviceName || !price || !nextBillingDate) return;

    const success = await addSubscription({
      serviceName,
      category,
      price: parseFloat(price),
      currency: 'INR',
      billingCycle,
      nextBillingDate,
      planType,
      paymentMethod,
      notes
    });

    if (success) {
      setServiceName('');
      setPrice('');
      setSelectedPreset(null);
      if (isModal) setIsAddModalOpen(false);
      setActiveTab('dashboard');
    }
  };

  const formContent = (
    <div className="space-y-4 text-[#1C1917] dark:text-[#F5F5F3]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#DF4F38] text-white shadow-sm">
            <Plus className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-extrabold text-base tracking-tight">
              Add Subscription
            </h2>
            <p className="text-xs text-[#78746D] dark:text-[#A8A29E] font-semibold">
              Track a new service in Rupees (₹)
            </p>
          </div>
        </div>

        {!isModal && (
          <button
            onClick={() => setActiveTab('dashboard')}
            className="text-xs font-bold px-3 py-1 rounded-full bg-[#E2DDD4] dark:bg-[#24221E] text-[#1C1917] dark:text-[#F5F5F3] hover:bg-[#D5CFC5] dark:hover:bg-[#2D2A25] transition-colors border border-black/5 dark:border-white/10"
          >
            Back to Dashboard
          </button>
        )}
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="p-5 rounded-[26px] bg-[#E2DDD4] dark:bg-[#24221E] border border-black/5 dark:border-white/5 space-y-4">
        
        {/* Quick Presets */}
        <div>
          <label className="text-xs font-extrabold text-[#1C1917] dark:text-[#F5F5F3] flex items-center gap-1 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#DF4F38]" />
            <span>Popular Presets (Indian Pricing ₹)</span>
          </label>

          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 -mx-2 px-2">
            {PRESET_SERVICES.map((preset) => {
              const isSelected = selectedPreset === preset.name;
              return (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold whitespace-nowrap transition-all touch-shrink ${
                    isSelected
                      ? 'bg-[#1C1917] dark:bg-white text-white dark:text-[#1C1917] border-[#1C1917] dark:border-white shadow-sm'
                      : 'bg-[#EBE6DD] dark:bg-[#1A1918] text-[#1C1917] dark:text-[#F5F5F3] border-black/5 dark:border-white/10 hover:bg-[#D5CFC5] dark:hover:bg-[#2D2A25]'
                  }`}
                >
                  <span>{preset.name} (₹{preset.defaultPrice})</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-px bg-black/5 dark:bg-white/5" />

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold block mb-1">
              Service Name *
            </label>
            <input
              type="text"
              required
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              placeholder="e.g. Netflix, Spotify, Gym"
              className="w-full px-3.5 py-2.5 rounded-[16px] bg-[#EBE6DD] dark:bg-[#1A1918] border border-black/5 dark:border-white/10 text-xs font-bold text-[#1C1917] dark:text-[#F5F5F3] placeholder-[#78746D] dark:placeholder-[#6B655F] focus:outline-none focus:ring-2 focus:ring-[#DF4F38]"
            />
          </div>

          <div>
            <label className="text-xs font-bold block mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-[16px] bg-[#EBE6DD] dark:bg-[#1A1918] border border-black/5 dark:border-white/10 text-xs font-bold text-[#1C1917] dark:text-[#F5F5F3] focus:outline-none focus:ring-2 focus:ring-[#DF4F38]"
            >
              {CATEGORIES.filter(c => c !== 'All').map(c => (
                <option key={c} value={c} className="bg-[#EBE6DD] dark:bg-[#1A1918] text-[#1C1917] dark:text-[#F5F5F3]">{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-bold block mb-1">
              Price (₹ INR) *
            </label>
            <input
              type="number"
              step="1"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="649"
              className="w-full px-3.5 py-2.5 rounded-[16px] bg-[#EBE6DD] dark:bg-[#1A1918] border border-black/5 dark:border-white/10 text-xs font-bold text-[#1C1917] dark:text-[#F5F5F3] placeholder-[#78746D] dark:placeholder-[#6B655F] focus:outline-none focus:ring-2 focus:ring-[#DF4F38]"
            />
          </div>

          <div>
            <label className="text-xs font-bold block mb-1">
              Billing Cycle
            </label>
            <select
              value={billingCycle}
              onChange={(e) => setBillingCycle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-[16px] bg-[#EBE6DD] dark:bg-[#1A1918] border border-black/5 dark:border-white/10 text-xs font-bold text-[#1C1917] dark:text-[#F5F5F3] focus:outline-none focus:ring-2 focus:ring-[#DF4F38]"
            >
              <option value="monthly" className="bg-[#EBE6DD] dark:bg-[#1A1918] text-[#1C1917] dark:text-[#F5F5F3]">Monthly</option>
              <option value="yearly" className="bg-[#EBE6DD] dark:bg-[#1A1918] text-[#1C1917] dark:text-[#F5F5F3]">Yearly</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold block mb-1">
              Next Billing Date *
            </label>
            <input
              type="date"
              required
              value={nextBillingDate}
              onChange={(e) => setNextBillingDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-[16px] bg-[#EBE6DD] dark:bg-[#1A1918] border border-black/5 dark:border-white/10 text-xs font-bold text-[#1C1917] dark:text-[#F5F5F3] focus:outline-none focus:ring-2 focus:ring-[#DF4F38]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold block mb-1">
              Plan Tier
            </label>
            <input
              type="text"
              value={planType}
              onChange={(e) => setPlanType(e.target.value)}
              placeholder="e.g. Premium 4K, Family"
              className="w-full px-3.5 py-2.5 rounded-[16px] bg-[#EBE6DD] dark:bg-[#1A1918] border border-black/5 dark:border-white/10 text-xs font-bold text-[#1C1917] dark:text-[#F5F5F3] placeholder-[#78746D] dark:placeholder-[#6B655F] focus:outline-none focus:ring-2 focus:ring-[#DF4F38]"
            />
          </div>

          <div>
            <label className="text-xs font-bold block mb-1">
              Payment Info
            </label>
            <input
              type="text"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              placeholder="•••• 0205"
              className="w-full px-3.5 py-2.5 rounded-[16px] bg-[#EBE6DD] dark:bg-[#1A1918] border border-black/5 dark:border-white/10 text-xs font-bold text-[#1C1917] dark:text-[#F5F5F3] placeholder-[#78746D] dark:placeholder-[#6B655F] focus:outline-none focus:ring-2 focus:ring-[#DF4F38]"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold block mb-1">
            Notes (Optional)
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Shared plan details..."
            className="w-full px-3.5 py-2 rounded-[16px] bg-[#EBE6DD] dark:bg-[#1A1918] border border-black/5 dark:border-white/10 text-xs font-semibold text-[#1C1917] dark:text-[#F5F5F3] placeholder-[#78746D] dark:placeholder-[#6B655F] focus:outline-none focus:ring-2 focus:ring-[#DF4F38]"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3.5 rounded-[18px] bg-[#1C1917] dark:bg-white text-white dark:text-[#1C1917] font-extrabold text-xs tracking-wide transition-all touch-shrink shadow-md"
          >
            Save Subscription (₹)
          </button>
        </div>

      </form>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="w-full max-w-lg rounded-t-[32px] sm:rounded-[32px] bg-[#EBE6DD] dark:bg-[#121212] border border-black/5 dark:border-white/10 shadow-2xl overflow-hidden max-h-[85vh] p-5 overflow-y-auto animate-in slide-in-from-bottom-8 duration-300">
          {formContent}
        </div>
      </div>
    );
  }

  return formContent;
}
