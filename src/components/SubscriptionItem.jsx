import React, { useState } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { getLogoUrl } from '../utils/getLogoUrl';

export default function SubscriptionItem({ item }) {
  const { setSelectedSub, formatPrice } = useSubscriptions();
  const [logoError, setLogoError] = useState(false);

  const getCardStyle = (name, category) => {
    const n = (name || '').toLowerCase();
    if (n.includes('netflix')) return { bg: '#ABC1DE', text: '#1C1917' };
    if (n.includes('spotify')) return { bg: '#EAD779', text: '#1C1917' };
    if (n.includes('medium') || n.includes('adobe')) return { bg: '#98C5B3', text: '#1C1917' };
    if (n.includes('youtube') || n.includes('google')) return { bg: '#F2C5C2', text: '#1C1917' };
    
    switch (category?.toLowerCase()) {
      case 'music': return { bg: '#EAD779', text: '#1C1917' };
      case 'entertainment': return { bg: '#ABC1DE', text: '#1C1917' };
      case 'design': case 'productivity': return { bg: '#98C5B3', text: '#1C1917' };
      case 'ai & tech': return { bg: '#C5B4E3', text: '#1C1917' };
      default: return { bg: '#E2DDD4', text: '#1C1917' };
    }
  };

  const style = getCardStyle(item.serviceName, item.category);

  // Format real date from nextBillingDate
  const formattedDate = item.nextBillingDate
    ? new Date(item.nextBillingDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
    : (item.planType || 'Standard');

  const logoUrl = getLogoUrl(item.serviceName, item.website);

  return (
    <div
      onClick={() => setSelectedSub(item)}
      className="p-4 rounded-[24px] flex items-center justify-between cursor-pointer hover:opacity-95 transition-all touch-shrink shadow-soft-sm"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {/* Left: Real Black Brand Logo + Title + Real Date */}
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-11 h-11 rounded-2xl bg-white/80 dark:bg-white/90 p-2 flex items-center justify-center flex-shrink-0 shadow-sm border border-black/10 overflow-hidden">
          {logoUrl && !logoError ? (
            <img
              src={logoUrl}
              alt={item.serviceName}
              onError={() => setLogoError(true)}
              className="w-full h-full object-contain grayscale contrast-200"
            />
          ) : (
            <span className="font-extrabold text-base text-[#1C1917]">
              {(item.serviceName || 'S').charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div className="min-w-0">
          <h3 className="font-extrabold text-sm sm:text-base tracking-tight truncate">
            {item.serviceName}
          </h3>
          <p className="text-xs font-semibold opacity-75 truncate">
            {formattedDate}
          </p>
        </div>
      </div>

      {/* Right: Price & Frequency */}
      <div className="text-right flex-shrink-0 ml-2">
        <div className="font-extrabold text-sm sm:text-base">
          {formatPrice(item.price)}
        </div>
        <div className="text-[11px] font-bold opacity-75">
          per {item.billingCycle === 'yearly' ? 'year' : 'month'}
        </div>
      </div>
    </div>
  );
}
