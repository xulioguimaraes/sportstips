import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userEmail = searchParams.get("email");

    if (!userEmail) {
      return NextResponse.json(
        { error: "Email do usuário é obrigatório" },
        { status: 400 }
      );
    }

    // Buscar usuário pelo email
    const usersRef = collection(db, "users");
    const userQuery = query(usersRef, where("email", "==", userEmail));
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const userData = userSnapshot.docs[0].data();
    const purchasedTipIds = userData.purchasedTips || [];

    // Se não tiver tips comprados, retornar array vazio
    if (purchasedTipIds.length === 0) {
      return NextResponse.json({
        success: true,
        tips: [],
      });
    }

    // Buscar registros de compras de tips na coleção tipsPurchases
    const tipsPurchasesRef = collection(db, "tipsPurchases");
    const purchasesQuery = query(
      tipsPurchasesRef,
      where("userId", "==", userEmail)
    );
    const purchasesSnapshot = await getDocs(purchasesQuery);

    // Criar mapa de compras por tipId
    const purchasesMap = new Map();
    purchasesSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      purchasesMap.set(data.tipId, {
        purchasedAt: data.purchasedAt?.toDate?.() || new Date(),
        packageId: data.packageId,
        packageName: data.packageName,
        transactionId: data.transactionId,
      });
    });

    // Buscar transações para obter preços
    const transactionsRef = collection(db, "transactions");
    const transactionsQuery = query(
      transactionsRef,
      where("userId", "==", userEmail),
      where("status", "==", "PAYMENT_RECEIVED")
    );
    const transactionsSnapshot = await getDocs(transactionsQuery);

    // Criar mapa de transações por ID
    const transactionsMap = new Map();
    transactionsSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      transactionsMap.set(doc.id, {
        price: data.planPrice || 0,
        planName: data.planName || "",
      });
    });

    // Buscar todos os tips comprados
    const tipsPromises = purchasedTipIds.map(async (tipId: string) => {
      try {
        const tipRef = doc(db, "tips", tipId);
        const tipSnap = await getDoc(tipRef);

        if (tipSnap.exists()) {
          const tipData = tipSnap.data();
          
          // Buscar informações da compra
          const purchaseInfo = purchasesMap.get(tipId);
          
          if (!purchaseInfo) {
            console.warn(`Informações de compra não encontradas para tip ${tipId}`);
            return null;
          }

          // Buscar informações da transação
          const transactionInfo = purchaseInfo.transactionId
            ? transactionsMap.get(purchaseInfo.transactionId)
            : null;

          return {
            id: tipSnap.id,
            ...tipData,
            purchasedAt: purchaseInfo.purchasedAt.toISOString(),
            price: transactionInfo?.price || 0,
            planName: purchaseInfo.packageName || transactionInfo?.planName || "Pacote",
            packageId: purchaseInfo.packageId,
          };
        }
        return null;
      } catch (error) {
        console.error(`Erro ao buscar tip ${tipId}:`, error);
        return null;
      }
    });

    const tips = (await Promise.all(tipsPromises)).filter(
      (tip) => tip !== null
    );

    // Ordenar por data de compra (mais recente primeiro)
    tips.sort((a: any, b: any) => {
      const dateA = new Date(a.purchasedAt).getTime();
      const dateB = new Date(b.purchasedAt).getTime();
      return dateB - dateA;
    });

    return NextResponse.json({
      success: true,
      tips,
      total: tips.length,
    });
  } catch (error) {
    console.error("Erro ao buscar tips comprados:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
