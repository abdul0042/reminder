import React, { useState, useEffect } from 'react';

export default function SplashLoader({ onComplete }) {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setFade(true);
    }, 1200);

    const timer2 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 1600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#EBE6DD] dark:bg-[#121212] flex flex-col items-center justify-center transition-opacity duration-400 ease-out ${
        fade ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center space-y-4 animate-in zoom-in-95 duration-500">
        
        {/* UnSub Logo with Glow Ring */}
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl bg-[#DF4F38]/10 dark:bg-white/5 absolute -inset-2 blur-xl animate-pulse" />
          <img
            src="/logo.png"
            alt="UnSub Logo"
            className="w-24 h-24 object-contain rounded-3xl shadow-xl border border-black/5 dark:border-white/10 relative z-10 animate-bounce-short"
          />
        </div>

        {/* Brand Text */}
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-[#1C1917] dark:text-[#F5F5F3] tracking-tight">
            UnSub
          </h1>
          <p className="text-xs font-semibold text-[#78746D] dark:text-[#A8A29E] tracking-wide mt-0.5">
            Subscription Tracker
          </p>
        </div>

        {/* Minimal Progress Line */}
        <div className="w-28 h-1 rounded-full bg-[#E2DDD4] dark:bg-[#24221E] overflow-hidden mt-3">
          <div className="h-full bg-[#DF4F38] rounded-full animate-progress" />
        </div>

      </div>
    </div>
  );
}
