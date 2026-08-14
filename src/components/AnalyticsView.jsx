import React from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { PieChart, TrendingUp, Award, Lightbulb, CreditCard } from 'lucide-react';

export default function AnalyticsView() {
  const { analytics, formatPrice, subscriptions } = useSubscriptions();

  const totalMonthlySpend = analytics?.totalMonthlySpend || 0;
  const totalYearlyProjected = analytics?.totalYearlyProjected || 0;
  const categoryBreakdown = analytics?.categoryBreakdown || {};
  const topExpenses = analytics?.topExpenses || [];

  const categoriesList = Object.entries(categoryBreakdown).map(([cat, amount]) => ({
    name: cat,
    amount,
    percentage: Math.round((amount / (totalMonthlySpend || 1)) * 100)
  })).sort((a, b) => b.amount - a.amount);

  if (subscriptions.length === 0) {
    return (
      <div className="py-12 px-6 rounded-[32px] bg-[#E2DDD4] border border-black/5 text-center space-y-3 my-4 text-[#1C1917]">
        <div className="w-12 h-12 rounded-2xl bg-[#DF4F38] text-white mx-auto flex items-center justify-center shadow-sm">
          <PieChart className="w-6 h-6" />
        </div>
        <h3 className="font-extrabold text-base">
          No analytics data yet
        </h3>
        <p className="text-xs font-semibold text-[#78746D] max-w-xs mx-auto">
          Add your active subscriptions to view live category breakdowns, projected annual outflow, and savings recommendations.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300 text-[#1C1917]">
      
      {/* Top Banner: Financial Overview */}
      <div className="p-5 rounded-[26px] bg-[#DF4F38] text-white shadow-terracotta relative overflow-hidden">
        <div className="flex items-center gap-2 text-white/90 text-xs font-extrabold uppercase tracking-wider mb-2">
          <PieChart className="w-4 h-4" />
          <span>Financial Overview</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-xs text-white/80 font-bold">Monthly Outflow</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
              {formatPrice(totalMonthlySpend)}
            </div>
          </div>

          <div>
            <span className="text-xs text-white/80 font-bold">Yearly Forecast</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
              {formatPrice(totalYearlyProjected)}
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown Progress Bars */}
      <div className="p-5 rounded-[26px] bg-[#E2DDD4] border border-black/5 space-y-4 text-[#1C1917]">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#DF4F38]" />
            Category Breakdown
          </h3>
          <span className="text-xs font-bold text-[#78746D]">
            {categoriesList.length} categories
          </span>
        </div>

        <div className="space-y-3">
          {categoriesList.map((cat) => (
            <div key={cat.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-extrabold">
                <span>{cat.name}</span>
                <span>{formatPrice(cat.amount)}/mo ({cat.percentage}%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#EBE6DD] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#1C1917] transition-all duration-500"
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Expenses Spotlight */}
      {topExpenses.length > 0 && (
        <div className="p-5 rounded-[26px] bg-[#E2DDD4] border border-black/5 space-y-3 text-[#1C1917]">
          <h3 className="font-extrabold text-sm flex items-center gap-2">
            <Award className="w-4 h-4 text-[#DF4F38]" />
            Top Monthly Expenses
          </h3>

          <div className="space-y-2">
            {topExpenses.map((sub, idx) => (
              <div
                key={sub.id}
                className="flex items-center justify-between p-3 rounded-[18px] bg-[#EBE6DD] border border-black/5"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#1C1917] text-white font-extrabold text-xs flex items-center justify-center">
                    #{idx + 1}
                  </span>
                  <div>
                    <h4 className="font-extrabold text-xs">
                      {sub.serviceName}
                    </h4>
                    <span className="text-[10px] text-[#78746D] font-bold">
                      {sub.planType || 'Standard'}
                    </span>
                  </div>
                </div>

                <div className="font-extrabold text-xs">
                  {formatPrice(sub.price)}/mo
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Smart Optimization Suggestions */}
      <div className="p-4 rounded-[22px] bg-[#E2DDD4] border border-black/5 flex items-start gap-3 text-[#1C1917]">
        <Lightbulb className="w-5 h-5 text-[#DF4F38] flex-shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <h4 className="font-extrabold text-sm">Smart Saving Recommendation</h4>
          <p className="font-medium text-[#78746D]">
            Switching to annual billing or bundling your active subscriptions can help optimize your monthly outflow.
          </p>
        </div>
      </div>

    </div>
  );
}
