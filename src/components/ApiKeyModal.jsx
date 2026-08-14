import React, { useState } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { X, Key, ShieldCheck, ExternalLink } from 'lucide-react';

export default function ApiKeyModal() {
  const { showApiKeyModal, setShowApiKeyModal, saveApiKey } = useSubscriptions();
  const [keyInput, setKeyInput] = useState('');

  if (!showApiKeyModal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!keyInput.trim()) return;
    saveApiKey(keyInput.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-t-[32px] sm:rounded-[32px] bg-[#EBE6DD] border border-black/5 shadow-2xl overflow-hidden p-6 animate-in slide-in-from-bottom-8 duration-300 text-[#1C1917]">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#DF4F38] text-white shadow-sm">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">
                Firebase Web API Key Required
              </h3>
              <p className="text-xs font-semibold text-[#78746D]">
                To enable Google Authentication
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowApiKeyModal(false)}
            className="p-1.5 rounded-full hover:bg-[#D5CFC5] text-[#1C1917] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs font-semibold text-[#78746D] leading-relaxed">
            Please enter your Firebase Web API Key for project <strong>reminder-94d10</strong> (found in Firebase Console &gt; Project Settings &gt; Web App).
          </p>

          <div>
            <label className="text-xs font-bold block mb-1">
              Web API Key *
            </label>
            <input
              type="text"
              required
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="e.g. AIzaSyD..."
              className="w-full px-3.5 py-2.5 rounded-[16px] bg-[#E2DDD4] border border-black/5 text-xs font-bold text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#DF4F38]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-[18px] bg-[#1C1917] hover:bg-black text-white font-extrabold text-xs tracking-wide shadow-md transition-all touch-shrink"
          >
            Save Key & Reload
          </button>
        </form>

      </div>
    </div>
  );
}
