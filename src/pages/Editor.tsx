import React, { useState, useEffect } from "react";
import { Article } from "../types";
import { saveArticles, getArticles, deleteArticle } from "../lib/db";
import { auth } from "../lib/firebase";
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import EditorWysiwyg from 'react-simple-wysiwyg';

export default function Editor() {
  const [isAuth, setIsAuth] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "News",
    format: "Standard Article",
    excerpt: "",
    author: "Staff Reporter",
    coverImage: "",
    contentHtml: "<p>Begin writing the news report here...</p>"
  });
  
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    getArticles().then(setArticles);
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === "johntobismart@gmail.com") {
        setIsAuth(true);
        setUserEmail(user.email);
      } else {
        setIsAuth(false);
        setUserEmail(null);
      }
    });
    
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in", error);
      alert("Failed to sign in. Ensure you are using the correct admin account.");
    }
  };
  
  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.contentHtml) return;

    const existingArticle = articles.find(a => a.id === editingId);

    const newArticle: Article = {
      id: editingId || Date.now().toString(),
      slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      title: formData.title,
      category: formData.category,
      format: formData.format,
      excerpt: formData.excerpt,
      author: formData.author,
      contentHtml: formData.contentHtml,
      coverImage: formData.coverImage,
      publishDate: existingArticle?.publishDate || new Date().toISOString(),
      views: existingArticle?.views || 0
    };

    await saveArticles([newArticle]);
    setArticles(await getArticles());
    alert(editingId ? "Article Updated Successfully!" : "Article Published Successfully!");
    setEditingId(null);
    setFormData({ title: "", category: "News", format: "Standard Article", excerpt: "", author: "Staff Reporter", coverImage: "", contentHtml: "<p>Start writing the next report...</p>" });
  };

  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFormat = e.target.value;
    let newContent = formData.contentHtml;

    // Change template depending on the format selected only if it hasn't been heavily edited
    // or we are switching to a completely new template
    if (newFormat === "Listicle") {
      newContent = "<h2>Introduction</h2><p>Write your introduction here...</p><h2>1. First Item</h2><p>First item details...</p><h2>2. Second Item</h2><p>Second item details...</p>";
    } else if (newFormat === "Feature Story") {
      newContent = "<h2>The Beginning</h2><p>Write an engaging opening...</p><h2>Deep Dive</h2><p>Provide comprehensive details...</p><h2>Conclusion</h2><p>Wrap up the story...</p>";
    } else if (newFormat === "Opinion/Editorial") {
      newContent = "<h2>My Perspective</h2><p>State your main argument...</p><blockquote><p>A key provocative quote here...</p></blockquote><p>Further analysis...</p>";
    } else {
      newContent = "<h2>Executive Summary</h2><p>Provide a brief overview...</p><h2>Key Details</h2><p>Expand on the facts...</p>";
    }

    setFormData({ ...formData, format: newFormat, contentHtml: newContent });
  };

  const handleEdit = (a: Article) => {
    setFormData({
      title: a.title,
      category: a.category,
      format: a.format,
      excerpt: a.excerpt || "",
      author: a.author || "Staff Reporter",
      coverImage: a.coverImage || "",
      contentHtml: a.contentHtml
    });
    setEditingId(a.id);
  };

  if (!isAuth) {
    return (
      <div className="max-w-md mx-auto px-4 py-32 text-center h-[70vh] flex flex-col justify-center">
        <div className="bg-[#111111] p-10 shadow-2xl rounded-sm border-t-[6px] border-[#00a85a]">
          <div className="flex justify-center mb-6">
             <div className="bg-[#00a85a] text-white px-4 py-1 leading-none rounded-2xl shadow-sm -rotate-2 font-black text-3xl">Gist</div>
             <span className="italic font-black text-3xl text-white">Wire</span>
          </div>
          <h2 className="font-sans font-black text-xl uppercase tracking-tighter text-white mb-8">Admin Control Panel</h2>
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <button type="submit" className="bg-[#00a85a] text-white py-4 font-black uppercase tracking-widest text-xs hover:bg-white hover:text-[#111111] transition w-full shadow-lg">Sign In With Google</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-12">
        
        {/* Left Column - Main Editor */}
        <div className="flex-1 max-w-4xl">
          <div className="mb-10 flex items-center justify-between border-b pb-4">
             <div className="flex flex-col">
               <h1 className="text-xl font-sans font-black uppercase tracking-widest text-[#111111]">
                 {editingId ? "Editing Article" : "Write a New Article"}
               </h1>
               <p className="text-gray-400 font-sans text-xs uppercase tracking-widest mt-1">Admin Portal / {userEmail} <button onClick={handleLogout} className="underline text-blue-500 ml-2 cursor-pointer">Logout</button></p>
             </div>
             {editingId && (
                <button type="button" onClick={() => { setEditingId(null); setFormData({ title: "", category: "News", format: "Standard Article", excerpt: "", author: "Staff Reporter", coverImage: "", contentHtml: "<p>Start writing the next report...</p>" }); }} className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-[#111111] transition bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full">
                  Cancel Edit
                </button>
             )}
          </div>

          <form id="editor-form" onSubmit={handleSave} className="space-y-6">
            {/* Title / Headline */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Article Title / Headline</label>
              <input 
                className="w-full text-lg border border-gray-300 rounded-lg p-4 text-[#111111] focus:ring-2 focus:ring-[#00a85a] focus:border-transparent outline-none transition shadow-sm" 
                placeholder="Enter a compelling headline..." 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                required 
              />
            </div>
            
            {/* Excerpt */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Excerpt / Subheadline</label>
              <textarea 
                className="w-full text-base border border-gray-300 rounded-lg p-4 text-gray-600 focus:ring-2 focus:ring-[#00a85a] focus:border-transparent outline-none transition shadow-sm resize-y" 
                placeholder="Write a brief excerpt or subheadline..." 
                value={formData.excerpt} 
                onChange={e => setFormData({...formData, excerpt: e.target.value})} 
                required 
                rows={3}
              />
            </div>

            {/* WYSIWYG Editor */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Article Body</label>
              <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-[#00a85a] transition">
                <EditorWysiwyg 
                  containerProps={{ 
                    style: { 
                      minHeight: '500px', 
                      backgroundColor: '#fff',
                      padding: '16px',
                      fontFamily: 'system-ui, -apple-system, sans-serif'
                    } 
                  }} 
                  value={formData.contentHtml} 
                  onChange={(e: any) => setFormData({...formData, contentHtml: e.target.value})} 
                />
              </div>
            </div>
          </form>
        </div>

        {/* Right Column - Publish Settings & Content Manager */}
        <aside className="w-full lg:w-[400px] shrink-0 border-t lg:border-t-0 lg:border-l border-gray-100 pt-10 lg:pt-0 lg:pl-10">
          <div className="sticky top-8 space-y-10">
            
            {/* Publish Action Box */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-black text-sm uppercase tracking-widest text-[#111111] mb-6 flex items-center">
                <span className="w-2 h-2 bg-[#00a85a] rounded-full mr-3"></span> Publish Settings
              </h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block font-bold text-xs uppercase tracking-widest text-gray-500 mb-2">Category</label>
                  <select className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm font-bold text-[#111111] outline-none focus:border-[#00a85a] focus:ring-1 focus:ring-[#00a85a] transition" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option value="News">News</option>
                    <option value="Celebrity News">Celebrity News</option>
                    <option value="Music">Music</option>
                    <option value="Education">Education</option>
                    <option value="Health">Health</option>
                    <option value="Food & Lifestyle">Food & Lifestyle</option>
                    <option value="Technology">Technology</option>
                    <option value="Economy">Economy</option>
                    <option value="Business">Business</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Sport">Sport</option>
                    <option value="Global">Global</option>
                    <option value="Finance">Finance</option>
                    <option value="War">War</option>
                    <option value="Travel">Travel</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Movies">Movies</option>
                    <option value="Trending">Trending</option>
                    <option value="AI">AI</option>
                    <option value="Software">Software</option>
                    <option value="Digital">Digital</option>
                    <option value="Make Money">Make Money</option>
                    <option value="Scholarships">Scholarships</option>
                    <option value="Spiritual">Spiritual</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-xs uppercase tracking-widest text-gray-500 mb-2">Format</label>
                  <select className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm font-bold text-[#111111] outline-none focus:border-[#00a85a] focus:ring-1 focus:ring-[#00a85a] transition" value={formData.format} onChange={handleFormatChange}>
                    <option value="Standard Article">Standard Post</option>
                    <option value="Listicle">Listicle</option>
                    <option value="Feature Story">Feature Story</option>
                    <option value="Opinion/Editorial">Opinion</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-xs uppercase tracking-widest text-gray-500 mb-2">Reporter / Author</label>
                  <input className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm font-bold text-[#111111] outline-none focus:border-[#00a85a] focus:ring-1 focus:ring-[#00a85a] transition" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} required form="editor-form" />
                </div>

                <div>
                  <label className="block font-bold text-xs uppercase tracking-widest text-gray-500 mb-2">Cover Image URL</label>
                  <input className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm font-mono text-[#111111] outline-none focus:border-[#00a85a] focus:ring-1 focus:ring-[#00a85a] transition" placeholder="https://..." value={formData.coverImage} onChange={e => setFormData({...formData, coverImage: e.target.value})} form="editor-form" />
                  {formData.coverImage && (
                    <div className="mt-3 rounded-lg overflow-hidden border border-gray-200 bg-white">
                      <img src={formData.coverImage} alt="Cover Preview" className="w-full h-32 object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <button type="submit" form="editor-form" className="w-full bg-[#00a85a] text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#111111] hover:-translate-y-1 hover:shadow-xl transition-all transform duration-200">
                  {editingId ? "Update Published Article" : "Publish to World"}
                </button>
              </div>
            </div>

            {/* Published Articles List */}
            <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
               <div className="bg-white px-6 py-4 border-b border-gray-200">
                 <h3 className="font-black text-sm uppercase tracking-widest text-[#111111]">Manage Content</h3>
                 <p className="text-xs text-gray-500 mt-1 font-medium">{articles.length} Published Articles</p>
               </div>
               <div className="bg-gray-50 max-h-80 overflow-y-auto w-full divide-y divide-gray-200">
                {articles.map(a => (
                  <div key={a.id} className="group p-4 hover:bg-white transition relative">
                     <div className="pr-16">
                       <span className="inline-block px-2 text-[10px] font-bold uppercase tracking-wider bg-gray-200 text-gray-700 rounded-full mb-2">{a.category}</span>
                       <h4 className="font-bold text-sm text-[#111111] leading-snug line-clamp-2" title={a.title}>{a.title}</h4>
                     </div>
                     <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition shadow-sm" title="Edit" onClick={() => handleEdit(a)}>
                         <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                       </button>
                       <button className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition shadow-sm" title="Delete" onClick={async () => { if(window.confirm('Delete article?')) { await deleteArticle(a.id); setArticles(await getArticles()); } }}>
                         <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                       </button>
                     </div>
                  </div>
                ))}
                {articles.length === 0 && <div className="p-8 text-sm text-gray-500 font-sans font-medium text-center bg-white">No content yet.</div>}
              </div>
            </div>

          </div>
        </aside>
      </div>
    </div>
  );
}
