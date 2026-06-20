import React from 'react';

export default function Logo({ className = "", lightText = false }: { className?: string, lightText?: boolean }) {
  return (
    <div className={`font-sans font-black text-4xl tracking-tighter flex items-center gap-2 ${lightText ? 'text-white' : 'text-[#111111]'} ${className}`}>
      <div className="bg-[#00a85a] text-white px-3 py-1 leading-none rounded-xl shadow-sm -rotate-2 text-3xl">Gist</div>
      <span className="italic text-3xl">Wire</span>
    </div>
  );
}
