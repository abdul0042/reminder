import React, { useState, useRef } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { PRESET_SERVICES, CATEGORIES } from '../data/presets';
import { getLogoUrl } from '../utils/getLogoUrl';
import { Plus, Sparkles } from 'lucide-react';
import CustomSelect from './CustomSelect';
import ServiceLogo from './ServiceLogo';

// Extended list for suggestion engine (beyond presets)
const ALL_KNOWN_SERVICES = [
  ...PRESET_SERVICES.map(p => p.name),
  'YouTube', 'YouTube Music', 'Hotstar', 'Jio Cinema', 'SonyLIV', 'ZEE5', 'MX Player',
  'Audible', 'Kindle Unlimited', 'Google One', 'Google Workspace', 'Microsoft 365',
  'Dropbox', 'Notion', 'Slack', 'Zoom', 'LinkedIn Premium', 'Grammarly',
  'Canva Pro', 'Loom', 'Jira', 'Confluence', 'Trello', 'Asana', 'Monday.com',
  'Airtel Xstream', 'Jio Fiber', 'Airtel Broadband', 'BSNL Broadband',
  'PhonePe Premium', 'Swiggy One', 'Zomato Pro', 'Blinkit Pass',
  'Duolingo Plus', 'Coursera Plus', 'Udemy', 'Skillshare', 'MasterClass',
  'NordVPN', 'ExpressVPN', 'Surfshark', '1Password', 'LastPass', 'Bitwarden',
  'Xbox Game Pass', 'PlayStation Plus', 'Steam', 'Epic Games',
  'Twitch', 'Discord Nitro', 'Patreon', 'Substack',
].filter((v, i, a) => a.indexOf(v) === i); // deduplicate

