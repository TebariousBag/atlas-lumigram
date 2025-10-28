import { createContext, ReactNode, useContext } from "react";
import { auth } from "@/firebaseConfig";
import { createUserWithEmailAndPassword, UserCredential } from "firebase/auth";

type AuthContextType = {
  register: (email: string, password: string) => Promise<UserCredential>;
};

function register(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

const AuthContext = createContext<AuthContextType>({ register });

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <AuthContext.Provider value={{ register }}>{children}</AuthContext.Provider>
  );
}
