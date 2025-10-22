import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function LogoutComponent() {
  const router = useRouter();

  function logout() {
    router.replace("/login");
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
