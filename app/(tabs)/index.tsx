import {
  View,
  StyleSheet,
  Alert,
  Dimensions,
  Image,
  Text,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useState, useEffect, useCallback } from "react";
import { runOnJS } from "react-native-reanimated";
import firestore, { Post } from "@/lib/firestore";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

const { width } = Dimensions.get("window");

interface ImageItemProps {
  item: Post;
}

function ImageItem({ item }: ImageItemProps) {
  const [showCaption, setShowCaption] = useState(false);

  const handleDoubleTap = () => {
    Alert.alert("Double Tap", "You double tapped the image!");
  };

  const handleLongPress = () => {
    setShowCaption(true);
  };
  // to remove caption after releasing
  const handlePressEnd = () => {
    setShowCaption(false);
  };

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      runOnJS(handleDoubleTap)();
    });

  const longPress = Gesture.LongPress()
    .minDuration(300)
    .onStart(() => {
      runOnJS(handleLongPress)();
    })
    .onEnd(() => {
      runOnJS(handlePressEnd)();
    });

  const composed = Gesture.Race(doubleTap, longPress);

  return (
    <View style={styles.imageContainer}>
      <GestureDetector gesture={composed}>
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
          {showCaption && (
            <View style={styles.captionOverlay}>
              <Text style={styles.captionText}>{item.caption}</Text>
            </View>
          )}
        </View>
      </GestureDetector>
    </View>
  );
}

export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Fetch initial posts
  const fetchPosts = useCallback(
    async (isRefresh = false) => {
      if (loading) return;

      setLoading(true);
      try {
        const result = await firestore.getAllPosts(
          isRefresh ? undefined : lastDoc || undefined,
          10
        );

        if (isRefresh) {
          setPosts(result.posts);
        } else {
          setPosts((prev) => [...prev, ...result.posts]);
        }

        setLastDoc(result.lastDoc);
        setHasMore(result.posts.length > 0);
      } catch (error) {
        console.error("Error fetching posts:", error);
        Alert.alert("Error", "Failed to load posts. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [lastDoc, loading]
  );

  // Pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setLastDoc(null);
    setHasMore(true);
    await fetchPosts(true);
    setRefreshing(false);
  }, [fetchPosts]);

  // Load more posts (infinite scroll)
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || lastDoc === null) return;

    setLoadingMore(true);
    try {
      const result = await firestore.getAllPosts(lastDoc, 10);

      if (result.posts.length > 0) {
        setPosts((prev) => [...prev, ...result.posts]);
        setLastDoc(result.lastDoc);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [lastDoc, hasMore, loadingMore]);

  // Initial load
  useEffect(() => {
    fetchPosts(true);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Post }) => <ImageItem item={item} />,
    []
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.loadingMore}>
        <ActivityIndicator size="small" color="#56c9b2ff" />
      </View>
    );
  };

  if (loading && posts.length === 0) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <ActivityIndicator size="large" color="#56c9b2ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlashList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        decelerationRate="normal"
        contentContainerStyle={{ paddingBottom: 60 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        estimatedItemSize={width + 10}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centerContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1,
    marginTop: 10,
    marginBottom: 0,
    paddingHorizontal: 10,
  },
  imageWrapper: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  captionOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 15,
  },
  captionText: {
    color: "#fff",
    fontSize: 16,
  },
  loadingMore: {
    paddingVertical: 20,
    alignItems: "center",
  },
});
