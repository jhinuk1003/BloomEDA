import React from "react";

export function FlowerIcon({ className = "w-6 h-6", color = "#C86D51" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* 5 Petals */}
      <path
        d="M24 16C21 8 27 6 24 4C21 6 27 8 24 16Z"
        fill={color}
        fillOpacity="0.25"
      />
      <circle cx="24" cy="14" r="7" fill={color} fillOpacity="0.75" />
      <circle cx="33" cy="20" r="7" fill={color} fillOpacity="0.75" />
      <circle cx="30" cy="31" r="7" fill={color} fillOpacity="0.75" />
      <circle cx="18" cy="31" r="7" fill={color} fillOpacity="0.75" />
      <circle cx="15" cy="20" r="7" fill={color} fillOpacity="0.75" />
      {/* Center Pistil */}
      <circle cx="24" cy="23" r="4.5" fill="#D4AF37" />
      <circle cx="24" cy="23" r="2.5" fill="#9B7322" />
    </svg>
  );
}

export function BotanicalBranchDivider({ className = "w-full max-w-xs h-6 my-4 mx-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center space-x-3 text-[#7E9A82] opacity-80 ${className}`}>
      <svg width="60" height="12" viewBox="0 0 60 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M60 6C45 6 35 1 20 6C12 9 5 6 0 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <ellipse cx="25" cy="3" rx="4" ry="2" transform="rotate(-25 25 3)" fill="currentColor" fillOpacity="0.6" />
        <ellipse cx="40" cy="9" rx="4" ry="2" transform="rotate(25 40 9)" fill="currentColor" fillOpacity="0.6" />
      </svg>
      <FlowerIcon className="w-5 h-5 text-[#C86D51]" />
      <svg width="60" height="12" viewBox="0 0 60 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="rotate-180">
        <path d="M60 6C45 6 35 1 20 6C12 9 5 6 0 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <ellipse cx="25" cy="3" rx="4" ry="2" transform="rotate(-25 25 3)" fill="currentColor" fillOpacity="0.6" />
        <ellipse cx="40" cy="9" rx="4" ry="2" transform="rotate(25 40 9)" fill="currentColor" fillOpacity="0.6" />
      </svg>
    </div>
  );
}

export function CornerFoliage({ position = "top-left", className = "w-16 h-16" }: { position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"; className?: string }) {
  const rot = position === "top-right" ? "rotate-90" : position === "bottom-right" ? "rotate-180" : position === "bottom-left" ? "-rotate-90" : "";
  return (
    <div className={`pointer-events-none absolute text-[#7E9A82] opacity-35 ${rot} ${className}`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M5 95C25 65 50 40 95 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <ellipse cx="30" cy="55" rx="14" ry="7" transform="rotate(-40 30 55)" fill="currentColor" fillOpacity="0.4" />
        <ellipse cx="60" cy="25" rx="14" ry="7" transform="rotate(-40 60 25)" fill="currentColor" fillOpacity="0.4" />
        <ellipse cx="45" cy="50" rx="12" ry="6" transform="rotate(25 45 50)" fill="#C86D51" fillOpacity="0.3" />
        <circle cx="85" cy="15" r="4" fill="#D4AF37" fillOpacity="0.5" />
      </svg>
    </div>
  );
}

export function BotanicalQualitySeal({ score, badge }: { score: number; badge: string }) {
  const sealColor = score >= 80 ? "#7E9A82" : score >= 60 ? "#C86D51" : "#C98474";
  return (
    <div className="relative inline-flex items-center justify-center p-3">
      {/* Outer Wreath */}
      <div className="w-28 h-28 rounded-full border-2 border-dashed border-[#C86D51]/40 flex items-center justify-center p-2">
        <div
          className="w-full h-full rounded-full flex flex-col items-center justify-center text-center shadow-inner"
          style={{ backgroundColor: "#FAF7F2", border: `2px solid ${sealColor}` }}
        >
          <span className="text-[10px] tracking-widest uppercase font-semibold text-[#786B60]">Quality</span>
          <span className="font-serif-botanical text-2xl font-bold leading-none" style={{ color: sealColor }}>
            {score}
          </span>
          <span className="text-[9px] text-[#786B60] font-medium leading-tight mt-0.5 px-1 truncate max-w-[80px]">
            {badge}
          </span>
        </div>
      </div>
      {/* Botanical leaves flanking the seal */}
      <div className="absolute -left-1 text-[#7E9A82] opacity-70">🌿</div>
      <div className="absolute -right-1 text-[#7E9A82] opacity-70 scale-x-[-1]">🌿</div>
    </div>
  );
}
