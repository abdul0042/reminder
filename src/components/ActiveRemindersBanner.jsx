import React, { useState, useEffect } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { Clock, X, Bell } from 'lucide-react';

export default function ActiveRemindersBanner() {
  const { activeReminders, cancelReminder } = useSubscriptions();
  const [, setTick] = useState(0);

  // Force re-render every 1 sec to update remaining time countdown
  useEffect(() => {
    if (activeReminders.length === 0) return;
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [activeReminders.length]);

  if (activeReminders.length === 0) return null;

  const formatRemaining = (fireAt) => {
    const diff = Math.max(0, Math.ceil((fireAt - Date.now()) / 1000));
    const mins = Math.floor(diff / 60);
    const secs = diff % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  return (
    <div className="space-y-2 animate-in fade-in duration-300">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#DF4F38] flex items-center gap-1.5">
          <Bell className="w-3.5 h-3.5 animate-bounce-short text-[#DF4F38]" />
          <span>Active Reminders & Alarms</span>
        </h3>
      </div>

      <div className="space-y-2">
        {activeReminders.map((rem) => (
          <div
            key={rem.id}
            className="p-3.5 rounded-[20px] bg-[#DF4F38]/10 dark:bg-[#DF4F38]/20 border border-[#DF4F38]/30 flex items-center justify-between text-xs font-bold text-[#1C1917] dark:text-[#F5F5F3]"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 rounded-xl bg-[#DF4F38] text-white flex-shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="font-extrabold truncate block">
                  {rem.serviceName}
                </span>
                <span className="text-[10px] text-[#78746D] dark:text-[#A8A29E] font-semibold">
                  Fires in {formatRemaining(rem.fireAt)}
                </span>
              </div>
            </div>

            <button
              onClick={() => cancelReminder(rem.id)}
              className="p-1.5 rounded-full bg-black/5 dark:bg-white/10 hover:bg-rose-500 hover:text-white transition-colors"
              title="Cancel Reminder"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
