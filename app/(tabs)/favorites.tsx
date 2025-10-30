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
import { useAuth } from "@/components/AuthProvider";

const { width } = Dimensions.get("window");

interface ImageItemProps {
  item: Post;
}

interface ImageItemPropsWithRemove {
  item: Post;
  onRemove: () => void;
}

function ImageItem({ item, onRemove }: ImageItemPropsWithRemove) {
  const [showCaption, setShowCaption] = useState(false);
  const { user } = useAuth();

  const handleDoubleTap = async () => {
    if (!user) {
      Alert.alert("Not Logged In", "Please log in to manage favorites.");
      return;
    }

    try {
      console.log("Removing favorite:", user.uid, item.id);
      await firestore.removeFromFavorites(user.uid, item.id);
      console.log("Successfully removed from favorites");

      // Update UI immediately
      onRemove();

      Alert.alert("Removed", "Post has been removed from favorites.");
    } catch (error) {
      console.error("Error removing favorite:", error);
      Alert.alert(
        "Error",
        `Failed to remove favorite: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };

  const handleLongPress = () => {
    setShowCaption(true);
  };

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

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      return;
    }

    setLoading(true);
    try {
      const posts = await firestore.getFavoritePosts(user.uid);
      setFavorites(posts);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      Alert.alert("Error", "Failed to load favorites. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchFavorites();
    setRefreshing(false);
  }, [fetchFavorites]);

  // Remove favorite and update local state immediately
  const removeFavorite = useCallback(
    async (postId: string) => {
      if (!user) return;

      // Optimistically remove from local state
      setFavorites((prev) => prev.filter((post) => post.id !== postId));

      // Then refresh from server to ensure sync
      await fetchFavorites();
    },
    [user, fetchFavorites]
  );

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const renderItem = useCallback(
    ({ item }: { item: Post }) => (
      <ImageItem item={item} onRemove={() => removeFavorite(item.id)} />
    ),
    [removeFavorite]
  );

  if (!user) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <Text style={styles.emptyText}>Please log in to view favorites</Text>
      </View>
    );
  }

  if (loading && favorites.length === 0) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <ActivityIndicator size="large" color="#56c9b2ff" />
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <Text style={styles.emptyText}>No favorites yet</Text>
        <Text style={styles.emptySubtext}>
          Double tap on any post to add it to favorites
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlashList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        decelerationRate="normal"
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        estimatedItemSize={width + 10}
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
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    paddingHorizontal: 40,
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
});
