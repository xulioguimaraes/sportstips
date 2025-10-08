import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
  addDoc,
} from "firebase/firestore";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, tipId } = body;

    // Validação dos dados
    if (!userId || !tipId) {
      return NextResponse.json(
        { error: "userId e tipId são obrigatórios" },
        { status: 400 }
      );
    }

    // Buscar usuário pelo email
    const usersRef = collection(db, "users");
    const userQuery = query(usersRef, where("email", "==", userId));
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();
    const userRef = doc(db, "users", userDoc.id);

    // Verificar se o usuário tem pacotes
    const packages = userData.packages || [];
    if (packages.length === 0) {
      return NextResponse.json(
        { error: "Usuário não possui pacotes ativos" },
        { status: 400 }
      );
    }

    // Encontrar o primeiro pacote com tips disponíveis
    const availablePackageIndex = packages.findIndex(
      (pkg: any) => pkg.tipsRemaining > 0
    );

    if (availablePackageIndex === -1) {
      return NextResponse.json(
        { error: "Nenhum pacote com tips disponíveis" },
        { status: 400 }
      );
    }

    // Verificar se o tip já foi comprado
    const purchasedTips = userData.purchasedTips || [];
    if (purchasedTips.includes(tipId)) {
      return NextResponse.json(
        { error: "Este tip já foi comprado anteriormente" },
        { status: 400 }
      );
    }

    // Atualizar o pacote (decrementar tipsRemaining)
    const updatedPackages = [...packages];
    updatedPackages[availablePackageIndex] = {
      ...updatedPackages[availablePackageIndex],
      tipsRemaining: updatedPackages[availablePackageIndex].tipsRemaining - 1,
      lastUsedAt: new Date(),
    };

    // Criar registro na coleção de tips comprados
    const purchaseRecord = {
      userId: userId,
      tipId: tipId,
      purchasedAt: new Date(),
      packageId: updatedPackages[availablePackageIndex].id,
      packageName: updatedPackages[availablePackageIndex].name,
      transactionId: updatedPackages[availablePackageIndex].transactionId,
    };

    const purchaseRef = await addDoc(
      collection(db, "tipsPurchases"),
      purchaseRecord
    );

    // Atualizar usuário no Firestore
    await updateDoc(userRef, {
      packages: updatedPackages,
      purchasedTips: arrayUnion(tipId),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Tip comprado com sucesso!",
        purchaseId: purchaseRef.id,
        packageUsed: {
          id: updatedPackages[availablePackageIndex].id,
          name: updatedPackages[availablePackageIndex].name,
          tipsRemaining: updatedPackages[availablePackageIndex].tipsRemaining,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao processar compra do tip:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
