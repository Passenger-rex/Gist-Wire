import { collection, doc, getDocs, getDoc, setDoc, deleteDoc, updateDoc, increment, query, where } from "firebase/firestore";
import { db } from "./firebase";
import { Article } from "../types";

export interface CommentType {
  id: string;
  articleId: string;
  name: string;
  text: string;
  date: string;
  likes: number;
}

export const getArticles = async (): Promise<Article[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "articles"));
    const articles: Article[] = [];
    querySnapshot.forEach((doc) => {
      articles.push(doc.data() as Article);
    });
    return articles;
  } catch (e) {
    console.error("Error fetching articles", e);
    return [];
  }
};

export const saveArticles = async (articles: Article[]) => {
  // This function is less common in Firebase unless batch writing.
  // Assuming it's meant to save individual new articles or sync an array.
  try {
    for (const article of articles) {
      await setDoc(doc(db, "articles", article.id), article);
    }
  } catch (e) {
    console.error("Error saving articles", e);
  }
};

export const getArticleBySlug = async (slug: string): Promise<Article | undefined> => {
  try {
    const q = query(collection(db, "articles"), where("slug", "==", slug));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as Article;
    }
  } catch (e) {
    console.error("Error fetching article by slug", e);
  }
  return undefined;
};

export const incrementViews = async (slug: string) => {
  try {
    const q = query(collection(db, "articles"), where("slug", "==", slug));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, {
        views: increment(1)
      });
    }
  } catch (e) {
    console.error("Error incrementing views", e);
  }
};

export const deleteArticle = async (id: string) => {
  try {
    await deleteDoc(doc(db, "articles", id));
  } catch (e) {
    console.error("Error deleting article", e);
  }
};

export const getComments = async (articleId: string): Promise<CommentType[]> => {
  try {
    const q = query(collection(db, "comments"), where("articleId", "==", articleId));
    const querySnapshot = await getDocs(q);
    const comments: CommentType[] = [];
    querySnapshot.forEach((doc) => {
      comments.push(doc.data() as CommentType);
    });
    return comments;
  } catch (e) {
    console.error("Error fetching comments", e);
    return [];
  }
};

export const saveComment = async (comment: CommentType) => {
  try {
    await setDoc(doc(db, "comments", comment.id), comment);
  } catch (e) {
    console.error("Error saving comment", e);
  }
};

export const likeComment = async (commentId: string) => {
  try {
    const docRef = doc(db, "comments", commentId);
    await updateDoc(docRef, {
      likes: increment(1)
    });
  } catch (e) {
    console.error("Error liking comment", e);
  }
};

