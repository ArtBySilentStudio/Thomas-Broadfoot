import React from 'react';

const BeeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Busy Bee Logo"
    role="img"
  >
    <defs>
      <linearGradient id="busy-bee-blue-gradient" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#0EA5E9" />
      </linearGradient>
       <linearGradient id="busy-bee-wing-gradient" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#7DD3FC" />
        <stop offset="100%" stopColor="#38BDF8" />
      </linearGradient>
    </defs>
    
    {/* Abstract Wings */}
    <path 
      d="M11.5 8 C 5 2, 5 13, 11.5 11" 
      fill="url(#busy-bee-wing-gradient)"
      opacity="0.8"
    />
    <path 
      d="M12.5 8 C 19 2, 19 13, 12.5 11" 
      fill="url(#busy-bee-wing-gradient)"
      opacity="0.8"
    />

    {/* Main Body - Simplified and modern */}
    <path 
      d="M12 7 C 9 7, 6 10, 6 14.5 C 6 19, 12 23, 12 23 C 12 23, 18 19, 18 14.5 C 18 10, 15 7, 12 7 Z"
      fill="url(#busy-bee-blue-gradient)"
    />

    {/* Stripes - subtle and integrated */}
    <path 
      d="M8 14 H 16"
      stroke="#111827"
      strokeOpacity="0.7"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path 
      d="M7.5 17 H 16.5"
      stroke="#111827"
      strokeOpacity="0.7"
      strokeWidth="2"
      strokeLinecap="round"
    />

  </svg>
);

export default BeeIcon;
