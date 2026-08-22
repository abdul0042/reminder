import React, { useState, useEffect } from 'react';
import { Download, Sparkles, X, ArrowUpCircle } from 'lucide-react';

const CURRENT_VERSION_TAG = 'v2.0'; // App version benchmark
const REPO_RELEASES_API = 'https://api.github.com/repos/abdul0042/reminder/releases/latest';
const DIRECT_APK_URL = 'https://github.com/abdul0042/reminder/releases/latest/download/app-debug.apk';

export default function UpdateModal() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [latestRelease, setLatestRelease] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const res = await fetch(REPO_RELEASES_API);
        if (!res.ok) return;
        const data = await res.json();

        const latestTag = data.tag_name || data.name || '';
        const lastDismissedTag = localStorage.getItem('unsub_dismissed_update_tag');

        // Check if there is a newer release tag that hasn't been dismissed for this version
        if (latestTag && latestTag !== lastDismissedTag) {
          setLatestRelease(data);
          setUpdateAvailable(true);
        }
      } catch (err) {
        console.warn('Update check error:', err);
      }
    };

    checkForUpdates();
  }, []);

  const handleDismiss = () => {
    if (latestRelease?.tag_name) {
      localStorage.setItem('unsub_dismissed_update_tag', latestRelease.tag_name);
    }
    setDismissed(true);
  };

  const handleUpdate = () => {
    window.open(DIRECT_APK_URL, '_blank');
    handleDismiss();
  };

  if (!updateAvailable || dismissed) return null;

  return (
    <div className="fixed inset-x-4 bottom-20 z-50 max-w-md mx-auto animate-in slide-in-from-bottom-5 duration-300">
      <div className="p-5 rounded-[28px] bg-[#1C1917] dark:bg-[#24221E] text-white shadow-2xl border border-white/10 relative overflow-hidden space-y-3">
        
        {/* Glow Accent */}
        <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-[#DF4F38]/30 blur-2xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors"
          title="Dismiss update notification"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title & Badge */}
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-[#DF4F38] text-white shadow-sm">
            <ArrowUpCircle className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm tracking-tight text-white">
                New Update Available!
              </h3>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#DF4F38]/20 text-[#DF4F38] border border-[#DF4F38]/30">
                {latestRelease?.tag_name || 'Latest'}
              </span>
            </div>
            <p className="text-[11px] font-medium text-white/75 mt-0.5">
              A new version of UnSub is ready with fresh improvements.
            </p>
          </div>
        </div>

        {/* Release Notes Preview if available */}
        {latestRelease?.body && (
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-[11px] font-semibold text-white/80 line-clamp-2">
            {latestRelease.body}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleUpdate}
            className="flex-1 py-3 rounded-[16px] bg-[#DF4F38] hover:bg-[#c8432e] text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all touch-shrink"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Update Direct (.apk)</span>
          </button>
          
          <button
            onClick={handleDismiss}
            className="px-4 py-3 rounded-[16px] bg-white/10 hover:bg-white/15 text-white/80 font-bold text-xs transition-colors"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
}
