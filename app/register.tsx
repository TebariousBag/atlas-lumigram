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

      <Text style={styles.title}>Register</Text>

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
        style={styles.createAccountButton}
        onPress={() => {
          router.replace("/(tabs)");
        }}
      >
        <Text style={styles.createAccountButtonText}>Create Account</Text>
      </Pressable>

      <Link href="/login" replace asChild>
        <Pressable style={styles.loginLink}>
          <Text style={styles.loginText}>Login to an existing account</Text>
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
    backgroundColor: "#1A2036",
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#fff",
  },
  input: {
    width: "100%",
    maxWidth: 400,
    height: 55,
    borderWidth: 2,
    borderColor: "#66D9EF",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: "#1A2036",
    color: "#fff",
  },
  createAccountButton: {
    width: "100%",
    maxWidth: 400,
    height: 55,
    backgroundColor: "#66D9EF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  createAccountButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  loginLink: {
    width: "100%",
    maxWidth: 400,
    height: 55,
    borderWidth: 2,
    borderColor: "#66D9EF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1A2036",
  },
  loginText: {
    color: "#fff",
    fontSize: 16,
  },
});
