import React from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { CURRENCIES } from '../data/presets';

export default function BalanceCard() {
  const { analytics, currency, setCurrency, formatPrice } = useSubscriptions();

  const totalSpend = analytics?.totalMonthlySpend || 0;

  return (
    <div className="relative overflow-hidden rounded-[26px] bg-[#DF4F38] text-white p-5 sm:p-6 shadow-terracotta transition-all">
      {/* Top Row: Balance label & date indicator */}
      <div className="flex items-center justify-between mb-1">
        <div>
          <span className="text-xs font-extrabold tracking-wide uppercase opacity-95">
            Balance
          </span>
          <span className="text-[10px] font-semibold opacity-80 block">
            Total Monthly Spend
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Currency Switcher */}
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-black/20 hover:bg-black/30 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full border border-white/20 focus:outline-none cursor-pointer"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code} className="text-slate-900 bg-white">
                {c.symbol} {c.code}
              </option>
            ))}
          </select>

          <span className="text-[11px] font-bold opacity-80 tracking-wider">
            01/27
          </span>
        </div>
      </div>

      {/* Main Spend Amount - Pure Live Total */}
      <div className="mt-2">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          {formatPrice(totalSpend)}
        </h2>
      </div>
    </div>
  );
}
