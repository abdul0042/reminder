import React from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';

export default function UpcomingSlider() {
  const { subscriptions, setSelectedSub, formatPrice, setActiveTab } = useSubscriptions();

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
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 4);

  if (upcomingItems.length === 0) {
    return null; // Clean - No mock data fallback
  }

  return (
    <div className="space-y-3">
      {/* Section Heading */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-[#1C1917] tracking-tight">
          Upcoming
        </h2>

        <button
          onClick={() => setActiveTab('subscriptions')}
          className="text-xs font-bold px-3 py-1 rounded-full bg-[#E2DDD4] text-[#1C1917] hover:bg-[#D5CFC5] transition-colors"
        >
          View All
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 gap-3">
        {upcomingItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedSub(item)}
            className="p-4 rounded-[22px] bg-[#E2DDD4] text-[#1C1917] flex flex-col justify-between h-[115px] cursor-pointer hover:bg-[#D5CFC5] transition-all touch-shrink"
          >
            {/* Top Row: Icon & Price */}
            <div className="flex items-start justify-between">
              <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-black text-xs shadow-sm">
                {item.serviceName.charAt(0)}
              </div>
              <span className="font-extrabold text-sm">
                {formatPrice(item.price)}
              </span>
            </div>

            {/* Bottom Row: Name & Days Left */}
            <div className="flex items-end justify-between gap-1">
              <span className="font-bold text-xs truncate max-w-[90px]">
                {item.serviceName}
              </span>
              <span className="text-[10px] font-semibold text-[#78746D] whitespace-nowrap">
                {item.daysLeft <= 0 ? 'Due Today' : `${item.daysLeft} days left`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
