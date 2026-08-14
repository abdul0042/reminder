import React from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { Smartphone, Share, PlusSquare, MoreVertical, X, CheckCircle2 } from 'lucide-react';

export default function PWAGuideModal() {
  const { showPWAGuide, setShowPWAGuide, isPWAInstalled } = useSubscriptions();

  if (!showPWAGuide) return null;

  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-t-[32px] sm:rounded-[32px] bg-[#EBE6DD] dark:bg-[#121212] border border-black/5 dark:border-white/10 shadow-2xl p-6 text-[#1C1917] dark:text-[#F5F5F3] space-y-5 animate-in slide-in-from-bottom-8 duration-300 relative">
        
        {/* Close Button */}
        <button
          onClick={() => setShowPWAGuide(false)}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#E2DDD4] dark:bg-[#24221E] text-[#1C1917] dark:text-[#F5F5F3] flex items-center justify-center hover:bg-[#D5CFC5] dark:hover:bg-[#2D2A25] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-[#DF4F38] text-white flex items-center justify-center shadow-md">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold tracking-tight">
              Install SubPulse App
            </h2>
            <p className="text-xs font-semibold text-[#78746D] dark:text-[#A8A29E]">
              Add to your device home screen
            </p>
          </div>
        </div>

        {isPWAInstalled ? (
          <div className="p-4 rounded-[22px] bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
            <div className="text-xs">
              <h4 className="font-extrabold">SubPulse is Already Installed!</h4>
              <p className="font-medium mt-0.5">You can launch SubPulse directly from your home screen or app drawer.</p>
            </div>
          </div>
        ) : isIOS ? (
          /* iOS Safari Instructions */
          <div className="p-5 rounded-[24px] bg-[#E2DDD4] dark:bg-[#24221E] border border-black/5 dark:border-white/5 space-y-4">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#DF4F38]">
              iPhone / Safari Instructions:
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#1C1917] dark:bg-white text-white dark:text-[#1C1917] font-extrabold flex items-center justify-center flex-shrink-0 text-xs">1</span>
                <div>
                  <span className="font-extrabold">Tap the Share Button</span>
                  <p className="text-[#78746D] dark:text-[#A8A29E] font-medium mt-0.5">
                    Look for the <Share className="w-3.5 h-3.5 inline text-[#DF4F38] mx-0.5" /> Share icon at the bottom of Safari.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#1C1917] dark:bg-white text-white dark:text-[#1C1917] font-extrabold flex items-center justify-center flex-shrink-0 text-xs">2</span>
                <div>
                  <span className="font-extrabold">Select "Add to Home Screen"</span>
                  <p className="text-[#78746D] dark:text-[#A8A29E] font-medium mt-0.5">
                    Scroll down the share sheet menu and tap <PlusSquare className="w-3.5 h-3.5 inline text-[#DF4F38] mx-0.5" /> <strong>Add to Home Screen</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#1C1917] dark:bg-white text-white dark:text-[#1C1917] font-extrabold flex items-center justify-center flex-shrink-0 text-xs">3</span>
                <div>
                  <span className="font-extrabold">Tap "Add" in Top Right</span>
                  <p className="text-[#78746D] dark:text-[#A8A29E] font-medium mt-0.5">
                    SubPulse will install as a native app on your home screen!
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Android / Chrome / Desktop Instructions */
          <div className="p-5 rounded-[24px] bg-[#E2DDD4] dark:bg-[#24221E] border border-black/5 dark:border-white/5 space-y-4">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#DF4F38]">
              Android / Chrome Instructions:
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#1C1917] dark:bg-white text-white dark:text-[#1C1917] font-extrabold flex items-center justify-center flex-shrink-0 text-xs">1</span>
                <div>
                  <span className="font-extrabold">Open Browser Menu</span>
                  <p className="text-[#78746D] dark:text-[#A8A29E] font-medium mt-0.5">
                    Tap the <MoreVertical className="w-3.5 h-3.5 inline text-[#DF4F38] mx-0.5" /> three dots menu in top-right of your browser.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#1C1917] dark:bg-white text-white dark:text-[#1C1917] font-extrabold flex items-center justify-center flex-shrink-0 text-xs">2</span>
                <div>
                  <span className="font-extrabold">Tap "Install App" or "Add to Home Screen"</span>
                  <p className="text-[#78746D] dark:text-[#A8A29E] font-medium mt-0.5">
                    Select <strong>Install app</strong> or <strong>Add to Home Screen</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowPWAGuide(false)}
          className="w-full py-3.5 rounded-[18px] bg-[#1C1917] dark:bg-white text-white dark:text-[#1C1917] font-extrabold text-xs tracking-wide shadow-md transition-all touch-shrink"
        >
          Got It, Thanks!
        </button>

      </div>
    </div>
  );
}
