import {
  Text,
  View,
  StyleSheet,
  Pressable,
  TextInput,
  Image,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { useState } from "react";

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Pressable
        style={styles.signInButton}
        onPress={() => {
          router.replace("/(tabs)");
        }}
      >
        <Text style={styles.signInButtonText}>Sign In</Text>
      </Pressable>

      <Link href="/register" replace asChild>
        <Pressable style={styles.createAccountLink}>
          <Text style={styles.createAccountText}>Create a new account</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#08143eff",
    padding: 20,
  },
  logo: {
    width: 225,
    height: 150,
    marginBottom: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
  },
  input: {
    width: "100%",
    maxWidth: 400,
    height: 40,
    borderWidth: 1,
    borderColor: "#56c9b2ff",
    borderRadius: 4,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: "#1A2036",
    color: "#fff",
  },
  signInButton: {
    width: "100%",
    maxWidth: 400,
    height: 35,
    backgroundColor: "#56c9b2ff",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 0,
  },
  signInButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  createAccountLink: {
    width: "100%",
    maxWidth: 400,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
  },
  createAccountText: {
    color: "#fff",
    fontSize: 12,
  },
});
