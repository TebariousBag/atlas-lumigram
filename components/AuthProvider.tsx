import { createContext, ReactNode, useContext } from "react";
import { auth } from "@/firebaseConfig";
import { createUserWithEmailAndPassword, UserCredential } from "firebase/auth";

const AuthContext = createContext({ register });

type AuthContextType = {
  register: (email: string, password: string) => Promise<UserCredential>;
};
export const useAuth = () => useContext<AuthContextType>(AuthContext);

function register(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <AuthContext.Provider value={{ register }}>{children}</AuthContext.Provider>
  );
}
