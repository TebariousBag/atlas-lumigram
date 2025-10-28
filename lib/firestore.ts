import { db } from "@/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

// Post data structure
export interface Post {
  id: string;
  imageUrl: string; // URL from Firebase Storage
  caption: string;
  createdAt: Timestamp;
  createdBy: string;
}

// Create a new post
async function createPost(data: {
  imageUrl?: string;
  caption: string;
  createdBy: string;
}) {
  const docRef = await addDoc(collection(db, "posts"), {
    imageUrl: data.imageUrl,
    caption: data.caption,
    createdAt: serverTimestamp(),
    createdBy: data.createdBy,
  });

  return docRef.id;
}

// Get all posts
async function getAllPosts(): Promise<Post[]> {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Post[];
}

// Get posts by a specific user
async function getPostsByUser(userId: string): Promise<Post[]> {
  const q = query(
    collection(db, "posts"),
    where("createdBy", "==", userId),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Post[];
}

// Get a single post by ID
async function getPost(postId: string): Promise<Post | null> {
  const { getDoc, doc } = await import("firebase/firestore");
  const docRef = doc(db, "posts", postId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Post;
  }
  return null;
}

export default {
  createPost,
  getAllPosts,
  getPostsByUser,
  getPost,
};
