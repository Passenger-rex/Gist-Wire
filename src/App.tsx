import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Home from "./pages/Home";
import ArticleView from "./pages/ArticleView";
import Editor from "./pages/Editor";
import Contact from "./pages/Contact";
import About from "./pages/About";
import DownloadLogo from "./pages/DownloadLogo";
import Logo from "./components/Logo";
import { Facebook, Linkedin, Instagram, Twitter, Search, Menu, X } from 'lucide-react';

export default function App() {
  const [route, setRoute] = useState(window.location.hash || "#/");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsAppLoading(false), 2000);
    const onHashChange = () => setRoute(window.location.hash || "#/");
    window.addEventListener("hashchange", onHashChange);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isMobileMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.hash = `#/search/${encodeURIComponent(searchQuery.trim())}`;
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  if (isAppLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col pt-32 px-4 max-w-7xl mx-auto space-y-12">
        <div className="w-full flex justify-between items-center mb-12">
          <div className="h-10 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse hidden md:block"></div>
        </div>
        <div className="w-full h-96 bg-gray-200 rounded animate-pulse mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  let content;
  let pageTitle = "GistWire - Always First with the News";
  
  if (route.startsWith("#/post/")) {
    const slug = route.replace("#/post/", "");
    content = <ArticleView slug={slug} />;
  } else if (route.startsWith("#/search/")) {
    const query = decodeURIComponent(route.replace("#/search/", ""));
    pageTitle = `Search Results for "${query}" - GistWire`;
    content = <Home searchQuery={query} />;
  } else if (route.startsWith("#/category/")) {
    const cat = decodeURIComponent(route.replace("#/category/", ""));
    pageTitle = `${cat} News - GistWire`;
    content = <Home categoryQuery={cat} />;
  } else if (route === "#/write") {
    pageTitle = "Admin Control Panel - GistWire";
    content = <Editor />;
  } else if (route === "#/contact") {
    pageTitle = "Contact Us - GistWire";
    content = <Contact />;
  } else if (route === "#/about") {
    pageTitle = "About Us - GistWire";
    content = <About />;
  } else if (route === "#/download-logo") {
    pageTitle = "Download Logo - GistWire";
    content = <DownloadLogo />;
  } else {
    content = <Home />;
  }

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const navLinks = [
    { name: "Home", href: "#/" },
    { name: "Celebrity News", href: "#/category/Celebrity%20News" },
    { name: "Music", href: "#/category/Music" },
    { name: "Education", href: "#/category/Education" },
    { name: "Health", href: "#/category/Health" },
    { name: "Food & Lifestyle", href: "#/category/Food%20%26%20Lifestyle" },
    { name: "Technology", href: "#/category/Technology" },
    { name: "Business", href: "#/category/Business" },
    { name: "Entertainment", href: "#/category/Entertainment" },
    { name: "Sport", href: "#/category/Sport" },
    { name: "Global", href: "#/category/Global" }
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content="Dedicated to delivering comprehensive coverage, insightful analysis, and the latest trends shaping politics, business, and entertainment." />
      </Helmet>

      <header className={`bg-white shadow-sm border-b border-gray-200 transition-all duration-300 ease-in-out sticky top-0 z-[100]`}>
        {/* Top Header */}
        <div className={`bg-[#111111] text-white px-4 text-[10px] font-bold uppercase tracking-widest text-center md:text-left flex justify-between items-center transition-all duration-300 ease-in-out overflow-hidden ${isScrolled ? 'h-0 opacity-0 py-0' : 'h-[36px] opacity-100 py-1.5'}`}>
          <span>{today}</span>
          <div className="hidden md:flex gap-4 items-center">
             <a href="#/" className="hover:text-[#00a85a] transition" aria-label="Facebook"><Facebook size={12} /></a>
             <a href="#/" className="hover:text-[#00a85a] transition" aria-label="Twitter"><Twitter size={12} /></a>
             <a href="#/" className="hover:text-[#00a85a] transition" aria-label="Instagram"><Instagram size={12} /></a>
             <a href="#/" className="hover:text-[#00a85a] transition font-serif italic text-xs leading-none" aria-label="Tumblr">t</a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-20 bg-white">
          <div className={`flex items-center justify-between transition-all duration-300 ease-in-out ${isScrolled ? 'py-3' : 'py-5 md:py-6'}`}>
            {/* Logo */}
            <a href="#/" className={`origin-left inline-block transition-transform duration-300 ease-in-out ${isScrolled ? 'scale-90 md:scale-100' : 'scale-100 md:scale-125'}`}>
              <Logo />
            </a>

            {/* Desktop Search & Nav */}
            <div className="hidden lg:flex items-center gap-8">
              <form onSubmit={handleSearch} className="flex items-center bg-gray-100 rounded-full overflow-hidden border border-transparent focus-within:border-[#00a85a] transition w-72">
                <input 
                  type="text" 
                  placeholder="Search news..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent px-5 py-2.5 font-sans text-sm focus:outline-none w-full text-[#111111]"
                />
                <button type="submit" className="text-gray-500 hover:text-[#00a85a] transition pr-4">
                  <Search size={18} />
                </button>
              </form>
            </div>

            {/* Mobile Menu Toggle */}
            <button className="lg:hidden text-[#111111] p-2 hover:text-[#00a85a] transition-colors duration-200" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={28} />
            </button>
          </div>
        </div>

        {/* Desktop Detailed Navigation */}
        <nav className="hidden lg:block border-t border-gray-100 bg-white shadow-sm relative z-10 w-full overflow-x-auto">
          <div className="max-w-7xl mx-auto px-4 flex items-center">
            <div className="flex space-x-6 py-0 w-full whitespace-nowrap min-w-max md:min-w-0">
              {navLinks.map(link => {
                const isActive = route === link.href || (link.href !== '#/' && route.startsWith(link.href));
                return (
                  <a 
                    key={link.name} 
                    href={link.href} 
                    className={`py-3 lg:py-4 text-[13px] font-display font-bold uppercase tracking-wider relative group transition-colors duration-200 ease-linear ${isActive ? 'text-[#00a85a]' : 'text-gray-800 hover:text-[#00a85a]'}`}
                  >
                    <span className="group-hover:opacity-80 transition-opacity duration-200">{link.name}</span>
                    <span className={`absolute bottom-0 left-0 w-full h-[3px] bg-[#00a85a] transform origin-left transition-transform duration-200 ease-linear ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                  </a>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Mobile Slide-In Sidebar Overlay */}
        <div 
          className={`lg:hidden fixed inset-0 bg-black/60 z-[110] transition-opacity duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Mobile Navigation Dropdown -> Made into Sidebar */}
        <div className={`lg:hidden fixed inset-y-0 left-0 w-[280px] bg-white z-[120] shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white shrink-0">
            <a href="#/" className="transform scale-90 origin-left inline-block" onClick={() => setIsMobileMenuOpen(false)}>
              <Logo />
            </a>
            <button className="text-gray-500 hover:text-[#111111] p-2 transition-colors duration-200" onClick={() => setIsMobileMenuOpen(false)}>
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSearch} className="p-5 border-b border-gray-50 shrink-0">
            <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden border border-transparent focus-within:border-[#00a85a] transition-colors duration-200">
              <input 
                type="text" 
                placeholder="Search news..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent px-4 py-3 font-sans text-sm focus:outline-none w-full"
              />
              <button type="submit" className="text-gray-500 hover:text-[#00a85a] transition pr-4">
                <Search size={18} />
              </button>
            </div>
          </form>

          <div className="flex flex-col overflow-y-auto flex-grow py-2">
            {navLinks.map(link => {
              const isActive = route === link.href || (link.href !== '#/' && route.startsWith(link.href));
              return (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-6 py-4 text-[13px] font-bold uppercase tracking-widest relative group transition-colors duration-200 ease-linear border-b border-gray-50 ${isActive ? 'text-[#00a85a] bg-gray-50' : 'text-gray-700 hover:text-[#00a85a] hover:bg-gray-50'}`}
                >
                  <span className="relative z-10">{link.name}</span>
                  {isActive && (
                    <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#00a85a]"></span>
                  )}
                </a>
              );
            })}
          </div>

          <div className="p-6 border-t border-gray-100 bg-gray-50 shrink-0">
            <p className="text-xs text-gray-500 font-medium mb-4 uppercase tracking-wider">Follow Us</p>
            <div className="flex gap-4 items-center text-gray-600">
               <a href="#/" className="hover:text-[#00a85a] transition" aria-label="Facebook"><Facebook size={18} /></a>
               <a href="#/" className="hover:text-[#00a85a] transition" aria-label="Twitter"><Twitter size={18} /></a>
               <a href="#/" className="hover:text-[#00a85a] transition" aria-label="Instagram"><Instagram size={18} /></a>
               <a href="#/" className="hover:text-[#00a85a] transition font-serif italic font-bold text-xl leading-none" aria-label="Tumblr">t</a>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {content}
      </main>

      <footer className="bg-[#111111] text-gray-300 py-16 border-t-[8px] border-[#00a85a] mt-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 text-sm">
          <div className="md:col-span-1">
            <a href="#/" className="inline-block mb-4">
              <Logo lightText={true} />
            </a>
            <p className="text-gray-400 mb-6 leading-relaxed font-sans font-medium text-xs">
              Your premium source for up-to-the-minute updates, celebrity gists, and unfiltered news from across the nation to the global stage. Stay plugged in.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold uppercase tracking-widest text-[#00a85a] mb-4 text-xs shrink-0 inline-block border-b-2 border-[#00a85a] pb-1">Quick Links</h4>
            <div className="flex flex-col gap-3 font-medium text-xs">
              <a href="#/category/Celebrity%20News" className="hover:text-white transition uppercase tracking-wider">Celebrity News</a>
              <a href="#/category/Music" className="hover:text-white transition uppercase tracking-wider">Music Updates</a>
              <a href="#/category/Entertainment" className="hover:text-white transition uppercase tracking-wider">Entertainment</a>
              <a href="#/category/Technology" className="hover:text-white transition uppercase tracking-wider">Tech & AI</a>
            </div>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-widest text-[#00a85a] mb-4 text-xs shrink-0 inline-block border-b-2 border-[#00a85a] pb-1">Company</h4>
            <div className="flex flex-col gap-3 font-medium text-xs">
              <a href="#/about" className="hover:text-white transition uppercase tracking-wider">About Us</a>
              <a href="#/contact" className="hover:text-white transition uppercase tracking-wider">Contact Us</a>
            </div>
          </div>

          <div>
             <h4 className="font-bold uppercase tracking-widest text-[#00a85a] mb-4 text-xs shrink-0 inline-block border-b-2 border-[#00a85a] pb-1">Connect</h4>
             <p className="text-xs text-gray-500 mb-4 font-medium">Follow us on social media for live updates as they break.</p>
             <div className="flex flex-wrap gap-2">
              <a href="#/" className="w-8 h-8 rounded-full bg-[#222222] flex items-center justify-center hover:bg-[#00a85a] transition text-white" aria-label="Facebook"><Facebook size={14} /></a>
              <a href="#/" className="w-8 h-8 rounded-full bg-[#222222] flex items-center justify-center hover:bg-[#00a85a] transition text-white" aria-label="Twitter"><Twitter size={14} /></a>
              <a href="#/" className="w-8 h-8 rounded-full bg-[#222222] flex items-center justify-center hover:bg-[#00a85a] transition text-white" aria-label="Instagram"><Instagram size={14} /></a>
              <a href="#/" className="w-8 h-8 rounded-full bg-[#222222] flex items-center justify-center hover:bg-[#00a85a] transition text-white" aria-label="LinkedIn"><Linkedin size={14} /></a>
              <a href="#/" className="w-8 h-8 rounded-full bg-[#222222] flex items-center justify-center hover:bg-[#00a85a] transition text-white font-bold font-serif italic text-lg leading-none" aria-label="Tumblr">t</a>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-[#222222] text-center text-gray-600 text-[10px] font-bold uppercase tracking-wider">
          <p>
            © {new Date().getFullYear()} <a href="#/write" className="text-current cursor-text" aria-label="Admin Control Panel" onClick={(e) => { e.stopPropagation(); }}>GistWire</a> Media. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