// Billing cycle options — "custom" triggers a day-count input
const CYCLE_OPTIONS = [
  { value: 'monthly',   label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly',    label: 'Yearly' },
  { value: 'days',      label: 'Days' },
];

function PresetChip({ preset, isSelected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold whitespace-nowrap transition-all touch-shrink ${
        isSelected
          ? 'bg-[#1C1917] dark:bg-white text-white dark:text-[#1C1917] border-[#1C1917] dark:border-white shadow-sm'
          : 'bg-[#EBE6DD] dark:bg-[#1A1918] text-[#1C1917] dark:text-[#F5F5F3] border-black/5 dark:border-white/10 hover:bg-[#D5CFC5] dark:hover:bg-[#2D2A25]'
      }`}
    >
      <ServiceLogo name={preset.name} website={preset.website} className="w-4 h-4 rounded-md border-0" textClassName="text-[9px]" />
      <span>{preset.name}</span>
    </button>
  );
}

export default function AddSubscriptionForm({ isModal = false }) {
  const { isAddModalOpen, setIsAddModalOpen, addSubscription, setActiveTab } = useSubscriptions();

  const [serviceName, setServiceName] = useState('');
  const [category, setCategory] = useState('Entertainment');
  const [price, setPrice] = useState('');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [customDays, setCustomDays] = useState('');
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [planType, setPlanType] = useState('Standard');
  const [paymentMethod, setPaymentMethod] = useState('•••• 0205');
  const [notes, setNotes] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);

  // Refs for auto-focus on Enter
  const refs = {
    serviceName: useRef(null),
    customDays:  useRef(null),
    price:       useRef(null),
    startDate:   useRef(null),
    planType:    useRef(null),
    paymentMethod: useRef(null),
    notes:       useRef(null),
  };

  const focusNext = (nextKey) => refs[nextKey]?.current?.focus();

  // Suggestion engine
  const handleServiceNameChange = (val) => {
    setServiceName(val);
    setSelectedPreset(null);
    if (val.trim().length > 0) {
      const q = val.toLowerCase();
      const matches = ALL_KNOWN_SERVICES.filter(s => s.toLowerCase().includes(q)).slice(0, 6);
      setSuggestions(matches);
      setShowSuggestions(matches.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handlePickSuggestion = (name) => {
    const preset = PRESET_SERVICES.find(p => p.name.toLowerCase() === name.toLowerCase());
    if (preset) {
      handleSelectPreset(preset);
    } else {
      setServiceName(name);
      setSelectedPreset(null);
    }
    setSuggestions([]);
    setShowSuggestions(false);
    setTimeout(() => focusNext('price'), 50);
  };

  const computeNextBillingDate = (start, cycle, days) => {
    if (!start) return '';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const cycleDays = cycle === 'days' ? parseInt(days) || 0 : 0;
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

  const computedNextDate = computeNextBillingDate(startDate, billingCycle, customDays);

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
    if (!serviceName || !price || !startDate) return;
    if (billingCycle === 'days' && (!customDays || parseInt(customDays) < 1)) return;

    const cycleLabel = billingCycle === 'days' ? `${customDays} days` : billingCycle;

    const success = await addSubscription({
      serviceName,
      category,
      price: parseFloat(price),
      currency: 'INR',
      billingCycle: cycleLabel,
      customDays: billingCycle === 'days' ? parseInt(customDays) : undefined,
      startDate,
      nextBillingDate: computedNextDate,
      planType,
      paymentMethod,
      notes
    });

    if (success) {
      setServiceName('');
      setPrice('');
      setCustomDays('');
      setStartDate(new Date().toISOString().split('T')[0]);
      setSelectedPreset(null);
      if (isModal) setIsAddModalOpen(false);
      setActiveTab('dashboard');
    }
  };

  const categoryOptions = CATEGORIES.filter(c => c !== 'All').map(c => ({ value: c, label: c }));

  const formContent = (
    <div className="space-y-4 text-[#1C1917] dark:text-[#F5F5F3]">
      {/* Form Card */}
      <form onSubmit={handleSubmit} className="p-5 rounded-[26px] bg-[#E2DDD4] dark:bg-[#24221E] border border-black/5 dark:border-white/5 space-y-4">

        {/* Quick Presets */}
        <div>
          <label className="text-xs font-extrabold text-[#1C1917] dark:text-[#F5F5F3] flex items-center gap-1 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#DF4F38]" />
            <span>Popular Presets (Indian Pricing ₹)</span>
          </label>
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 -mx-2 px-2">
            {PRESET_SERVICES.map((preset) => (
              <PresetChip
                key={preset.name}
                preset={preset}
                isSelected={selectedPreset === preset.name}
                onSelect={() => handleSelectPreset(preset)}
              />
            ))}
          </div>
        </div>

        {/* Input Fields */}
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold block mb-1">Service Name *</label>
            <div className="relative" ref={suggestionsRef}>
              <input
                ref={refs.serviceName}
                type="text"
                required
                autoComplete="off"
                placeholder="e.g. Spotify, Netflix, Jio, Airtel"
                value={serviceName}
                onChange={(e) => handleServiceNameChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); setShowSuggestions(false); focusNext('price'); }
                  if (e.key === 'Escape') setShowSuggestions(false);
                }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                className="w-full px-4 py-3 rounded-[16px] bg-[#EBE6DD] dark:bg-[#1A1918] border border-black/5 dark:border-white/10 text-xs font-extrabold text-[#1C1917] dark:text-[#F5F5F3] placeholder:text-[#78746D]/60 dark:placeholder:text-[#A8A29E]/60 focus:outline-none"
              />

              {/* Suggestion Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-[16px] bg-white dark:bg-[#1A1918] border border-black/8 dark:border-white/10 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                  {suggestions.map((name) => {
                    const preset = PRESET_SERVICES.find(p => p.name.toLowerCase() === name.toLowerCase());
                    return (
                      <button
                        key={name}
                        type="button"
                        onMouseDown={() => handlePickSuggestion(name)}
                        className="w-full px-4 py-2.5 flex items-center gap-3 text-left hover:bg-[#EBE6DD] dark:hover:bg-[#24221E] transition-colors"
                      >
                        <ServiceLogo name={name} website={preset?.website} className="w-6 h-6 rounded-lg" />
                        <div className="min-w-0">
                          <span className="text-xs font-extrabold text-[#1C1917] dark:text-[#F5F5F3] block truncate">{name}</span>
                          {preset && <span className="text-[10px] font-semibold text-[#78746D] dark:text-[#A8A29E]">₹{preset.defaultPrice}/{preset.category}</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-bold block mb-1">Category</label>
              <CustomSelect
                value={category}
                onChange={setCategory}
                options={categoryOptions}
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

          {/* Custom days input — shown only when "Days" is selected */}
          {billingCycle === 'days' && (
            <div>
              <label className="text-xs font-bold block mb-1">How many days? *</label>
              <input
                ref={refs.customDays}
                type="number"
                min="1"
                required
                placeholder="e.g. 28, 45, 56..."
                value={customDays}
                onChange={(e) => setCustomDays(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), focusNext('price'))}
                className="w-full px-4 py-3 rounded-[16px] bg-[#EBE6DD] dark:bg-[#1A1918] border border-black/5 dark:border-white/10 text-xs font-extrabold text-[#1C1917] dark:text-[#F5F5F3] placeholder:text-[#78746D]/60 focus:outline-none"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-bold block mb-1">Price (₹) *</label>
              <input
                ref={refs.price}
                type="number"
                required
                step="0.01"
                placeholder="649"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), focusNext('startDate'))}
                className="w-full px-4 py-3 rounded-[16px] bg-[#EBE6DD] dark:bg-[#1A1918] border border-black/5 dark:border-white/10 text-xs font-extrabold text-[#1C1917] dark:text-[#F5F5F3] placeholder:text-[#78746D]/60 dark:placeholder:text-[#A8A29E]/60 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold block mb-1">Starting Date *</label>
              <input
                ref={refs.startDate}
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), focusNext('planType'))}
                className="w-full px-3 py-3 rounded-[16px] bg-[#EBE6DD] dark:bg-[#1A1918] border border-black/5 dark:border-white/10 text-xs font-extrabold text-[#1C1917] dark:text-[#F5F5F3] focus:outline-none"
              />
            </div>
          </div>

          {/* Auto-computed next renewal preview */}
          {computedNextDate && (
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-[14px] bg-[#DF4F38]/10 border border-[#DF4F38]/20">
              <span className="text-[10px] font-extrabold text-[#DF4F38]">📅 Next renewal auto-set to:</span>
              <span className="text-[10px] font-extrabold text-[#1C1917] dark:text-[#F5F5F3]">
                {new Date(computedNextDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-bold block mb-1">Plan Tier</label>
              <input
                ref={refs.planType}
                type="text"
                placeholder="Standard / 4K"
                value={planType}
                onChange={(e) => setPlanType(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), focusNext('paymentMethod'))}
                className="w-full px-4 py-3 rounded-[16px] bg-[#EBE6DD] dark:bg-[#1A1918] border border-black/5 dark:border-white/10 text-xs font-extrabold text-[#1C1917] dark:text-[#F5F5F3] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold block mb-1">Payment Method</label>
              <input
                ref={refs.paymentMethod}
                type="text"
                placeholder="UPI / Card"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), focusNext('notes'))}
                className="w-full px-4 py-3 rounded-[16px] bg-[#EBE6DD] dark:bg-[#1A1918] border border-black/5 dark:border-white/10 text-xs font-extrabold text-[#1C1917] dark:text-[#F5F5F3] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold block mb-1">Notes (Optional)</label>
            <input
              ref={refs.notes}
              type="text"
              placeholder="e.g. Split with roomie"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 rounded-[16px] bg-[#EBE6DD] dark:bg-[#1A1918] border border-black/5 dark:border-white/10 text-xs font-extrabold text-[#1C1917] dark:text-[#F5F5F3] focus:outline-none"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3.5 rounded-[18px] bg-[#1C1917] dark:bg-white text-white dark:text-[#1C1917] font-extrabold text-xs shadow-md transition-all touch-shrink flex items-center justify-center gap-2 mt-2"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Save & Track Subscription</span>
        </button>
      </form>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="w-full max-w-md rounded-t-[32px] sm:rounded-[32px] bg-[#EBE6DD] dark:bg-[#121212] border border-black/5 dark:border-white/10 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto no-scrollbar animate-in slide-in-from-bottom-8 duration-300">
          <button
            onClick={() => setIsAddModalOpen(false)}
            className="absolute top-5 right-5 text-[#78746D] hover:text-[#1C1917] font-extrabold text-sm"
          >
            ✕
          </button>
          {formContent}
        </div>
      </div>
    );
  }

  return formContent;
}
