import React, { useState } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { LayoutDashboard, PieChart, Plus, Settings } from 'lucide-react';
import AIVoiceModal from './AIVoiceModal';

// Minimalist Audio Waveform Icon for AI Voice
function AIVoiceIcon({ className = "w-4.5 h-4.5" }) {
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
      {/* Floating Bottom Navigation Bar with Perfectly Symmetrical Cutout Notch */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-[320px] px-2 pointer-events-auto">
        <div className="w-full relative h-[56px]">
          
          {/* Background Card SVG with Pixel-Perfect Symmetrical Notch Cutout */}
          <div className="absolute inset-0 z-0 pointer-events-none drop-shadow-xl">
            <svg
              viewBox="0 0 320 56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full text-[#E2DDD4]/95 dark:text-[#1A1918]/95 backdrop-blur-xl"
            >
              {/* Symmetrical Curved Cutout Notch Path centered at X=160 */}
              <path
                d="M 24,0 L 128,0 C 136,0 141,5 146,12 C 151,20 169,20 174,12 C 179,5 184,0 192,0 L 296,0 C 309,0 320,11 320,24 L 320,32 C 320,45 309,56 296,56 L 24,56 C 11,56 0,45 0,32 L 0,24 C 0,11 11,0 24,0 Z"
                fill="currentColor"
                stroke="rgba(0,0,0,0.08)"
                strokeWidth="1"
              />
            </svg>
          </div>

          {/* Left Navigation Actions (Dashboard & Analytics) */}
          <div className="absolute left-0 top-0 bottom-0 w-[128px] z-10 flex items-center justify-around pl-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex flex-col items-center justify-center transition-all touch-shrink ${
                activeTab === 'dashboard'
                  ? 'text-[#1C1917] dark:text-white font-extrabold'
                  : 'text-[#78746D] dark:text-[#A8A29E] hover:text-[#1C1917]'
              }`}
            >
              <div className={`p-1 rounded-xl transition-colors ${activeTab === 'dashboard' ? 'bg-[#1C1917] text-white dark:bg-white dark:text-[#1C1917]' : ''}`}>
                <LayoutDashboard className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-[9px] tracking-tight mt-0.5 font-extrabold">
                Dashboard
              </span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex flex-col items-center justify-center transition-all touch-shrink ${
                activeTab === 'analytics'
                  ? 'text-[#1C1917] dark:text-white font-extrabold'
                  : 'text-[#78746D] dark:text-[#A8A29E] hover:text-[#1C1917]'
              }`}
            >
              <div className={`p-1 rounded-xl transition-colors ${activeTab === 'analytics' ? 'bg-[#1C1917] text-white dark:bg-white dark:text-[#1C1917]' : ''}`}>
                <PieChart className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-[9px] tracking-tight mt-0.5 font-extrabold">
                Analytics
              </span>
            </button>
          </div>

          {/* Center Floating AI Mic Button Dead-Center in the Notch */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-3.5 z-20 flex flex-col items-center justify-center">
            <button
              onClick={() => setIsVoiceModalOpen(true)}
              title="Groq AI Voice Assistant"
              className="w-[44px] h-[44px] rounded-full bg-[#DF4F38] text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all border border-white/40 dark:border-black/40"
            >
              <AIVoiceIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Right Navigation Actions (Add & Settings) */}
          <div className="absolute right-0 top-0 bottom-0 w-[128px] z-10 flex items-center justify-around pr-1">
            <button
              onClick={() => setActiveTab('add')}
              className={`flex flex-col items-center justify-center transition-all touch-shrink ${
                activeTab === 'add'
                  ? 'text-[#1C1917] dark:text-white font-extrabold'
                  : 'text-[#78746D] dark:text-[#A8A29E] hover:text-[#1C1917]'
              }`}
            >
              <div className={`p-1 rounded-xl transition-colors ${activeTab === 'add' ? 'bg-[#1C1917] text-white dark:bg-white dark:text-[#1C1917]' : ''}`}>
                <Plus className="w-4 h-4 stroke-[3]" />
              </div>
              <span className="text-[9px] tracking-tight mt-0.5 font-extrabold">
                Add
              </span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex flex-col items-center justify-center transition-all touch-shrink ${
                activeTab === 'settings'
                  ? 'text-[#1C1917] dark:text-white font-extrabold'
                  : 'text-[#78746D] dark:text-[#A8A29E] hover:text-[#1C1917]'
              }`}
            >
              <div className={`p-1 rounded-xl transition-colors ${activeTab === 'settings' ? 'bg-[#1C1917] text-white dark:bg-white dark:text-[#1C1917]' : ''}`}>
                <Settings className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-[9px] tracking-tight mt-0.5 font-extrabold">
                Settings
              </span>
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
