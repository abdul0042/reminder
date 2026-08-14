import React from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { Plus, LogOut, LogIn, Moon, Sun } from 'lucide-react';

export default function Header() {
  const { user, handleGoogleLogin, handleLogout, setIsAddModalOpen, darkMode, toggleDarkMode } = useSubscriptions();

  return (
    <header className="w-full px-5 py-4 flex items-center justify-between bg-[#EBE6DD] dark:bg-[#121212] transition-colors">
      
      {/* Left: User Profile Avatar & Name (or UnSub Brand when logged out) */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            {/* User Google Profile Avatar Circle (NOT the app logo) */}
            <div className="w-10 h-10 rounded-full bg-[#1C1917] dark:bg-white text-white dark:text-[#1C1917] flex items-center justify-center font-extrabold text-sm shadow-sm overflow-hidden border-2 border-white/60 dark:border-white/20 flex-shrink-0">
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
              <h1 className="text-sm sm:text-base font-extrabold text-[#1C1917] dark:text-[#F5F5F3] tracking-tight leading-tight truncate max-w-[140px] sm:max-w-none">
                {user.displayName || 'UnSub User'}
              </h1>
              <p className="text-[10px] sm:text-[11px] font-semibold text-[#78746D] dark:text-[#A8A29E] truncate max-w-[140px] sm:max-w-none">
                {user.email}
              </p>
            </div>
          </>
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

      {/* Right: Theme Toggle & Quick Actions */}
      <div className="flex items-center gap-2">
        {/* Quick Theme Toggle Button */}
        <button
          onClick={toggleDarkMode}
          title={darkMode ? "Switch to Light Theme" : "Switch to Dark Theme"}
          className="w-10 h-10 rounded-full bg-[#E2DDD4] dark:bg-[#24221E] text-[#1C1917] dark:text-[#F5F5F3] flex items-center justify-center transition-all touch-shrink border border-black/5 dark:border-white/10"
        >
          {darkMode ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-[#1C1917]" />
          )}
        </button>

        {user ? (
          <>
            <button
              onClick={() => setIsAddModalOpen(true)}
              aria-label="Add Subscription"
              className="w-10 h-10 rounded-full bg-[#E2DDD4] dark:bg-[#24221E] text-[#1C1917] dark:text-[#F5F5F3] flex items-center justify-center transition-all touch-shrink border border-black/5 dark:border-white/10"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </button>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="w-10 h-10 rounded-full bg-[#E2DDD4] dark:bg-[#24221E] text-[#1C1917] dark:text-[#F5F5F3] hover:text-rose-600 flex items-center justify-center transition-all touch-shrink border border-black/5 dark:border-white/10"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </>
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
  );
}
