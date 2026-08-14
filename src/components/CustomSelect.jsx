import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({ value, onChange, options, className = '' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full px-3 py-3 rounded-[16px] bg-[#EBE6DD] dark:bg-[#1A1918] border border-black/5 dark:border-white/10 text-xs font-extrabold text-[#1C1917] dark:text-[#F5F5F3] focus:outline-none flex items-center justify-between gap-2 cursor-pointer"
      >
        <span>{selected?.label ?? value}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-[#78746D] flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute left-0 right-0 mt-1.5 z-50 rounded-[16px] bg-white dark:bg-[#1A1918] border border-black/8 dark:border-white/10 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full px-4 py-2.5 flex items-center justify-between text-xs font-extrabold transition-colors text-left ${
                opt.value === value
                  ? 'bg-[#DF4F38]/10 text-[#DF4F38]'
                  : 'text-[#1C1917] dark:text-[#F5F5F3] hover:bg-[#EBE6DD] dark:hover:bg-[#24221E]'
              }`}
            >
              <span>{opt.label}</span>
              {opt.value === value && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
