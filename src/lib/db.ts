import { Article } from "../types";

const DB_KEY = "gistwire_articles";
const COMMENTS_KEY = "gistwire_comments";

export interface CommentType {
  id: string;
  articleId: string;
  name: string;
  text: string;
  date: string;
  likes: number;
}

export const getArticles = (): Article[] => {
  try {
    const data = window.localStorage.getItem(DB_KEY);
    if (data) {
      let articles: Article[] = JSON.parse(data);
      // Initialize views if they don't exist
      articles = articles.map(a => ({
        ...a,
        views: a.views ?? Math.floor(Math.random() * 1000) + 50
      }));
      return articles;
    }
  } catch (e) {
    console.error("Error reading from local storage", e);
  }
  return []; // Start completely empty
};

export const saveArticles = (articles: Article[]) => {
  window.localStorage.setItem(DB_KEY, JSON.stringify(articles));
};

export const getArticleBySlug = (slug: string): Article | undefined => {
  const articles = getArticles();
  return articles.find(a => a.slug === slug);
};

export const incrementViews = (slug: string) => {
  const articles = getArticles();
  const index = articles.findIndex(a => a.slug === slug);
  if (index > -1) {
    articles[index].views = (articles[index].views || 0) + 1;
    saveArticles(articles);
  }
};

export const deleteArticle = (id: string) => {
  const articles = getArticles();
  saveArticles(articles.filter(a => a.id !== id));
};

export const getComments = (articleId: string): CommentType[] => {
  try {
    const data = window.localStorage.getItem(COMMENTS_KEY);
    if (data) {
      const allComments: CommentType[] = JSON.parse(data);
      return allComments.filter(c => c.articleId === articleId);
    }
  } catch (e) {}
  return [];
};

export const saveComment = (comment: CommentType) => {
  try {
    let allComments: CommentType[] = [];
    const data = window.localStorage.getItem(COMMENTS_KEY);
    if (data) {
      allComments = JSON.parse(data);
    }
    allComments.push(comment);
    window.localStorage.setItem(COMMENTS_KEY, JSON.stringify(allComments));
  } catch (e) {}
};

export const likeComment = (commentId: string) => {
  try {
    const data = window.localStorage.getItem(COMMENTS_KEY);
    if (data) {
      let allComments: CommentType[] = JSON.parse(data);
      const commentIndex = allComments.findIndex(c => c.id === commentId);
      if (commentIndex > -1) {
        allComments[commentIndex].likes += 1;
        window.localStorage.setItem(COMMENTS_KEY, JSON.stringify(allComments));
      }
    }
  } catch (e) {}
};
