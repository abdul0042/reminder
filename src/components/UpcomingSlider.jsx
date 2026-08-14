import React, { useState } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { getLogoUrl } from '../utils/getLogoUrl';

function UpcomingCard({ item }) {
  const { setSelectedSub, formatPrice } = useSubscriptions();
  const [logoError, setLogoError] = useState(false);
  const logoUrl = getLogoUrl(item.serviceName, item.website);

  return (
    <div
      onClick={() => setSelectedSub(item)}
      className="w-[138px] flex-shrink-0 p-3 rounded-[20px] bg-[#E2DDD4] dark:bg-[#24221E] border border-black/5 dark:border-white/5 text-[#1C1917] dark:text-[#F5F5F3] flex flex-col justify-between h-[98px] cursor-pointer hover:bg-[#D5CFC5] dark:hover:bg-[#2C2A26] transition-all touch-shrink shadow-soft-sm"
    >
      {/* Top Row: Real Black Brand Logo & Price */}
      <div className="flex items-center justify-between">
        <div className="w-7 h-7 rounded-xl bg-white/90 dark:bg-white/90 p-1 flex items-center justify-center font-black text-xs shadow-sm border border-black/10 overflow-hidden flex-shrink-0">
          {logoUrl && !logoError ? (
            <img
              src={logoUrl}
              alt={item.serviceName}
              onError={() => setLogoError(true)}
              className="w-full h-full object-contain grayscale contrast-200"
            />
          ) : (
            <span className="font-extrabold text-xs text-[#1C1917]">
              {(item.serviceName || 'S').charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <span className="font-extrabold text-sm truncate ml-1">
          {formatPrice(item.price)}
        </span>
      </div>

      {/* Bottom Row: Name & Days Left */}
      <div className="space-y-0.5 min-w-0">
        <span className="font-bold text-xs truncate block">
          {item.serviceName}
        </span>
        <span className="text-[10px] font-semibold text-[#78746D] dark:text-[#A8A29E] block">
          {item.daysLeft <= 0 ? 'Due Today' : `${item.daysLeft} days left`}
        </span>
      </div>
    </div>
  );
}

export default function UpcomingSlider() {
  const { subscriptions, setActiveTab } = useSubscriptions();

  const getDaysLeft = (dateStr) => {
    if (!dateStr) return 999;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    const diffTime = target - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Live active items sorted by nearest renewal date
  const upcomingItems = subscriptions
    .filter(s => s.status === 'active')
    .map(s => ({
      ...s,
      daysLeft: getDaysLeft(s.nextBillingDate)
    }))
    .sort((a, b) => a.daysLeft - b.daysLeft);

  if (upcomingItems.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2.5">
      {/* Section Heading */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-[#1C1917] dark:text-[#F5F5F3] tracking-tight">
          Upcoming
        </h2>

        <button
          onClick={() => setActiveTab('subscriptions')}
          className="text-xs font-bold px-3 py-1 rounded-full bg-[#E2DDD4] dark:bg-[#24221E] text-[#1C1917] dark:text-[#F5F5F3] hover:bg-[#D5CFC5] transition-colors"
        >
          View All
        </button>
      </div>

      {/* Horizontal Scrollable Row */}
      <div className="flex flex-nowrap overflow-x-auto no-scrollbar gap-2.5 -mx-5 px-5 py-1">
        {upcomingItems.map((item) => (
          <UpcomingCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
