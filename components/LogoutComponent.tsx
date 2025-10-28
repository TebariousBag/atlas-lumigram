import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "./AuthProvider";

export default function LogoutComponent() {
  const router = useRouter();
  const auth = useAuth();

  async function logout() {
    try {
      await auth.logout();
      router.replace("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  }

  return (
    <Pressable onPress={logout}>
      <Ionicons
        name="log-out-outline"
        size={24}
        color="#56c9b2ff"
        style={{ marginRight: 16 }}
      />
    </Pressable>
  );
}
