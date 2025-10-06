import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/lib/firebase";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";

export async function POST(request: NextRequest) {
  try {
    const { pixKeyId, status = 'completed' } = await request.json();

    // Validar dados obrigatórios
    if (!pixKeyId) {
      return NextResponse.json(
        { error: "pixKeyId é obrigatório" },
        { status: 400 }
      );
    }

    // Buscar transação pelo pixKeyId
    const transactionsRef = collection(db, 'transactions');
    const q = query(transactionsRef, where('pixKeyId', '==', pixKeyId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: "Transação não encontrada" },
        { status: 404 }
      );
    }

    // Atualizar todas as transações encontradas (normalmente será apenas uma)
    const updatePromises = querySnapshot.docs.map(async (docSnapshot) => {
      const transactionRef = doc(db, 'transactions', docSnapshot.id);
      await updateDoc(transactionRef, {
        status: status,
        updatedAt: new Date(),
      });
      return {
        id: docSnapshot.id,
        data: docSnapshot.data()
      };
    });

    const updatedTransactions = await Promise.all(updatePromises);

    console.log(`Status atualizado para ${updatedTransactions.length} transação(ões) com pixKeyId: ${pixKeyId}`);

    return NextResponse.json({
      success: true,
      message: `Status atualizado para ${updatedTransactions.length} transação(ões)`,
      pixKeyId: pixKeyId,
      newStatus: status,
      updatedTransactions: updatedTransactions.length
    });

  } catch (error) {
    console.error("Erro ao atualizar status da transação:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor", details: error },
      { status: 500 }
    );
  }
}

// Rota GET para consultar status de uma transação
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pixKeyId = searchParams.get('pixKeyId');

    if (!pixKeyId) {
      return NextResponse.json(
        { error: "pixKeyId é obrigatório" },
        { status: 400 }
      );
    }

    // Buscar transação pelo pixKeyId
    const transactionsRef = collection(db, 'transactions');
    const q = query(transactionsRef, where('pixKeyId', '==', pixKeyId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: "Transação não encontrada" },
        { status: 404 }
      );
    }

    // Retornar dados da transação
    const transactions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({
      success: true,
      pixKeyId: pixKeyId,
      transactions: transactions
    });

  } catch (error) {
    console.error("Erro ao buscar transação:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor", details: error },
      { status: 500 }
    );
  }
}
