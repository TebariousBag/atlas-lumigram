import { Text, View, StyleSheet, Pressable } from "react-native";
import { Link, useRouter } from "expo-router";

export default function Page() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Login</Text>
      <Link href="/register" replace>
        <Text>Create a new account</Text>
      </Link>
      <Pressable
        onPress={() => {
          router.replace("/(tabs)");
        }}
      >
        <Text>Sign In</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
