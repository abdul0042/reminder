import React, { useState } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { Plus, LogOut, LogIn, ShieldCheck, X } from 'lucide-react';

export default function Header() {
  const { user, handleGoogleLogin, handleLogout, setIsAddModalOpen } = useSubscriptions();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <>
      <header className="w-full px-5 py-4 flex items-center justify-between bg-[#EBE6DD] dark:bg-[#121212] transition-colors">
        
        {/* Left: User Profile Avatar & Name (Clickable Profile Modal Trigger) */}
        <div className="flex items-center gap-3">
          {user ? (
            <div 
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-3 cursor-pointer group"
            >
              {/* User Google Profile Avatar Circle */}
              <div className="w-10 h-10 rounded-full bg-[#1C1917] dark:bg-white text-white dark:text-[#1C1917] flex items-center justify-center font-extrabold text-sm shadow-sm overflow-hidden border-2 border-white/60 dark:border-white/20 flex-shrink-0 group-hover:scale-105 transition-transform">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{(user.displayName || user.email || 'U').charAt(0).toUpperCase()}</span>
                )}
              </div>

              <div className="min-w-0">
                <h1 className="text-sm sm:text-base font-extrabold text-[#1C1917] dark:text-[#F5F5F3] tracking-tight leading-tight truncate max-w-[130px] sm:max-w-none group-hover:text-[#DF4F38] transition-colors">
                  {user.displayName || 'UnSub User'}
                </h1>
                <p className="text-[10px] sm:text-[11px] font-semibold text-[#78746D] dark:text-[#A8A29E] truncate max-w-[130px] sm:max-w-none">
                  {user.email}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* App Logo Emblem when logged out */}
              <div className="w-10 h-10 rounded-2xl bg-white dark:bg-[#1F1E1B] p-1 shadow-sm border border-black/5 dark:border-white/10 flex items-center justify-center flex-shrink-0">
                <img src="/logo.png" alt="UnSub Logo" className="w-full h-full object-contain rounded-xl" />
              </div>

              <div>
                <h1 className="text-base font-extrabold text-[#1C1917] dark:text-[#F5F5F3] tracking-tight">
                  UnSub
                </h1>
                <p className="text-[11px] font-semibold text-[#78746D] dark:text-[#A8A29E]">
                  Subscription Tracker
                </p>
              </div>
            </>
          )}
        </div>

        {/* Right: Quick Actions */}
        <div className="flex items-center gap-2">
          {user ? (
            <button
              onClick={() => setIsAddModalOpen(true)}
              aria-label="Add Subscription"
              className="w-10 h-10 rounded-full bg-[#E2DDD4] dark:bg-[#24221E] text-[#1C1917] dark:text-[#F5F5F3] flex items-center justify-center transition-all touch-shrink border border-black/5 dark:border-white/10"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </button>
          ) : (
            <button
              onClick={handleGoogleLogin}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1C1917] dark:bg-white text-white dark:text-[#1C1917] text-xs font-extrabold shadow-sm transition-all touch-shrink"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </header>

      {/* User Profile Modal */}
      {isProfileModalOpen && user && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-t-[32px] sm:rounded-[32px] bg-[#EBE6DD] dark:bg-[#121212] border border-black/5 dark:border-white/10 shadow-2xl p-6 text-[#1C1917] dark:text-[#F5F5F3] space-y-5 animate-in slide-in-from-bottom-8 duration-300 relative text-center">
            
            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#E2DDD4] dark:bg-[#24221E] flex items-center justify-center text-[#78746D] hover:text-[#1C1917]"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Large User Avatar */}
            <div className="w-20 h-20 rounded-full bg-[#1C1917] dark:bg-white text-white dark:text-[#1C1917] flex items-center justify-center font-extrabold text-2xl mx-auto shadow-md overflow-hidden border-4 border-white/80 dark:border-black/50">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
              ) : (
                <span>{(user.displayName || user.email || 'U').charAt(0).toUpperCase()}</span>
              )}
            </div>

            {/* Profile Info */}
            <div className="space-y-1">
              <h2 className="text-lg font-extrabold tracking-tight">
                {user.displayName || 'UnSub User'}
              </h2>
              <p className="text-xs font-semibold text-[#78746D] dark:text-[#A8A29E]">
                {user.email}
              </p>
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 mt-2 border border-emerald-300 dark:border-emerald-700">
                <ShieldCheck className="w-3 h-3" /> Connected Google Account
              </span>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={() => {
                setIsProfileModalOpen(false);
                handleLogout();
              }}
              className="w-full py-3.5 rounded-[18px] bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-extrabold text-xs flex items-center justify-center gap-2 transition-all touch-shrink border border-rose-500/20"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of Account</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
