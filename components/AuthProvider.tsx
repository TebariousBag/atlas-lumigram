import { createContext, ReactNode, useContext } from "react";
import { auth } from "@/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signOut,
  UserCredential,
} from "firebase/auth";

type AuthContextType = {
  register: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
};

function register(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

function logout() {
  return signOut(auth);
}

const AuthContext = createContext<AuthContextType>({ register, logout });

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <AuthContext.Provider value={{ register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
