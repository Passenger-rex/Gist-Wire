import React, { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Article } from "../types";
import { getArticleBySlug, getComments, saveComment, likeComment, CommentType, incrementViews } from "../lib/db";
import { MessageCircle, ThumbsUp, Facebook, Twitter, MessageCircle as WhatsApp, Link as LinkIcon } from "lucide-react";

export default function ArticleView({ slug }: { slug: string }) {
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newCommentName, setNewCommentName] = useState("");
  const [newCommentText, setNewCommentText] = useState("");
  const [headings, setHeadings] = useState<{ id: string, text: string, level: string }[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getArticleBySlug(slug).then(found => {
      setArticle(found || null);
      if (found) {
        getComments(found.id).then(setComments);
        incrementViews(slug);
      }
    });
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (article && contentRef.current) {
      const hTags = contentRef.current.querySelectorAll<HTMLElement>("h2, h3");
      const extractedHeadings = Array.from(hTags as NodeListOf<HTMLElement>).map((h, i) => {
        if (!h.id) h.id = `section-heading-${i}`;
        return { id: h.id, text: h.textContent || "", level: h.tagName.toLowerCase() };
      });
      setHeadings(extractedHeadings);

      const imgTags = contentRef.current.querySelectorAll("img");
      imgTags.forEach(img => {
        if (!img.hasAttribute("loading")) {
          img.setAttribute("loading", "lazy");
        }
      });
    }
  }, [article]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!article || !newCommentName.trim() || !newCommentText.trim()) return;
    
    const comment: CommentType = {
      id: Date.now().toString(),
      articleId: article.id,
      name: newCommentName,
      text: newCommentText,
      date: new Date().toISOString(),
      likes: 0
    };
    
    await saveComment(comment);
    setComments(await getComments(article.id));
    setNewCommentText("");
  };

  const handleLikeComment = async (commentId: string) => {
    if (!article) return;
    await likeComment(commentId);
    setComments(await getComments(article.id));
  };

  const shareUrl = window.location.href;
  const shareTitle = article?.title || "Check out this article!";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Link copied to clipboard!");
  };

  if (!article) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-32 text-center h-[50vh] flex flex-col items-center justify-center">
        <Helmet>
          <title>Article Not Found - GistWire</title>
        </Helmet>
        <h1 className="text-4xl font-sans font-black uppercase text-[#111111] mb-6 tracking-tighter">Article not found</h1>
        <a href="#/" className="inline-block px-8 py-4 bg-[#00a85a] text-white font-black uppercase tracking-widest text-xs hover:bg-[#111111] transition">Return to Publication</a>
      </div>
    );
  }

  return (
    <article className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
      <Helmet>
        <title>{`${article.title} - GistWire`}</title>
        <meta name="description" content={article.excerpt || "Read full article on GistWire."} />
        {article.coverImage && <meta property="og:image" content={article.coverImage} />}
      </Helmet>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Social Share Sidebar (Desktop) */}
        <div className="hidden lg:flex lg:col-span-1 flex-col items-center gap-4 pt-4 border-r border-gray-200">
          <span className="text-xs font-black text-[#111111] uppercase tracking-widest mb-2" style={{writingMode: "vertical-rl", transform: "rotate(180deg)"}}>Share</span>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition text-gray-700">
            <Facebook size={16} />
          </a>
          <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-[#111111] hover:text-white hover:border-[#111111] transition text-gray-700">
            <Twitter size={16} />
          </a>
          <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + " " + shareUrl)}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition text-gray-700">
            <WhatsApp size={16} />
          </a>
          <button onClick={handleCopyLink} className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-[#00a85a] hover:text-white hover:border-[#00a85a] transition text-gray-700">
            <LinkIcon size={16} />
          </button>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-8">
          <div className="mb-8 border-b-4 border-[#111111] pb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-3 h-3 bg-[#00a85a]"></span>
              <a href="#/" className="text-[#00a85a] font-black uppercase tracking-widest text-xs hover:text-[#00c86b] transition-colors">
                {article.category}
              </a>
              {article.format && (
                 <>
                   <span className="text-gray-300">/</span>
                   <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">{article.format}</span>
                 </>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-black text-[#111111] leading-[1.1] tracking-tight mb-4">
              {article.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 font-sans font-medium leading-relaxed mb-6">
              {article.excerpt}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-t border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#111111] flex items-center justify-center font-black text-white text-xl font-sans">
                  {article.author.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-[#111111] text-sm uppercase tracking-wider mb-1">By {article.author}</div>
                  <div className="text-[11px] font-bold text-gray-500 flex items-center gap-2 uppercase tracking-widest">
                    <span>Published: {new Date(article.publishDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
              <div className="flex lg:hidden gap-3 mt-4 sm:mt-0">
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-blue-600 transition"><Facebook size={20} /></a>
                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-[#111111] transition"><Twitter size={20} /></a>
                <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + " " + shareUrl)}`} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-[#25D366] transition"><WhatsApp size={20} /></a>
                <button onClick={handleCopyLink} className="text-gray-500 hover:text-[#00a85a] transition"><LinkIcon size={20} /></button>
              </div>
            </div>
          </div>

          {article.coverImage && (
            <figure className="mb-10">
               <img src={article.coverImage} alt={article.title} className="w-full object-cover bg-gray-100 border-b-[6px] border-[#00a85a]" />
              <figcaption className="text-xs text-gray-500 mt-3 font-sans font-medium pb-4 border-b border-gray-200 uppercase tracking-widest">
                Provided via GistWire Partner Networks
              </figcaption>
            </figure>
          )}

          {headings.length > 0 && (
             <div className="bg-gray-50 border-l-[4px] border-[#00a85a] p-6 mb-10 lg:hidden">
               <h4 className="font-bold text-xs uppercase tracking-widest text-[#111111] mb-4">Table of Contents</h4>
               <ul className="space-y-3">
                 {headings.map(h => (
                   <li key={h.id} className={`${h.level === 'h3' ? 'ml-4' : ''}`}>
                     <a href={`#${h.id}`} className="text-gray-600 hover:text-[#00a85a] transition font-medium text-sm">
                       {h.text}
                     </a>
                   </li>
                 ))}
               </ul>
             </div>
          )}

          <div 
             ref={contentRef}
             className="prose prose-lg max-w-none font-sans font-medium text-gray-800 
                          prose-headings:font-black prose-headings:text-[#111111] prose-headings:scroll-mt-20
                          prose-a:text-[#00a85a] prose-a:underline hover:prose-a:text-[#00c86b] 
                          prose-p:leading-relaxed prose-blockquote:border-l-[6px] prose-blockquote:border-[#00a85a] prose-blockquote:bg-gray-50 
                          prose-blockquote:p-6 prose-blockquote:text-lg prose-blockquote:font-black prose-blockquote:text-[#111111]
                          prose-li:marker:text-[#00a85a] prose-img:border-b-[4px] prose-img:border-[#00a85a]" 
               dangerouslySetInnerHTML={{ __html: article.contentHtml }} />

          {/* Comments Section */}
          <div className="mt-16 pt-10 border-t-[4px] border-gray-200">
            <h3 className="font-sans font-black text-2xl uppercase tracking-tighter mb-8 flex items-center gap-3 text-[#111111]">
              <MessageCircle className="text-[#00a85a]" size={28} />
              Interactions & Comments ({comments.length})
            </h3>

            <div className="bg-gray-50 p-6 border-l-[4px] border-[#00a85a] mb-10">
              <h4 className="font-bold text-sm uppercase tracking-widest text-[#111111] mb-4">Leave a Reply</h4>
              <form onSubmit={handlePostComment} className="flex flex-col gap-4">
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  value={newCommentName}
                  onChange={(e) => setNewCommentName(e.target.value)}
                  className="w-full md:w-1/2 border border-gray-300 p-3 text-sm outline-none focus:border-[#00a85a]"
                  required
                />
                <textarea 
                  placeholder="Share your thoughts..." 
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="w-full border border-gray-300 p-3 text-sm outline-none focus:border-[#00a85a] h-24 resize-none"
                  required
                />
                <button type="submit" className="bg-[#111111] text-white px-8 py-3 text-xs font-black uppercase tracking-widest hover:bg-[#00a85a] transition self-start">
                  Post Comment
                </button>
              </form>
            </div>

            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-200 pb-6 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-bold text-[#111111]">{comment.name}</span>
                      <span className="text-gray-400 text-xs ml-3 font-medium uppercase tracking-wider">
                        {new Date(comment.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 font-sans font-medium text-sm leading-relaxed mb-3">
                    {comment.text}
                  </p>
                  <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-500">
                    <button onClick={() => handleLikeComment(comment.id)} className="flex items-center gap-1.5 hover:text-[#00a85a] transition">
                      <ThumbsUp size={14} /> {comment.likes}
                    </button>
                    <button className="hover:text-[#111111] transition">Reply</button>
                  </div>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-gray-500 font-sans font-medium text-sm italic">No comments yet. Be the first to share your opinion!</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="lg:col-span-3 pl-0 lg:pl-8 border-t lg:border-t-0 lg:border-l border-gray-200 pt-10 lg:pt-0">
           <div className="sticky top-10 space-y-12">
             
             {headings.length > 0 && (
                <div className="hidden lg:block">
                  <h3 className="flex items-center text-xs font-black uppercase tracking-widest border-b-[4px] border-[#111111] pb-2 mb-6 text-[#111111]">
                    <span className="w-2 h-2 bg-[#00a85a] mr-2"></span> Navigation
                  </h3>
                  <ul className="space-y-3">
                    {headings.map(h => (
                      <li key={h.id} className={`${h.level === 'h3' ? 'ml-4' : ''}`}>
                        <a href={`#${h.id}`} className="text-gray-500 hover:text-[#00a85a] transition font-medium text-sm block border-l-2 border-transparent hover:border-[#00a85a] pl-2">
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
             )}

             <div>
               <h3 className="flex items-center text-xs font-black uppercase tracking-widest border-b-[4px] border-[#111111] pb-2 mb-8 text-[#111111]">
                 <span className="w-2 h-2 bg-[#00a85a] mr-2"></span> Top Headlines
               </h3>
               <div className="space-y-8">
                  <a href="#/" className="flex flex-col gap-3 group">
                    <div className="w-full h-32 bg-gray-200 flex-shrink-0 border-b-[4px] border-[#00a85a]">
                      <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=300&q=80" className="w-full h-full object-cover group-hover:opacity-80 transition" alt="thumbnail" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-[#00a85a] mb-1 tracking-widest">World</p>
                      <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#00a85a] transition leading-snug">Global Summit Agrees on New Climate Action Framework for 2026</h4>
                    </div>
                  </a>
                  <a href="#/" className="flex flex-col gap-3 group">
                    <div className="w-full h-32 bg-gray-200 flex-shrink-0 border-b-[4px] border-[#00a85a]">
                      <img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=300&q=80" className="w-full h-full object-cover group-hover:opacity-80 transition" alt="thumbnail" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-[#00a85a] mb-1 tracking-widest">Business</p>
                      <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#00a85a] transition leading-snug">Central Bank Announces Unexpected Interest Rate Cut</h4>
                    </div>
                  </a>
               </div>
             </div>
           </div>
        </aside>
      </div>
    </article>
  );
}
