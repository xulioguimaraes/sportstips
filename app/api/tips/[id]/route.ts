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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tipId = params.id;
    const searchParams = request.nextUrl.searchParams;
    const userEmail = searchParams.get("email");

    // Validação dos parâmetros
    if (!tipId) {
      return NextResponse.json(
        { error: "ID do tip é obrigatório" },
        { status: 400 }
      );
    }

    if (!userEmail) {
      return NextResponse.json(
        { error: "Email do usuário é obrigatório" },
        { status: 400 }
      );
    }

    // Buscar o tip no Firestore
    const tipRef = doc(db, "tips", tipId);
    const tipSnap = await getDoc(tipRef);

    if (!tipSnap.exists()) {
      return NextResponse.json(
        { error: "Tip não encontrado" },
        { status: 404 }
      );
    }

    const tipData = {
      id: tipSnap.id,
      ...tipSnap.data(),
    } as any;

    // Se o tip não for premium, retornar direto
    if (!tipData.isPremium) {
      return NextResponse.json({
        success: true,
        tip: tipData,
        hasAccess: true,
        reason: "free",
      });
    }

    // Se for premium, validar acesso do usuário
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
    const purchasedTips = userData.purchasedTips || [];

    // Verificar se o usuário comprou este tip
    const hasAccess = purchasedTips.includes(tipId);

    if (!hasAccess) {
      return NextResponse.json(
        {
          error: "Acesso negado",
          message: "Você não tem acesso a este tip premium",
          hasAccess: false,
        },
        { status: 403 }
      );
    }

    // Usuário tem acesso, retornar tip completo
    return NextResponse.json({
      success: true,
      tip: tipData,
      hasAccess: true,
      reason: "purchased",
    });
  } catch (error) {
    console.error("Erro ao buscar tip:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
