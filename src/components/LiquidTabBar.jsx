import React, { useState, useEffect } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { LayoutDashboard, PieChart, Plus, Settings } from 'lucide-react';

export default function LiquidTabBar() {
  const { activeTab, setActiveTab } = useSubscriptions();

  const [prevIndex, setPrevIndex] = useState(0);
  const [direction, setDirection] = useState('none');
  const [isStretching, setIsStretching] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'add', label: 'Add', icon: Plus, isAdd: true },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const getActiveIndex = () => {
    if (activeTab === 'dashboard') return 0;
    if (activeTab === 'analytics') return 1;
    if (activeTab === 'add') return 2;
    if (activeTab === 'settings') return 3;
    return 0;
  };

  const activeIndex = getActiveIndex();

  useEffect(() => {
    if (activeIndex !== prevIndex) {
      setDirection(activeIndex > prevIndex ? 'right' : 'left');
      setIsStretching(true);

      const timer = setTimeout(() => {
        setIsStretching(false);
        setPrevIndex(activeIndex);
      }, 320);

      return () => clearTimeout(timer);
    }
  }, [activeIndex, prevIndex]);

  const handleTabClick = (tabId) => {
    if (tabId !== activeTab) {
      setActiveTab(tabId);
    }
  };

  return (
    <>
      {/* High-Precision SVG Gooey Filter for Liquid Mercury */}
      <svg className="hidden absolute" width="0" height="0" aria-hidden="true">
        <defs>
          <filter id="ultra-liquid-goo" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 24 -9
              "
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Floating Seamless Dynamic Island Navigation Pill (No White Borders) */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-40 w-full max-w-[340px] px-3 pointer-events-auto">
        <div className="w-full relative rounded-full ios-crystal-liquid-glass p-1.5 flex items-center justify-between overflow-hidden">
          
          {/* Liquid Goo Filter Container */}
          <div
            className="absolute inset-0 p-1.5 pointer-events-none"
            style={{ filter: "url('#ultra-liquid-goo')" }}
          >
            {/* Morphing Liquid Active Blob */}
            <div
              className={`h-full rounded-full bg-[#1C1917] dark:bg-white will-change-transform transition-all duration-350 ${
                isStretching
                  ? direction === 'right'
                    ? 'scale-x-[1.4] -skew-x-6'
                    : 'scale-x-[1.4] skew-x-6'
                  : 'scale-100 skew-x-0'
              }`}
              style={{
                width: '25%',
                transform: `translateX(${activeIndex * 100}%)`,
                transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            />
          </div>

          {/* Interactive Navigation Items */}
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`relative z-10 flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-full transition-all duration-300 touch-shrink ${
                  isActive
                    ? 'text-white dark:text-[#1C1917] font-extrabold'
                    : tab.isAdd
                    ? 'text-[#DF4F38] hover:text-[#1C1917] font-extrabold'
                    : 'text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] font-bold'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-all duration-300 ${
                    isActive
                      ? 'stroke-[2.5] scale-110 -translate-y-0.5 text-white dark:text-[#1C1917]'
                      : tab.isAdd
                      ? 'stroke-[3]'
                      : 'stroke-[2.5]'
                  }`}
                />
                <span className={`text-[10px] tracking-tight mt-0.5 whitespace-nowrap transition-all duration-300 ${
                  isActive ? 'text-white dark:text-[#1C1917] font-extrabold' : 'text-[#57534E] dark:text-[#A8A29E] font-bold'
                }`}>
                  {tab.label}
                </span>
              </button>
            );
          })}

        </div>
      </div>
    </>
  );
}
