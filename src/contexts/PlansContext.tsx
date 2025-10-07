"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { PaymentPlan } from "@/src/types";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/src/lib/firebase";

interface PlansContextType {
  plans: PaymentPlan[];
  loading: boolean;
  error: string | null;
  refreshPlans: () => Promise<void>;
}

const PlansContext = createContext<PlansContextType | undefined>(undefined);

export function PlansProvider({ children }: { children: ReactNode }) {
  const [plans, setPlans] = useState<PaymentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPlans = async () => {
    try {
      setLoading(true);
      setError(null);

      const plansRef = collection(db, "plans");
      const q = query(plansRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      const plansData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PaymentPlan[];

      setPlans(plansData);
    } catch (err) {
      console.error("Erro ao carregar planos:", err);
      setError("Erro ao carregar planos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const refreshPlans = async () => {
    await loadPlans();
  };

  return (
    <PlansContext.Provider value={{ plans, loading, error, refreshPlans }}>
      {children}
    </PlansContext.Provider>
  );
}

export function usePlans() {
  const context = useContext(PlansContext);
  if (context === undefined) {
    throw new Error("usePlans must be used within a PlansProvider");
  }
  return context;
}

