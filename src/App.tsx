import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Home from "./pages/Home";
import ArticleView from "./pages/ArticleView";
import Editor from "./pages/Editor";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Logo from "./components/Logo";
import { Facebook, Linkedin, Instagram, Twitter, Search, Menu, X } from 'lucide-react';

export default function App() {
  const [route, setRoute] = useState(window.location.hash || "#/");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash || "#/");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.hash = `#/search/${encodeURIComponent(searchQuery.trim())}`;
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  };

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

      <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-200">
        {/* Top Header */}
        <div className="bg-[#111111] text-white py-1.5 px-4 text-[10px] font-bold uppercase tracking-widest text-center md:text-left flex justify-between items-center">
          <span>{today}</span>
          <div className="hidden md:flex gap-4 items-center">
             <a href="#/" className="hover:text-[#00a85a] transition" aria-label="Facebook"><Facebook size={12} /></a>
             <a href="#/" className="hover:text-[#00a85a] transition" aria-label="Twitter"><Twitter size={12} /></a>
             <a href="#/" className="hover:text-[#00a85a] transition" aria-label="Instagram"><Instagram size={12} /></a>
             <a href="#/" className="hover:text-[#00a85a] transition font-serif italic text-xs leading-none" aria-label="Tumblr">t</a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-6">
            {/* Logo */}
            <a href="#/">
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
            <button className="lg:hidden text-[#111111] p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Desktop Detailed Navigation */}
        <nav className="hidden lg:block border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
            <div className="flex space-x-1 py-1">
              {navLinks.map(link => {
                const isActive = route === link.href || (link.href !== '#/' && route.startsWith(link.href));
                return (
                  <a 
                    key={link.name} 
                    href={link.href} 
                    className={`px-4 py-3 text-[11px] font-bold uppercase tracking-widest transition rounded-t-sm border-b-[3px] 
                      ${isActive ? 'text-[#00a85a] border-[#00a85a]' : 'text-gray-600 hover:text-[#111111] border-transparent hover:border-gray-300'}`}
                  >
                    {link.name}
                  </a>
                );
              })}
            </div>
            
            {/* Admin link discreetly on the right of nav */}
            <a href="#/write" className="text-[10px] text-gray-400 hover:text-[#00a85a] uppercase font-bold tracking-widest pl-4">Staff</a>
          </div>
        </nav>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 pb-4">
            <form onSubmit={handleSearch} className="p-4 border-b border-gray-50">
                <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden border border-transparent focus-within:border-[#00a85a] transition">
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
            <div className="flex flex-col px-4 pt-2 max-h-[60vh] overflow-y-auto">
              {navLinks.map(link => {
                const isActive = route === link.href;
                return (
                  <a 
                    key={link.name} 
                    href={link.href} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-4 py-3 text-sm font-bold uppercase tracking-widest transition border-b border-gray-50
                      ${isActive ? 'text-[#00a85a]' : 'text-gray-700 hover:text-[#00a85a]'}`}
                  >
                    {link.name}
                  </a>
                );
              })}
              <a 
                href="#/write" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-5 text-xs text-gray-400 uppercase font-bold tracking-widest border-t border-gray-100 mt-2"
              >
                Staff Login
              </a>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        {content}
      </main>

      <footer className="bg-[#111111] text-gray-300 py-16 border-t-[8px] border-[#00a85a] mt-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 text-sm">
          <div className="md:col-span-1">
            <a href="#/" className="inline-block mb-4">
              <Logo className="invert brightness-0" />
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
        
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-[#222222] text-center text-gray-600 text-[10px] font-bold uppercase tracking-wider flex justify-center items-center gap-4">
          <p>© {new Date().getFullYear()} GistWire Media. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
