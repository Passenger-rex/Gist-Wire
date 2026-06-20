import React, { useState, useEffect } from "react";
import { Article } from "../types";
import { saveArticles, getArticles, deleteArticle } from "../lib/db";
import EditorWysiwyg from 'react-simple-wysiwyg';

export default function Editor() {
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
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
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "johntobismart@gmail.com" && password === "Toby@2022") {
      setIsAuth(true);
    } else {
      alert("Incorrect email or password");
    }
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
            <input 
              type="email" 
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-base font-sans font-medium text-white border-b-2 border-gray-700 bg-transparent p-4 outline-none focus:border-[#00a85a] text-center transition placeholder-gray-500"
              required
            />
            <input 
              type="password" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-base font-sans font-medium text-white border-b-2 border-gray-700 bg-transparent p-4 outline-none focus:border-[#00a85a] text-center transition placeholder-gray-500"
              required
            />
            <button type="submit" className="bg-[#00a85a] text-white py-4 font-black uppercase tracking-widest text-xs hover:bg-white hover:text-[#111111] transition w-full shadow-lg">Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50 border-b-[4px] border-[#111111] p-6 md:p-8 gap-6 shadow-sm">
        <div className="md:w-1/3">
          <h2 className="font-sans font-black text-2xl uppercase tracking-tighter text-[#111111] mb-2">CMS Content Manager</h2>
          <p className="text-gray-500 font-sans font-medium text-sm">Admin portal for publishing database entries</p>
        </div>
        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto w-full md:w-2/3 border border-gray-200 bg-white">
          {articles.map(a => (
            <div key={a.id} className="flex items-center justify-between gap-4 text-xs bg-white px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
               <div className="flex items-center gap-3 overflow-hidden">
                 <span className="bg-[#00a85a] text-white px-2 py-1 font-bold uppercase tracking-wider text-[9px] min-w-[70px] text-center shrink-0">{a.category}</span>
                 <span className="font-bold truncate text-[#111111] text-sm" title={a.title}>{a.title}</span>
               </div>
               <div className="flex items-center shrink-0">
                 <button className="text-[#111111] font-black uppercase hover:bg-gray-100 px-3 py-2 transition text-[10px] tracking-widest border-2 border-transparent" onClick={() => handleEdit(a)}>Edit</button>
                 <button className="text-[#00a85a] font-black uppercase hover:bg-red-50 px-3 py-2 transition text-[10px] tracking-widest border-2 border-transparent hover:border-red-200" onClick={async () => { await deleteArticle(a.id); setArticles(await getArticles()); }}>Delete</button>
               </div>
            </div>
          ))}
          {articles.length === 0 && <div className="p-4 text-sm text-gray-500 font-sans font-medium text-center">No articles published. database empty.</div>}
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 md:p-10 border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-10 pb-6 border-b-[4px] border-[#111111] gap-4">
          <h1 className="text-3xl font-sans font-black uppercase tracking-tighter text-[#111111]">{editingId ? "Edit News Alert" : "New News Alert"}</h1>
          <div className="flex items-center gap-2">
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setFormData({ title: "", category: "News", format: "Standard Article", excerpt: "", author: "Staff Reporter", coverImage: "", contentHtml: "<p>Start writing the next report...</p>" }); }} className="bg-gray-200 text-[#111111] px-8 py-3.5 font-black uppercase tracking-widest text-[11px] hover:bg-gray-300 transition w-full sm:w-auto">Cancel</button>
            )}
            <button type="submit" className="bg-[#00a85a] text-white px-8 py-3.5 font-black uppercase tracking-widest text-[11px] hover:bg-[#111111] transition w-full sm:w-auto">{editingId ? "Update Alert" : "Publish Alert"}</button>
          </div>
        </div>
        
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-4">
              <label className="block font-black text-[11px] uppercase tracking-widest text-[#111111] mb-2">Headline</label>
              <input className="w-full text-2xl font-bold font-sans border-b-[3px] border-gray-200 bg-gray-50 p-4 outline-none focus:border-[#00a85a] focus:bg-white transition" placeholder="e.g., Major Policy Overhaul Announced" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
            </div>
            <div className="md:col-span-2">
              <label className="block font-black text-[11px] uppercase tracking-widest text-[#111111] mb-2">Article Type / Format</label>
              <select className="w-full border-b-[3px] border-gray-200 bg-gray-50 p-4 text-base outline-none focus:border-[#00a85a] font-bold text-[#111111] focus:bg-white transition" value={formData.format} onChange={handleFormatChange}>
                <option value="Standard Article">Standard Post</option>
                <option value="Listicle">Listicle</option>
                <option value="Feature Story">Feature Story</option>
                <option value="Opinion/Editorial">Opinion</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block font-black text-[11px] uppercase tracking-widest text-[#111111] mb-2">Section Category</label>
              <select className="w-full border-b-[3px] border-gray-200 bg-gray-50 p-4 text-base outline-none focus:border-[#00a85a] font-bold text-[#111111] focus:bg-white transition" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option value="Celebrity News">Celebrity News</option>
                <option value="Music">Music</option>
                <option value="News">News</option>
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
          </div>
          
          <div>
            <label className="block font-black text-[11px] uppercase tracking-widest text-[#111111] mb-2">Subheadline / Executive Summary</label>
            <textarea className="w-full text-base font-sans font-medium text-gray-700 border border-gray-300 bg-white p-4 outline-none focus:border-[#00a85a] focus:ring-1 focus:ring-[#00a85a] h-28 resize-none transition" placeholder="A brief, engaging summary of the news story..." value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} required />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-100">
            <div>
              <label className="block font-black text-[11px] uppercase tracking-widest text-[#111111] mb-2">Reporter / Author</label>
              <input className="w-full border border-gray-300 p-3.5 text-sm outline-none focus:border-[#00a85a] font-bold text-gray-800 transition" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} required />
            </div>
            <div>
              <label className="block font-black text-[11px] uppercase tracking-widest text-[#111111] mb-2">Cover Image URL</label>
              <input className="w-full border border-gray-300 p-3.5 text-sm outline-none focus:border-[#00a85a] text-gray-800 transition font-mono" placeholder="https://..." value={formData.coverImage} onChange={e => setFormData({...formData, coverImage: e.target.value})} />
            </div>
          </div>
          
          <div>
            <label className="block font-black text-[11px] uppercase tracking-widest text-[#111111] mb-4">Article Body</label>
            <div className="prose max-w-none">
              <EditorWysiwyg 
                containerProps={{ style: { minHeight: '500px', border: '1px solid #d1d5db', padding: '1rem', backgroundColor: '#ffffff', borderRadius: '4px', fontFamily: 'sans-serif' } }} 
                value={formData.contentHtml} 
                onChange={(e: any) => setFormData({...formData, contentHtml: e.target.value})} 
              />
            </div>
            <p className="text-xs text-gray-500 mt-3 font-sans italic">Use the visual editor to construct paragraphs, headings, and lists. Tip: Use HTML tools in the editor to add in-text links and multiple images inside the article body.</p>
          </div>
        </div>
      </form>
    </div>
  );
}
