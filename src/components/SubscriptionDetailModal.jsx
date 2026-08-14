import React, { useState } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { getLogoUrl } from '../utils/getLogoUrl';
import { X, Calendar, CreditCard, Tag, Edit3, Trash2, Check, Bell, Clock, Zap, Plus } from 'lucide-react';
import CustomSelect from './CustomSelect';

export default function SubscriptionDetailModal() {
  const { 
    selectedSub, 
    setSelectedSub, 
    updateSubscription, 
    deleteSubscription, 
    formatPrice,
    scheduleReminder 
  } = useSubscriptions();

  const [isEditing, setIsEditing] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [customMinutes, setCustomMinutes] = useState('');

  const [serviceName, setServiceName] = useState('');
  const [price, setPrice] = useState('');
  const [planType, setPlanType] = useState('');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [customDays, setCustomDays] = useState('');
  const [startDate, setStartDate] = useState('');

  const CYCLE_OPTIONS = [
    { value: 'monthly',   label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly',    label: 'Yearly' },
    { value: 'days',      label: 'Days' },
  ];

  // Patch computeNextBillingDate to support custom days
  const computeNextBillingDate = (start, cycle) => {
    if (!start) return '';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const cycleDays = cycle === 'days' ? parseInt(customDays) || 0 : 0;
    const addCycle = (d) => {
      const nd = new Date(d);
      if (cycle === 'monthly')        nd.setMonth(nd.getMonth() + 1);
      else if (cycle === 'quarterly') nd.setMonth(nd.getMonth() + 3);
      else if (cycle === 'yearly')    nd.setFullYear(nd.getFullYear() + 1);
      else if (cycle === 'days')      nd.setDate(nd.getDate() + cycleDays);
      return nd;
    };
    if (cycle === 'days' && cycleDays < 1) return '';
    let next = new Date(start);
    while (next <= today) next = addCycle(next);
    return next.toISOString().split('T')[0];
  };

  const computedNextDate = computeNextBillingDate(startDate, billingCycle);

  if (!selectedSub) return null;

  const logoUrl = getLogoUrl(selectedSub.serviceName, selectedSub.website);

  const handleOpenEdit = () => {
    setServiceName(selectedSub.serviceName);
    setPrice(selectedSub.price);
    setPlanType(selectedSub.planType || '');
    const cycle = selectedSub.billingCycle || 'monthly';
    const customMatch = cycle.match(/(\d+)\s*days?/i);
    if (customMatch) {
      setBillingCycle('days');
      setCustomDays(customMatch[1]);
    } else {
      setBillingCycle(cycle);
      setCustomDays('');
    }
    setStartDate(selectedSub.startDate || selectedSub.nextBillingDate || new Date().toISOString().split('T')[0]);
    setIsEditing(true);
  };

  const handleSaveUpdate = async () => {
    const cycleLabel = billingCycle === 'days' ? `${customDays} days` : billingCycle;
    const nextBillingDate = computedNextDate || selectedSub.nextBillingDate;
    const success = await updateSubscription(selectedSub.id, {
      serviceName,
      price: parseFloat(price),
      planType,
      billingCycle: cycleLabel,
      customDays: billingCycle === 'days' ? parseInt(customDays) : undefined,
      startDate,
      nextBillingDate
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

  const handleSetQuickReminder = (minutes) => {
    scheduleReminder(selectedSub.serviceName, minutes);
  };

  const handleSetCustomReminder = (e) => {
    e.preventDefault();
    const mins = parseFloat(customMinutes);
    if (!isNaN(mins) && mins >= 0) {
      scheduleReminder(selectedSub.serviceName, mins);
      setCustomMinutes('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-t-[32px] sm:rounded-[32px] bg-[#EBE6DD] dark:bg-[#121212] border border-black/5 dark:border-white/10 shadow-2xl p-6 text-[#1C1917] dark:text-[#F5F5F3] space-y-5 animate-in slide-in-from-bottom-8 duration-300 relative max-h-[90vh] overflow-y-auto no-scrollbar">
        
        {/* Close Button */}
        <button
          onClick={() => { setSelectedSub(null); setIsEditing(false); }}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#E2DDD4] dark:bg-[#24221E] text-[#1C1917] dark:text-[#F5F5F3] flex items-center justify-center hover:bg-[#D5CFC5] dark:hover:bg-[#2D2A25] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Branding with Real Black Logo */}
        <div className="flex items-center gap-3.5 pt-2">
          <div className="w-12 h-12 rounded-2xl bg-white/90 dark:bg-white/90 p-2.5 flex items-center justify-center shadow-md border border-black/10 overflow-hidden">
            {logoUrl && !logoError ? (
              <img
                src={logoUrl}
                alt={selectedSub.serviceName}
                onError={() => setLogoError(true)}
                className="w-full h-full object-contain grayscale contrast-200"
              />
            ) : (
              <span className="font-extrabold text-xl text-[#1C1917]">
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
                <label className="text-xs font-bold block mb-1">Billing Cycle</label>
                <CustomSelect
                  value={billingCycle}
                  onChange={(v) => { setBillingCycle(v); setCustomDays(''); }}
                  options={CYCLE_OPTIONS}
                />
              </div>
            </div>

            {/* Custom days input */}
            {billingCycle === 'days' && (
              <div>
                <label className="text-xs font-bold block mb-1">How many days? *</label>
                <input
                  type="number"
                  min="1"
                  placeholder="e.g. 28, 45, 56..."
                  value={customDays}
                  onChange={(e) => setCustomDays(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#EBE6DD] dark:bg-[#1A1918] border border-black/10 dark:border-white/10 text-xs font-bold focus:outline-none"
                />
              </div>
            )}

            {/* Starting Date — renewal is auto-computed */}
            <div>
              <label className="text-xs font-bold block mb-1">Starting / Subscription Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#EBE6DD] dark:bg-[#1A1918] border border-black/10 dark:border-white/10 text-xs font-bold focus:outline-none"
              />
            </div>

            {/* Auto-computed Next Renewal Preview */}
            {computedNextDate && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#DF4F38]/10 border border-[#DF4F38]/20">
                <Calendar className="w-3.5 h-3.5 text-[#DF4F38] flex-shrink-0" />
                <span className="text-[10px] font-extrabold text-[#DF4F38]">
                  Next renewal auto-set to:{' '}
                  <span className="text-[#1C1917] dark:text-[#F5F5F3]">
                    {new Date(computedNextDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </span>
              </div>
            )}

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
            {/* Price Banner */}
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

            {/* Quick Snooze & Custom Alarm Reminder Section */}
            <div className="p-4 rounded-[22px] bg-[#DF4F38]/10 border border-[#DF4F38]/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#DF4F38] flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5" />
                  <span>Snooze & Set Alarm Reminder</span>
                </span>
                <span className="text-[10px] font-bold text-[#78746D] dark:text-[#A8A29E]">
                  Sound + Push + Vibrate
                </span>
              </div>

              {/* Frequent Minute Preset Chips */}
              <div className="grid grid-cols-4 gap-1.5">
                <button
                  onClick={() => handleSetQuickReminder(0)}
                  className="py-2.5 px-1 rounded-xl bg-white dark:bg-[#1A1918] hover:bg-[#DF4F38] hover:text-white border border-black/5 dark:border-white/10 text-xs font-extrabold flex items-center justify-center gap-1 transition-all touch-shrink"
                >
                  <Zap className="w-3 h-3 text-[#DF4F38]" />
                  <span>0 Min</span>
                </button>

                <button
                  onClick={() => handleSetQuickReminder(5)}
                  className="py-2.5 px-1 rounded-xl bg-white dark:bg-[#1A1918] hover:bg-[#DF4F38] hover:text-white border border-black/5 dark:border-white/10 text-xs font-extrabold flex items-center justify-center gap-1 transition-all touch-shrink"
                >
                  <Clock className="w-3 h-3 text-[#DF4F38]" />
                  <span>5 Mins</span>
                </button>

                <button
                  onClick={() => handleSetQuickReminder(10)}
                  className="py-2.5 px-1 rounded-xl bg-white dark:bg-[#1A1918] hover:bg-[#DF4F38] hover:text-white border border-black/5 dark:border-white/10 text-xs font-extrabold flex items-center justify-center gap-1 transition-all touch-shrink"
                >
                  <Clock className="w-3 h-3 text-amber-500" />
                  <span>10 Mins</span>
                </button>

                <button
                  onClick={() => handleSetQuickReminder(15)}
                  className="py-2.5 px-1 rounded-xl bg-white dark:bg-[#1A1918] hover:bg-[#DF4F38] hover:text-white border border-black/5 dark:border-white/10 text-xs font-extrabold flex items-center justify-center gap-1 transition-all touch-shrink"
                >
                  <Clock className="w-3 h-3 text-blue-500" />
                  <span>15 Mins</span>
                </button>
              </div>

              {/* Custom Minutes Input */}
              <form onSubmit={handleSetCustomReminder} className="flex gap-2 pt-1">
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="Custom minutes (e.g. 2, 7, 30)..."
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-[#1A1918] border border-black/10 dark:border-white/10 text-xs font-bold text-[#1C1917] dark:text-[#F5F5F3] focus:outline-none placeholder:text-[#78746D]/60"
                />
                <button
                  type="submit"
                  disabled={!customMinutes}
                  className="px-3.5 py-2 rounded-xl bg-[#DF4F38] disabled:opacity-50 text-white text-xs font-extrabold shadow-sm transition-all touch-shrink flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Set Alarm</span>
                </button>
              </form>
            </div>

            {/* Plan Info List */}
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
