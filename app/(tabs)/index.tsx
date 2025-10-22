import { View, StyleSheet, Alert, Dimensions, Image, Text } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useState } from "react";
import { runOnJS } from "react-native-reanimated";
import { homeFeed } from "@/placeholder";

const { width } = Dimensions.get("window");

interface FeedItem {
  image: string;
  caption: string;
  id: string;
  createdBy: string;
}

interface ImageItemProps {
  item: FeedItem;
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
            source={{ uri: item.image }}
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
  const renderItem = ({ item }: { item: FeedItem }) => (
    <ImageItem item={item} />
  );

  return (
    <View style={styles.container}>
      <FlashList
        data={homeFeed}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        decelerationRate="normal"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
