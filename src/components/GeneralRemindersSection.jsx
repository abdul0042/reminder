import React, { useState } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { Bell, Plus, CheckCircle2, Circle, Trash2, X, Clock } from 'lucide-react';

export default function GeneralRemindersSection() {
  const { 
    generalReminders, 
    addGeneralReminder, 
    toggleGeneralReminderComplete, 
    deleteGeneralReminder,
    isGeneralReminderModalOpen,
    setIsGeneralReminderModalOpen
  } = useSubscriptions();

  const [title, setTitle] = useState('');
  const [minutes, setMinutes] = useState('15');
  const [note, setNote] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    addGeneralReminder(title.trim(), parseFloat(minutes) || 5, note.trim());
    setTitle('');
    setMinutes('15');
    setNote('');
    setIsGeneralReminderModalOpen(false);
  };

  return (
    <div className="space-y-3">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Bell className="w-4 h-4 text-[#DF4F38]" />
          <h2 className="text-base font-bold text-[#1C1917] dark:text-[#F5F5F3] tracking-tight">
            General Reminders & Tasks
          </h2>
        </div>

        <button
          onClick={() => setIsGeneralReminderModalOpen(true)}
          className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#DF4F38] text-white font-extrabold text-xs shadow-sm hover:opacity-90 transition-all touch-shrink"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>New Task</span>
        </button>
      </div>

      {/* Task List */}
      {generalReminders.length === 0 ? (
        <div className="p-4 rounded-[22px] bg-[#E2DDD4]/60 dark:bg-[#24221E]/60 border border-black/5 dark:border-white/5 text-center text-xs font-semibold text-[#78746D] dark:text-[#A8A29E]">
          No general tasks added. Tap "+ New Task" to set a quick reminder!
        </div>
      ) : (
        <div className="space-y-2">
          {generalReminders.map((task) => (
            <div
              key={task.id}
              className={`p-3.5 rounded-[20px] border flex items-center justify-between transition-all ${
                task.status === 'rang'
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700'
                  : task.completed
                  ? 'bg-[#E2DDD4]/50 dark:bg-[#24221E]/50 border-black/5 dark:border-white/5 opacity-50'
                  : 'bg-[#E2DDD4] dark:bg-[#24221E] border-black/5 dark:border-white/5'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => toggleGeneralReminderComplete(task.id)}
                  className="flex-shrink-0 transition-transform hover:scale-110"
                >
                  {task.status === 'rang' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500" />
                  ) : task.completed ? (
                    <CheckCircle2 className="w-5 h-5 fill-[#DF4F38] text-white" />
                  ) : (
                    <Circle className="w-5 h-5 text-[#78746D]" />
                  )}
                </button>

                <div className="min-w-0">
                  <span className={`font-extrabold text-xs block truncate ${task.status === 'rang' ? 'text-emerald-800 dark:text-emerald-300' : 'text-[#1C1917] dark:text-[#F5F5F3]'}`}>
                    {task.title}
                  </span>

                  {task.status === 'rang' ? (
                    <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                      <Bell className="w-3 h-3" /> Rang! Tap ✓ to dismiss
                    </span>
                  ) : task.dueTime ? (
                    <span className="text-[10px] font-semibold text-[#78746D] dark:text-[#A8A29E] block">
                      {task.dueTime}
                    </span>
                  ) : task.minutes ? (
                    <span className="text-[10px] font-semibold text-[#DF4F38] flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Alert set for {task.minutes} min{task.minutes === 1 ? '' : 's'}
                    </span>
                  ) : null}
                </div>
              </div>

              <button
                onClick={() => deleteGeneralReminder(task.id)}
                className="p-1.5 rounded-full text-[#78746D] hover:text-rose-600 transition-colors flex-shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add General Reminder Modal */}
      {isGeneralReminderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-t-[32px] sm:rounded-[32px] bg-[#EBE6DD] dark:bg-[#121212] border border-black/5 dark:border-white/10 shadow-2xl p-6 text-[#1C1917] dark:text-[#F5F5F3] space-y-4 animate-in slide-in-from-bottom-8 duration-300 relative">
            <button
              onClick={() => setIsGeneralReminderModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#E2DDD4] dark:bg-[#24221E] flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 pt-1">
              <div className="p-2 rounded-xl bg-[#DF4F38] text-white">
                <Bell className="w-4 h-4" />
              </div>
              <h3 className="text-base font-extrabold tracking-tight">
                Add General Reminder / Task
              </h3>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-xs font-bold block mb-1">Reminder Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Get signature from manager, Buy groceries..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-[16px] bg-white dark:bg-[#1A1918] border border-black/10 dark:border-white/10 text-xs font-extrabold focus:outline-none placeholder:text-[#78746D]/60"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold block mb-1">Remind In (Minutes)</label>
                  <select
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                    className="w-full px-3 py-3 rounded-[16px] bg-white dark:bg-[#1A1918] border border-black/10 dark:border-white/10 text-xs font-extrabold focus:outline-none cursor-pointer"
                  >
                    <option value="0">Immediately (Now)</option>
                    <option value="5">In 5 Minutes</option>
                    <option value="15">In 15 Minutes</option>
                    <option value="30">In 30 Minutes</option>
                    <option value="60">In 1 Hour</option>
                    <option value="1440">Tomorrow (24 Hours)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1">Notes (Optional)</label>
                  <input
                    type="text"
                    placeholder="Extra details..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full px-4 py-3 rounded-[16px] bg-white dark:bg-[#1A1918] border border-black/10 dark:border-white/10 text-xs font-extrabold focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-[18px] bg-[#1C1917] dark:bg-white text-white dark:text-[#1C1917] font-extrabold text-xs shadow-md flex items-center justify-center gap-2 mt-2"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Save General Reminder</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
