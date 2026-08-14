import React, { useState } from 'react';
import { getLogoUrl } from '../utils/getLogoUrl';

export default function ServiceLogo({ name, website, className = "w-6 h-6 rounded-lg", textClassName = "text-[10px]" }) {
  const [error, setError] = useState(false);
  const logoUrl = getLogoUrl(name, website);

  const initial = (name || 'S').charAt(0).toUpperCase();

  return (
    <div className={`${className} bg-[#F5F2EE] dark:bg-[#24221E] border border-black/5 dark:border-white/10 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-xs`}>
      {logoUrl && !error ? (
        <img
          src={logoUrl}
          alt={name}
          onError={() => setError(true)}
          className="w-full h-full object-contain p-0.5"
        />
      ) : (
        <span className={`${textClassName} font-black text-[#1C1917] dark:text-[#F5F5F3]`}>
          {initial}
        </span>
      )}
    </div>
  );
}
