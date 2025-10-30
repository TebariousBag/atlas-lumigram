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
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
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

// Get all posts with pagination
async function getAllPosts(
  lastDoc?: QueryDocumentSnapshot<DocumentData>,
  pageSize: number = 10
): Promise<{
  posts: Post[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
}> {
  let q = query(
    collection(db, "posts"),
    orderBy("createdAt", "desc"),
    limit(pageSize)
  );

  if (lastDoc) {
    q = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      startAfter(lastDoc),
      limit(pageSize)
    );
  }

  const querySnapshot = await getDocs(q);

  const posts = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Post[];

  const newLastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] || null;

  return { posts, lastDoc: newLastDoc };
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
  const docRef = doc(db, "posts", postId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Post;
  }
  return null;
}

// Add a post to user's favorites
async function addToFavorites(userId: string, postId: string) {
  const favoriteRef = doc(db, "favorites", `${userId}_${postId}`);

  // Check if already favorited
  const favoriteSnap = await getDoc(favoriteRef);
  if (favoriteSnap.exists()) {
    // Already in favorites, don't add again
    return;
  }

  // Add to favorites
  await setDoc(favoriteRef, {
    userId,
    postId,
    createdAt: serverTimestamp(),
  });
}

// Remove a post from user's favorites
async function removeFromFavorites(userId: string, postId: string) {
  const favoriteRef = doc(db, "favorites", `${userId}_${postId}`);

  // Check if the favorite exists before trying to delete
  const favoriteSnap = await getDoc(favoriteRef);
  if (!favoriteSnap.exists()) {
    console.log("Favorite does not exist, nothing to remove");
    return;
  }

  await deleteDoc(favoriteRef);
  console.log("Successfully deleted favorite:", `${userId}_${postId}`);
}

// Check if a post is in user's favorites
async function isFavorite(userId: string, postId: string): Promise<boolean> {
  const favoriteRef = doc(db, "favorites", `${userId}_${postId}`);
  const favoriteSnap = await getDoc(favoriteRef);
  return favoriteSnap.exists();
}

// Toggle favorite (add if not exists, remove if exists)
async function toggleFavorite(
  userId: string,
  postId: string
): Promise<boolean> {
  const isFav = await isFavorite(userId, postId);

  if (isFav) {
    await removeFromFavorites(userId, postId);
    return false;
  } else {
    await addToFavorites(userId, postId);
    return true;
  }
}

// Get all favorite post IDs for a user
async function getUserFavorites(userId: string): Promise<string[]> {
  const q = query(collection(db, "favorites"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => doc.data().postId);
}

// Get favorite posts with full post data for a user
async function getFavoritePosts(userId: string): Promise<Post[]> {
  // Get favorite post IDs
  const favoriteIds = await getUserFavorites(userId);

  if (favoriteIds.length === 0) {
    return [];
  }

  // Fetch each post individually
  const posts: Post[] = [];

  for (const postId of favoriteIds) {
    const post = await getPost(postId);
    if (post) {
      posts.push(post);
    }
  }

  // Sort by createdAt descending (newest first)
  posts.sort((a, b) => {
    const aTime = a.createdAt?.toMillis() || 0;
    const bTime = b.createdAt?.toMillis() || 0;
    return bTime - aTime;
  });

  return posts;
}

export default {
  createPost,
  getAllPosts,
  getPostsByUser,
  getPost,
  addToFavorites,
  removeFromFavorites,
  isFavorite,
  toggleFavorite,
  getUserFavorites,
  getFavoritePosts,
};
