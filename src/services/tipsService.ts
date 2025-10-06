import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { Tip, TipFormData } from "@/src/types";

const TIPS_COLLECTION = "tips";

// Função auxiliar para normalizar datas
const normalizeDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    // Retornar no formato YYYY-MM-DD
    return date.toISOString().split("T")[0];
  } catch (error) {
    console.error("Erro ao normalizar data:", dateString, error);
    return dateString;
  }
};

export const tipsService = {
  // Criar um novo palpite
  async createTip(tipData: TipFormData, userId: string): Promise<string> {
    const docRef = await addDoc(collection(db, TIPS_COLLECTION), {
      ...tipData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      createdBy: userId,
      status: "active",
      result: "pending",
    });
    return docRef.id;
  },

  // Atualizar um palpite existente
  async updateTip(tipId: string, tipData: Partial<TipFormData>): Promise<void> {
    const tipRef = doc(db, TIPS_COLLECTION, tipId);
    await updateDoc(tipRef, {
      ...tipData,
      updatedAt: Timestamp.now(),
    });
  },

  // Deletar um palpite
  async deleteTip(tipId: string): Promise<void> {
    const tipRef = doc(db, TIPS_COLLECTION, tipId);
    await deleteDoc(tipRef);
  },

  // Buscar todos os palpites
  async getAllTips(): Promise<Tip[]> {
    const q = query(
      collection(db, TIPS_COLLECTION),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Tip[];
  },

  // Buscar palpite por ID
  async getTipById(tipId: string): Promise<Tip | null> {
    const tipRef = doc(db, TIPS_COLLECTION, tipId);
    const tipSnap = await getDoc(tipRef);

    if (tipSnap.exists()) {
      return {
        id: tipSnap.id,
        ...tipSnap.data(),
        createdAt: tipSnap.data().createdAt?.toDate(),
        updatedAt: tipSnap.data().updatedAt?.toDate(),
      } as Tip;
    }

    return null;
  },

  // Buscar palpites por categoria
  async getTipsByCategory(category: string): Promise<Tip[]> {
    // Buscar todos os palpites e filtrar por categoria no cliente
    // Isso evita a necessidade de criar índices compostos
    const q = query(
      collection(db, TIPS_COLLECTION),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    const allTips = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Tip[];

    // Filtrar por categoria no cliente
    return allTips.filter((tip) => tip.category === category);
  },

  // Buscar palpites ativos
  async getActiveTips(): Promise<Tip[]> {
    // Primeiro, buscar todos os palpites e filtrar no cliente
    // Isso evita a necessidade de criar índices compostos
    const q = query(
      collection(db, TIPS_COLLECTION),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    const allTips = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Tip[];

    // Filtrar palpites ativos no cliente
    return allTips.filter((tip) => tip.status === "active");
  },

  // Buscar palpites por data
  async getTipsByDate(date: string): Promise<Tip[]> {
    const q = query(
      collection(db, TIPS_COLLECTION),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    const allTips = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Tip[];

   
    const filteredTips = allTips.filter((tip) => {
      try {
        // Se o matchTime for uma string de datetime-local (ISO format)
        if (tip.matchTime && tip.matchTime.includes("T")) {
          const normalizedTipDate = normalizeDate(tip.matchTime);
          const normalizedSelectedDate = normalizeDate(date);

          const isMatch = normalizedTipDate === normalizedSelectedDate;

          return isMatch;
        }

        // Se for uma string simples, tentar extrair a data
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todayNormalized = normalizeDate(today.toISOString());
        const tomorrowNormalized = normalizeDate(tomorrow.toISOString());
        const selectedDateNormalized = normalizeDate(date);

        if (tip.matchTime && tip.matchTime.toLowerCase().includes("hoje")) {
          const isMatch = todayNormalized === selectedDateNormalized;

          return isMatch;
        }

        if (tip.matchTime && tip.matchTime.toLowerCase().includes("amanhã")) {
          const isMatch = tomorrowNormalized === selectedDateNormalized;

          return isMatch;
        }

        // Se não conseguir determinar, incluir o palpite

        return true;
      } catch (error) {
        console.error("❌ Erro ao processar data do palpite:", error);
        // Em caso de erro, incluir o palpite
        return true;
      }
    });

    return filteredTips;
  },

  // Buscar palpites por data de criação
  async getTipsByCreatedDate(date: string): Promise<Tip[]> {
    // Buscar todos os palpites e filtrar por data de criação no cliente
    const q = query(
      collection(db, TIPS_COLLECTION),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    const allTips = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Tip[];

    // Filtrar por data de criação no cliente
    const filteredTips = allTips.filter((tip) => {
      try {
        if (tip.createdAt) {
          const normalizedCreatedDate = normalizeDate(
            tip.createdAt.toISOString()
          );
          const normalizedSelectedDate = normalizeDate(date);

          const isMatch = normalizedCreatedDate === normalizedSelectedDate;

          return isMatch;
        }

        return true;
      } catch (error) {
        console.error(
          "❌ Erro ao processar data de criação do palpite:",
          error
        );
        return true;
      }
    });

    return filteredTips;
  },

  // Atualizar status do palpite
  async updateTipStatus(
    tipId: string,
    status: "active" | "inactive" | "completed"
  ): Promise<void> {
    const tipRef = doc(db, TIPS_COLLECTION, tipId);
    await updateDoc(tipRef, {
      status,
      updatedAt: Timestamp.now(),
    });
  },

  // Atualizar resultado do palpite
  async updateTipResult(
    tipId: string,
    result: "win" | "loss" | "pending"
  ): Promise<void> {
    const tipRef = doc(db, TIPS_COLLECTION, tipId);
    await updateDoc(tipRef, {
      result,
      updatedAt: Timestamp.now(),
    });
  },
};
