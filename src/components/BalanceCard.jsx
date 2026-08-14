import React, { useState, useRef, useEffect } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { CURRENCIES } from '../data/presets';
import { ChevronDown, Check } from 'lucide-react';

export default function BalanceCard() {
  const { analytics, currency, setCurrency, formatPrice } = useSubscriptions();
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const currencyRef = useRef(null);

  const totalSpend = analytics?.totalMonthlySpend || 0;
  const selectedCurrency = CURRENCIES.find(c => c.code === currency);

  useEffect(() => {
    const handler = (e) => { if (currencyRef.current && !currencyRef.current.contains(e.target)) setCurrencyOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative rounded-[26px] bg-[#DF4F38] text-white p-5 sm:p-6 shadow-terracotta transition-all">
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
          {/* Currency Switcher — custom dropdown */}
          <div ref={currencyRef} className="relative">
            <button
              type="button"
              onClick={() => setCurrencyOpen(o => !o)}
              className="flex items-center gap-1.5 bg-black/20 hover:bg-black/30 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full border border-white/20 focus:outline-none cursor-pointer transition-colors"
            >
              <span>{selectedCurrency?.symbol} {currency}</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${currencyOpen ? 'rotate-180' : ''}`} />
            </button>

            {currencyOpen && (
              <div className="absolute right-0 mt-1.5 z-50 rounded-[14px] bg-white shadow-xl border border-black/8 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150 min-w-[100px]">
                {CURRENCIES.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => { setCurrency(c.code); setCurrencyOpen(false); }}
                    className={`w-full px-3 py-2 flex items-center justify-between text-xs font-extrabold transition-colors text-left ${
                      c.code === currency
                        ? 'bg-[#DF4F38]/10 text-[#DF4F38]'
                        : 'text-[#1C1917] hover:bg-[#F5F2EE]'
                    }`}
                  >
                    <span>{c.symbol} {c.code}</span>
                    {c.code === currency && <Check className="w-3 h-3" />}
                  </button>
                ))}
              </div>
            )}
          </div>

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
