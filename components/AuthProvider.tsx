import { createContext, ReactNode, useContext } from "react";
import { auth } from "@/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

function register(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <AuthContext.Provider value={{ register }}>{children}</AuthContext.Provider>
  );
}
