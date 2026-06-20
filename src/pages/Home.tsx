import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Article } from "../types";
import { getArticles } from "../lib/db";

export default function Home({ searchQuery, categoryQuery }: { searchQuery?: string, categoryQuery?: string }) {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    let allArticles = getArticles();
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      allArticles = allArticles.filter(a => 
        a.title.toLowerCase().includes(q) || 
        a.category.toLowerCase().includes(q) ||
        a.contentHtml.toLowerCase().includes(q)
      );
    }
    if (categoryQuery) {
      const q = categoryQuery.toLowerCase();
      allArticles = allArticles.filter(a => a.category.toLowerCase().trim() === q.trim() || a.category.toLowerCase().includes(q));
    }
    setArticles(allArticles);
  }, [searchQuery, categoryQuery]);

  if (articles.length === 0) return (
    <div className="p-20 text-center">
      <Helmet>
        <title>{searchQuery ? `Search Results for "${searchQuery}"` : categoryQuery ? `${categoryQuery} News` : "No News Available"}</title>
      </Helmet>
      <p className="text-gray-500 font-sans font-bold text-lg">
        {searchQuery ? `No results found for "${searchQuery}".` : categoryQuery ? `No articles found in category "${categoryQuery}".` : "No news currently available. Check back later."}
      </p>
    </div>
  );

  // Group articles by category
  const categorizedArticles: Record<string, Article[]> = {};
  articles.forEach(article => {
    if (!categorizedArticles[article.category]) {
      categorizedArticles[article.category] = [];
    }
    categorizedArticles[article.category].push(article);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {searchQuery && (
        <h2 className="text-2xl font-black uppercase tracking-tighter text-[#111111] mb-8">
          Search Results: <span className="text-[#00a85a]">"{searchQuery}"</span>
        </h2>
      )}
      {categoryQuery && (
        <h2 className="text-3xl font-black uppercase tracking-tighter text-[#111111] mb-8 border-l-[6px] border-[#00a85a] pl-4">
          Latest in <span className="text-[#00a85a]">{categoryQuery}</span>
        </h2>
      )}
      
      {Object.entries(categorizedArticles).map(([category, categoryArticles]) => (
        <div key={category} className="mb-12">
           {(!categoryQuery && !searchQuery) && (
             <h3 className="flex items-center text-xs font-black uppercase tracking-widest border-b-[4px] border-[#111111] pb-2 mb-8 text-[#111111]">
               <span className="w-2 h-2 bg-[#00a85a] mr-2"></span> {category}
             </h3>
           )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoryArticles.map(article => (
              <div key={article.id} className="group flex flex-col h-full">
                <a href={`#/post/${article.slug}`} className="block flex-grow">
                  <div className="aspect-[16/9] overflow-hidden bg-gray-100 mb-3 border-b-[4px] border-[#00a85a] relative">
                    {article.coverImage && (
                      <img src={article.coverImage} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt={article.title} loading="lazy" />
                    )}
                  </div>
                  <h4 className="font-black text-lg leading-snug mb-2 group-hover:text-[#00a85a] transition text-gray-900 tracking-tight">
                    {article.title}
                  </h4>
                  <p className="text-gray-600 text-sm font-sans font-medium line-clamp-2 mb-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </a>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-auto pt-2">
                  {article.author} <span className="mx-1">•</span> {new Date(article.publishDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
