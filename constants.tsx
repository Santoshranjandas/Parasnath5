
import React from 'react';

export const COLORS = {
  primary: '#6B8E6B', // Sage Green
  secondary: '#A3B18A', // Soft Green
  accent: '#E6E9E0', // Pale background
  text: '#3D4F3D',
  muted: '#8C9A8C',
  success: '#6B8E6B',
  danger: '#BC6C25',
  warning: '#DDA15E'
};

export const FloralPattern = () => (
  <div className="absolute top-0 right-0 pointer-events-none opacity-20 -z-0">
    <svg width="300" height="400" viewBox="0 0 300 400" fill="none">
      <path d="M300 0C250 50 200 150 250 250C300 350 350 400 300 400" stroke="#6B8E6B" strokeWidth="2" strokeDasharray="10 10" />
      <circle cx="280" cy="50" r="40" fill="#6B8E6B" fillOpacity="0.1" />
      <path d="M260 80C240 120 220 180 230 220" stroke="#6B8E6B" strokeOpacity="0.2" />
      <path d="M220 40Q250 80 280 40" stroke="#6B8E6B" strokeOpacity="0.3" />
    </svg>
  </div>
);

export const BottomFloral = () => (
  <div className="absolute bottom-0 left-0 pointer-events-none opacity-20 -z-0 rotate-180">
    <svg width="200" height="300" viewBox="0 0 200 300" fill="none">
      <path d="M0 300C50 250 100 150 50 50C0 -50 -50 -100 0 -100" stroke="#6B8E6B" strokeWidth="2" strokeDasharray="10 10" />
      <circle cx="20" cy="250" r="30" fill="#6B8E6B" fillOpacity="0.1" />
    </svg>
  </div>
);
