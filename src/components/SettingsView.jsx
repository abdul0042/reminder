import React, { useState } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { CURRENCIES } from '../data/presets';
import { 
  User, LogOut, Bell, Database, ShieldCheck, 
  Download, RefreshCw, Smartphone, Check, Moon, Sun, Send, BellOff 
} from 'lucide-react';

export default function SettingsView() {
  const { 
    user, 
    handleLogout, 
    currency, 
    setCurrency, 
    subscriptions, 
    refreshData, 
    showToast,
    installPWA,
    canInstallPWA,
    isPWAInstalled,
    darkMode,
    toggleDarkMode,
    notificationsEnabled,
    requestNotificationPermission,
    sendTestNotification
  } = useSubscriptions();

  const [reminderDays, setReminderDays] = useState('3');

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(subscriptions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `unsub_subscriptions_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported subscription data as JSON!', 'success');
  };

  const handleSyncData = async () => {
    await refreshData();
    showToast('Synced data with Firebase Firestore!', 'success');
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300 text-[#1C1917] dark:text-[#F5F5F3]">
      
      {/* Page Title Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="UnSub Logo" className="w-5 h-5 object-contain" />
          <h2 className="text-lg font-extrabold tracking-tight">
            Settings & Preferences
          </h2>
        </div>
        <span className="text-xs font-bold text-[#78746D] dark:text-[#A8A29E]">
          UnSub v2.0
        </span>
      </div>

      {/* 1. Prominent PWA Download / Install Section */}
      <div className="p-5 rounded-[26px] bg-[#DF4F38] text-white shadow-terracotta space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            <h3 className="font-extrabold text-sm tracking-tight">
              Install UnSub App
            </h3>
          </div>
          {isPWAInstalled && (
            <span className="flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
              <Check className="w-3 h-3" /> Installed
            </span>
          )}
        </div>

        <p className="text-xs text-white/90 font-medium leading-relaxed">
          Add UnSub to your mobile home screen or desktop as a native app for fast, offline access.
        </p>

        <button
          onClick={installPWA}
          className="w-full py-3.5 rounded-[18px] bg-white text-[#DF4F38] hover:bg-slate-50 font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all touch-shrink"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>{isPWAInstalled ? 'App Ready on Device' : 'Download & Install UnSub App'}</span>
        </button>
      </div>

      {/* 2. Device Push Notifications Card */}
      <div className="p-5 rounded-[26px] bg-[#E2DDD4] dark:bg-[#24221E] border border-black/5 dark:border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#78746D] dark:text-[#A8A29E]">
            Device Renewal Alerts
          </h3>
          <span className={`flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
            notificationsEnabled 
              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300'
              : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300'
          }`}>
            {notificationsEnabled ? <Bell className="w-3 h-3" /> : <BellOff className="w-3 h-3" />}
            <span>{notificationsEnabled ? 'Active 🔔' : 'Disabled'}</span>
          </span>
        </div>

        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#DF4F38]/10 text-[#DF4F38]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-xs block">Bill Renewal Alerts</span>
              <span className="text-[11px] font-medium text-[#78746D] dark:text-[#A8A29E]">
                Get notified before subscriptions charge you
              </span>
            </div>
          </div>

          <button
            onClick={requestNotificationPermission}
            className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-300 relative focus:outline-none ${
              notificationsEnabled ? 'bg-[#DF4F38]' : 'bg-[#C5BEB3]'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 flex items-center justify-center ${
                notificationsEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            >
              <Bell className={`w-3 h-3 ${notificationsEnabled ? 'text-[#DF4F38]' : 'text-slate-400'}`} />
            </div>
          </button>
        </div>

        {notificationsEnabled && (
          <button
            onClick={sendTestNotification}
            className="w-full py-2.5 rounded-[16px] bg-[#EBE6DD] dark:bg-[#1A1918] hover:bg-[#D5CFC5] dark:hover:bg-[#2B2824] text-xs font-extrabold flex items-center justify-center gap-2 transition-all touch-shrink border border-black/5 dark:border-white/10"
          >
            <Send className="w-3.5 h-3.5 text-[#DF4F38]" />
            <span>Send Test Notification to Device</span>
          </button>
        )}
      </div>

      {/* 3. Theme & Dark Mode Switch */}
      <div className="p-5 rounded-[26px] bg-[#E2DDD4] dark:bg-[#24221E] border border-black/5 dark:border-white/5 space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#78746D] dark:text-[#A8A29E]">
          Appearance & Theme
        </h3>

        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2.5">
            {darkMode ? (
              <div className="p-2 rounded-xl bg-amber-400/20 text-amber-400">
                <Moon className="w-4 h-4" />
              </div>
            ) : (
              <div className="p-2 rounded-xl bg-orange-500/10 text-orange-600">
                <Sun className="w-4 h-4" />
              </div>
            )}
            <div>
              <span className="font-extrabold text-xs block">Dark Theme Mode</span>
              <span className="text-[11px] font-medium text-[#78746D] dark:text-[#A8A29E]">
                {darkMode ? 'Deep Obsidian Dark Theme' : 'Warm Creamish Light Theme'}
              </span>
            </div>
          </div>

          <button
            onClick={toggleDarkMode}
            className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-300 relative focus:outline-none ${
              darkMode ? 'bg-[#DF4F38]' : 'bg-[#C5BEB3]'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 flex items-center justify-center ${
                darkMode ? 'translate-x-6' : 'translate-x-0'
              }`}
            >
              {darkMode ? (
                <Moon className="w-3 h-3 text-[#1C1917]" />
              ) : (
                <Sun className="w-3 h-3 text-[#DF4F38]" />
              )}
            </div>
          </button>
        </div>
      </div>

      {/* 4. Profile & Account Card */}
      <div className="p-5 rounded-[26px] bg-[#E2DDD4] dark:bg-[#24221E] border border-black/5 dark:border-white/5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#1C1917] dark:bg-white dark:text-[#1C1917] text-white flex items-center justify-center font-extrabold text-base overflow-hidden border-2 border-white/80 dark:border-black/50">
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
            ) : (
              <span>{(user?.displayName || user?.email || 'U').charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-extrabold text-base leading-tight truncate">
              {user?.displayName || 'UnSub User'}
            </h3>
            <p className="text-xs font-semibold text-[#78746D] dark:text-[#A8A29E] truncate">
              {user?.email || 'Logged in via Google'}
            </p>
          </div>
          <span className="flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
            <ShieldCheck className="w-3 h-3" /> Connected
          </span>
        </div>

        {user && (
          <button
            onClick={handleLogout}
            className="w-full py-2.5 rounded-[16px] bg-[#1C1917] dark:bg-white dark:text-[#1C1917] hover:bg-black text-white text-xs font-extrabold flex items-center justify-center gap-2 transition-all touch-shrink"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of Account</span>
          </button>
        )}
      </div>

      {/* 5. Preferences & Currency */}
      <div className="p-5 rounded-[26px] bg-[#E2DDD4] dark:bg-[#24221E] border border-black/5 dark:border-white/5 space-y-4">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#78746D] dark:text-[#A8A29E]">
          Preferences & Currency
        </h3>

        {/* Currency Picker */}
        <div className="flex items-center justify-between py-1">
          <div>
            <span className="font-extrabold text-xs block">Default Currency</span>
            <span className="text-[11px] font-medium text-[#78746D] dark:text-[#A8A29E]">Primary display currency</span>
          </div>

          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="px-3 py-1.5 rounded-[14px] bg-[#EBE6DD] dark:bg-[#1A1918] border border-black/5 dark:border-white/10 text-xs font-extrabold text-[#1C1917] dark:text-[#F5F5F3] focus:outline-none cursor-pointer"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.symbol} {c.code}
              </option>
            ))}
          </select>
        </div>

        <div className="h-px bg-black/5 dark:bg-white/5" />

        {/* Renewal Reminder Threshold */}
        <div className="flex items-center justify-between py-1">
          <div>
            <span className="font-extrabold text-xs block">Renewal Alert Countdown</span>
            <span className="text-[11px] font-medium text-[#78746D] dark:text-[#A8A29E]">Highlight upcoming bills</span>
          </div>

          <select
            value={reminderDays}
            onChange={(e) => setReminderDays(e.target.value)}
            className="px-3 py-1.5 rounded-[14px] bg-[#EBE6DD] dark:bg-[#1A1918] border border-black/5 dark:border-white/10 text-xs font-extrabold text-[#1C1917] dark:text-[#F5F5F3] focus:outline-none cursor-pointer"
          >
            <option value="1">1 Day Before</option>
            <option value="3">3 Days Before</option>
            <option value="7">7 Days Before</option>
          </select>
        </div>
      </div>

      {/* 6. Database & Storage */}
      <div className="p-5 rounded-[26px] bg-[#E2DDD4] dark:bg-[#24221E] border border-black/5 dark:border-white/5 space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#78746D] dark:text-[#A8A29E]">
          Database & Storage
        </h3>

        <div className="flex items-center justify-between text-xs font-extrabold py-1">
          <span className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#DF4F38]" />
            Firebase Firestore DB
          </span>
          <span className="text-[11px] text-[#78746D] dark:text-[#A8A29E] font-bold">
            reminder-94d10
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleSyncData}
            className="py-2.5 px-3 rounded-[16px] bg-[#EBE6DD] dark:bg-[#1A1918] hover:bg-[#D5CFC5] font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Force Sync</span>
          </button>

          <button
            onClick={handleExportData}
            className="py-2.5 px-3 rounded-[16px] bg-[#EBE6DD] dark:bg-[#1A1918] hover:bg-[#D5CFC5] font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

    </div>
  );
}
