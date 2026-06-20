import React from 'react';

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`font-sans font-black text-4xl tracking-tighter text-[#111111] flex items-center gap-2 ${className}`}>
      <div className="bg-[#00a85a] text-white px-3 py-1 leading-none rounded-xl shadow-sm -rotate-2 text-3xl">Gist</div>
      <span className="italic text-3xl">Wire</span>
    </div>
  );
}
