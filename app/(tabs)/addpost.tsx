import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Image,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useState } from "react";
import { useImagePicker } from "@/hooks/useImagePicker";
import { Ionicons } from "@expo/vector-icons";

export default function Page() {
  const { image, openImagePicker, reset } = useImagePicker();
  const [caption, setCaption] = useState("");

  const handleSave = () => {
    if (!image) {
      Alert.alert("No Image", "Please select an image first.");
      return;
    }

    if (!caption.trim()) {
      Alert.alert("No Caption", "Please add a caption for your post.");
      return;
    }

    Alert.alert("Post Saved!", `${caption}`, [
      {
        text: "OK",
        onPress: () => {
          reset();
          setCaption("");
        },
      },
    ]);
  };

  const handleReset = () => {
    reset();
    setCaption("");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.imageContainer}>
            {image ? (
              <Image source={{ uri: image }} style={styles.selectedImage} />
            ) : (
              <View style={styles.placeholderContent}>
                <Ionicons name="camera" size={40} color="#ccc" />
              </View>
            )}
          </View>

          {!image && (
            <Pressable style={styles.chooseButton} onPress={openImagePicker}>
              <Ionicons
                name="image"
                size={20}
                color="#fff"
                style={styles.buttonIcon}
              />
              <Text style={styles.chooseButtonText}>Choose a photo</Text>
            </Pressable>
          )}

          {image && (
            <>
              <TextInput
                style={styles.captionInput}
                placeholder="Add a caption"
                placeholderTextColor="#999"
                value={caption}
                onChangeText={setCaption}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                returnKeyType="done"
                blurOnSubmit={true}
              />

              <Pressable
                style={[
                  styles.saveButton,
                  !caption.trim() && styles.saveButtonDisabled,
                ]}
                onPress={handleSave}
                disabled={!caption.trim()}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </Pressable>

              <Pressable style={styles.resetButton} onPress={handleReset}>
                <Text style={styles.resetButtonText}>Reset</Text>
              </Pressable>
            </>
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 30,
    paddingBottom: 100,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  placeholderContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  selectedImage: {
    width: "95%",
    height: "95%",
    borderRadius: 8,
  },
  chooseButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#56c9b2ff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    height: 60,
  },
  buttonIcon: {
    marginRight: 8,
  },
  chooseButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  captionInput: {
    width: "100%",
    minHeight: 40,
    borderWidth: 2,
    borderColor: "#56c9b2ff",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    marginTop: 10,
    backgroundColor: "#fff",
  },
  saveButton: {
    width: "85%",
    height: 60,
    backgroundColor: "#56c9b2ff",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
  },
  saveButtonDisabled: {
    backgroundColor: "#56c9b2ff",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  resetButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  resetButtonText: {
    color: "#000",
    fontSize: 16,
    marginTop: 10,
  },
});
