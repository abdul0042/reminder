import React, { useState } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { LayoutDashboard, PieChart, Plus, Settings } from 'lucide-react';
import AIVoiceModal from './AIVoiceModal';

// Minimalist Audio Waveform Icon for AI Voice
function AIVoiceIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v18" />
      <path d="M17 7v10" />
      <path d="M7 7v10" />
      <path d="M22 11v2" />
      <path d="M2 11v2" />
    </svg>
  );
}

export default function LiquidTabBar() {
  const { activeTab, setActiveTab } = useSubscriptions();
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  return (
    <>
      {/* Floating Bottom Navigation Bar — wider, taller, notch for AI mic */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-[400px] px-3 pointer-events-auto">
        <div className="w-full relative h-[68px]">

          {/* SVG Notched Background — viewBox matches 400×68, notch centered at X=200 */}
          <div className="absolute inset-0 z-0 pointer-events-none drop-shadow-2xl">
            <svg
              viewBox="0 0 400 68"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <path
                d="M 28,0 L 161,0 C 170,0 176,6 181,14 C 187,24 213,24 219,14 C 224,6 230,0 239,0 L 372,0 C 387,0 400,13 400,28 L 400,40 C 400,54 387,68 372,68 L 28,68 C 13,68 0,54 0,40 L 0,28 C 0,13 13,0 28,0 Z"
                fill="rgba(226,221,212,0.96)"
                className="dark:fill-[rgba(26,25,24,0.96)]"
                stroke="rgba(0,0,0,0.07)"
                strokeWidth="1"
              />
            </svg>
          </div>

          {/* Left tabs: Dashboard & Analytics */}
          <div className="absolute left-0 top-0 bottom-0 w-[160px] z-10 flex items-center justify-around px-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex flex-col items-center justify-center gap-0.5 transition-all touch-shrink ${
                activeTab === 'dashboard'
                  ? 'text-[#1C1917] dark:text-white'
                  : 'text-[#78746D] dark:text-[#A8A29E]'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-colors ${activeTab === 'dashboard' ? 'bg-[#1C1917] text-white dark:bg-white dark:text-[#1C1917]' : ''}`}>
                <LayoutDashboard className="w-[18px] h-[18px] stroke-[2.5]" />
              </div>
              <span className="text-[10px] font-extrabold tracking-tight">Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex flex-col items-center justify-center gap-0.5 transition-all touch-shrink ${
                activeTab === 'analytics'
                  ? 'text-[#1C1917] dark:text-white'
                  : 'text-[#78746D] dark:text-[#A8A29E]'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-colors ${activeTab === 'analytics' ? 'bg-[#1C1917] text-white dark:bg-white dark:text-[#1C1917]' : ''}`}>
                <PieChart className="w-[18px] h-[18px] stroke-[2.5]" />
              </div>
              <span className="text-[10px] font-extrabold tracking-tight">Analytics</span>
            </button>
          </div>

          {/* Center Elevated AI Mic Button — sitting in the cutout notch */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-[18px] z-20">
            <button
              onClick={() => setIsVoiceModalOpen(true)}
              title="Groq AI Voice Assistant"
              className="w-[52px] h-[52px] rounded-full bg-[#DF4F38] text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all border-2 border-white/50 dark:border-black/30"
            >
              <AIVoiceIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Right tabs: Add & Settings */}
          <div className="absolute right-0 top-0 bottom-0 w-[160px] z-10 flex items-center justify-around px-3">
            <button
              onClick={() => setActiveTab('add')}
              className={`flex flex-col items-center justify-center gap-0.5 transition-all touch-shrink ${
                activeTab === 'add'
                  ? 'text-[#1C1917] dark:text-white'
                  : 'text-[#78746D] dark:text-[#A8A29E]'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-colors ${activeTab === 'add' ? 'bg-[#1C1917] text-white dark:bg-white dark:text-[#1C1917]' : ''}`}>
                <Plus className="w-[18px] h-[18px] stroke-[3]" />
              </div>
              <span className="text-[10px] font-extrabold tracking-tight">Add</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex flex-col items-center justify-center gap-0.5 transition-all touch-shrink ${
                activeTab === 'settings'
                  ? 'text-[#1C1917] dark:text-white'
                  : 'text-[#78746D] dark:text-[#A8A29E]'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-colors ${activeTab === 'settings' ? 'bg-[#1C1917] text-white dark:bg-white dark:text-[#1C1917]' : ''}`}>
                <Settings className="w-[18px] h-[18px] stroke-[2.5]" />
              </div>
              <span className="text-[10px] font-extrabold tracking-tight">Settings</span>
            </button>
          </div>

        </div>
      </div>

      {/* Groq AI Voice Assistant Modal */}
      <AIVoiceModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />
    </>
  );
}
