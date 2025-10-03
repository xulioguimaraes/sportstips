"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/src/lib/firebase";
import { userService } from "@/src/services/userService";
import { User } from "@/src/types";

// Chaves para localStorage
const USER_STORAGE_KEY = "sportstips_user";
const FIREBASE_USER_STORAGE_KEY = "sportstips_firebase_user";

// Funções para gerenciar localStorage
const saveUserToStorage = (user: User | null) => {
  if (user) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_STORAGE_KEY);
  }
};

const loadUserFromStorage = (): User | null => {
  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    if (stored) {
      const user = JSON.parse(stored);
      // Converter createdAt de string para Date se necessário
      if (user.createdAt && typeof user.createdAt === "string") {
        user.createdAt = new Date(user.createdAt);
      }
      return user;
    }
  } catch (error) {
    console.error("Erro ao carregar usuário do localStorage:", error);
  }
  return null;
};

const saveFirebaseUserToStorage = (firebaseUser: FirebaseUser | null) => {
  if (firebaseUser) {
    // Salvar apenas dados essenciais do Firebase User
    const userData = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      emailVerified: firebaseUser.emailVerified,
    };
    localStorage.setItem(FIREBASE_USER_STORAGE_KEY, JSON.stringify(userData));
  } else {
    localStorage.removeItem(FIREBASE_USER_STORAGE_KEY);
  }
};

const loadFirebaseUserFromStorage = (): any | null => {
  try {
    const stored = localStorage.getItem(FIREBASE_USER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Erro ao carregar Firebase user do localStorage:", error);
    return null;
  }
};

const clearUserStorage = () => {
  localStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem(FIREBASE_USER_STORAGE_KEY);
};

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    displayName?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  // Carregar dados do localStorage após hidratação
  useEffect(() => {
    setIsHydrated(true);
    const storedUser = loadUserFromStorage();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);

      // Só salvar no localStorage após hidratação
      if (isHydrated) {
        saveFirebaseUserToStorage(firebaseUser);
      }

      if (firebaseUser) {
        try {
          // Buscar dados do usuário no Firestore
          const userData = await userService.getUserById(firebaseUser.uid);

          if (userData) {
            setUser(userData);
            if (isHydrated) {
              saveUserToStorage(userData);
            }
          } else {
            // Se não existe no Firestore, criar perfil básico
            const basicUser: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || "",
              displayName: firebaseUser.displayName || undefined,
              role: "user",
              freeTipsUsed: 0,
              freeTipsLimit: 5,
              createdAt: new Date(),
            };
            setUser(basicUser);
            if (isHydrated) {
              saveUserToStorage(basicUser);
            }
          }
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error);
          // Fallback para dados básicos
          const fallbackUser: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            displayName: firebaseUser.displayName || undefined,
            role: "user",
            freeTipsUsed: 0,
            freeTipsLimit: 5,
            createdAt: new Date(),
          };
          setUser(fallbackUser);
          if (isHydrated) {
            saveUserToStorage(fallbackUser);
          }
        }
      } else {
        setUser(null);
        if (isHydrated) {
          saveUserToStorage(null);
        }
      }

      setLoading(false);
    });

    return unsubscribe;
  }, [isHydrated]);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (
    email: string,
    password: string,
    displayName?: string
  ) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Criar perfil do usuário no Firestore
    const newUser = await userService.createUser({
      uid: userCredential.user.uid,
      email: userCredential.user.email || email,
      displayName: displayName || userCredential.user.displayName || undefined,
    });

    // Salvar no localStorage se o usuário foi criado com sucesso e está hidratado
    if (newUser !== null && newUser !== undefined && isHydrated) {
      saveUserToStorage(newUser);
    }
  };

  const logout = async () => {
    await signOut(auth);
    // Limpar dados do localStorage se estiver hidratado
    if (isHydrated) {
      clearUserStorage();
    }
  };

  const value = {
    user,
    firebaseUser,
    loading,
    signIn,
    signUp,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
