import React from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { LayoutDashboard, CreditCard, PieChart, Plus } from 'lucide-react';

export default function MobileBottomNav() {
  const { activeTab, setActiveTab, setIsAddModalOpen, subscriptions } = useSubscriptions();

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'subscriptions', label: 'Plans', icon: CreditCard, count: subscriptions.length },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-4 py-2 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 transition-colors sm:hidden">
      <div className="max-w-md mx-auto flex items-center justify-around relative">
        
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all touch-shrink relative ${
                isActive
                  ? 'text-rose-500 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] tracking-tight">{item.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 absolute -bottom-0.5" />
              )}
            </button>
          );
        })}

        {/* Center Floating Plus Button for Mobile */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-3 text-amber-500 hover:text-amber-600 transition-colors touch-shrink"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-md -mt-3 border-2 border-white dark:border-slate-950">
            <Plus className="w-4 h-4 stroke-[3]" />
          </div>
          <span className="text-[10px] font-bold tracking-tight text-slate-700 dark:text-slate-300">New</span>
        </button>

      </div>
    </div>
  );
}
