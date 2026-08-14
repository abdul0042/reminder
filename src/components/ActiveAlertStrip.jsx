import React from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { Bell, X } from 'lucide-react';

export default function ActiveAlertStrip() {
  const { generalReminders, deleteGeneralReminder, toggleGeneralReminderComplete } = useSubscriptions();

  // Show only 'rang' reminders that haven't been completed yet
  const activeAlerts = (generalReminders || []).filter(r => r.status === 'rang' && !r.completed);

  if (activeAlerts.length === 0) return null;

  // Show the most recent rang alert
  const alert = activeAlerts[0];

  return (
    <div className="animate-in slide-in-from-top-2 duration-300">
      <div className="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-[16px] bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700">
        <div className="flex items-center gap-2 min-w-0">
          <Bell className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 animate-bounce" />
          <span className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300 truncate">
            🔔 {alert.title}
          </span>
          {activeAlerts.length > 1 && (
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex-shrink-0">
              +{activeAlerts.length - 1} more
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => toggleGeneralReminderComplete(alert.id)}
            className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
          >
            Dismiss
          </button>
          <button
            onClick={() => deleteGeneralReminder(alert.id)}
            className="w-6 h-6 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
