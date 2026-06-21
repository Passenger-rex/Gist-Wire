import { Article } from "../types";

export interface CommentType {
  id: string;
  articleId: string;
  name: string;
  text: string;
  date: string;
  likes: number;
}

const getStoredArticles = (): Article[] => {
  const data = localStorage.getItem("gistwire_articles");
  return data ? JSON.parse(data) : [];
};

const setStoredArticles = (articles: Article[]) => {
  localStorage.setItem("gistwire_articles", JSON.stringify(articles));
};

const getStoredComments = (): CommentType[] => {
  const data = localStorage.getItem("gistwire_comments");
  return data ? JSON.parse(data) : [];
};

const setStoredComments = (comments: CommentType[]) => {
  localStorage.setItem("gistwire_comments", JSON.stringify(comments));
};

export const getArticles = async (): Promise<Article[]> => {
  return getStoredArticles();
};

export const saveArticles = async (articles: Article[]) => {
  setStoredArticles(articles);
};

export const getArticle = async (id: string): Promise<Article | undefined> => {
  return getStoredArticles().find(a => a.id === id);
};

export const saveArticle = async (article: Article) => {
  let articles = getStoredArticles();
  const index = articles.findIndex(a => a.id === article.id);
  if (index > -1) {
    articles[index] = article;
  } else {
    articles.push(article);
  }
  setStoredArticles(articles);
};

export const getArticleBySlug = async (slug: string): Promise<Article | undefined> => {
  return getStoredArticles().find(a => a.slug === slug);
};

export const incrementViews = async (slug: string) => {
  let articles = getStoredArticles();
  const article = articles.find(a => a.slug === slug);
  if (article) {
    article.views = (article.views || 0) + 1;
    setStoredArticles(articles);
  }
};

export const likeArticle = async (slug: string, isLiking: boolean = true) => {
  let articles = getStoredArticles();
  const article = articles.find(a => a.slug === slug);
  if (article) {
    article.likes = (article.likes || 0) + (isLiking ? 1 : -1);
    setStoredArticles(articles);
  }
};

export const deleteArticle = async (id: string) => {
  let articles = getStoredArticles();
  articles = articles.filter(a => a.id !== id);
  setStoredArticles(articles);
};

export const getComments = async (articleId: string): Promise<CommentType[]> => {
  return getStoredComments().filter(c => c.articleId === articleId);
};

export const saveComment = async (comment: CommentType) => {
  let comments = getStoredComments();
  comments.push(comment);
  setStoredComments(comments);
};

export const likeComment = async (commentId: string, isLiking: boolean = true) => {
  let comments = getStoredComments();
  const comment = comments.find(c => c.id === commentId);
  if (comment) {
    comment.likes = (comment.likes || 0) + (isLiking ? 1 : -1);
    setStoredComments(comments);
  }
};
