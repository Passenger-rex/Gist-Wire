import { Helmet } from 'react-helmet-async';

export default function DownloadLogo() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-32 text-center flex flex-col items-center justify-center">
      <Helmet>
        <title>Download Logo - GistWire</title>
      </Helmet>
      
      <h1 className="text-3xl font-sans font-black uppercase text-[#111111] mb-4 tracking-tighter">Download Logo</h1>
      <p className="text-gray-500 mb-8 max-w-md">Get the official high-resolution PNG asset for GistWire.</p>
      
      <div className="mb-12 p-8 bg-gray-50 border border-gray-200 shadow-sm relative group overflow-hidden">
        <img src="/logo.png" alt="GistWire Logo" className="w-full h-auto object-contain max-w-[400px]" />
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
           <p className="text-white font-bold tracking-widest uppercase text-xs">Right-click and select "Save image as..."</p>
        </div>
      </div>

      <a 
        href="/logo.png"
        download="gistwire-logo.png"
        className="px-8 py-4 bg-[#00a85a] text-white font-black uppercase tracking-widest text-xs hover:bg-[#111111] transition shadow-lg shrink-0"
      >
        Download PNG
      </a>
    </div>
  );
}
