import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

export async function POST(request: NextRequest) {
  try {
    const webhookData = await request.json();

    // Verificar se é um evento de pagamento PIX
    if (
      webhookData.event === "PAYMENT_RECEIVED" ||
      webhookData.event === "PAYMENT_CONFIRMED"
    ) {
      const pixKeyId = webhookData?.payment?.pixQrCodeId;

      if (!pixKeyId) {
        console.error("pixKeyId não encontrado no webhook");
        return NextResponse.json(
          { error: "pixKeyId não encontrado" },
          { status: 400 }
        );
      }

      // Buscar transação pelo pixKeyId
      const transactionsRef = collection(db, "transactions");
      const q = query(transactionsRef, where("pixKeyId", "==", pixKeyId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.error(`Transação não encontrada para pixKeyId: ${pixKeyId}`);
        return NextResponse.json(
          { error: "Transação não encontrada" },
          { status: 404 }
        );
      }

      // Atualizar status da transação para completed
      const updatePromises = querySnapshot.docs.map(async (docSnapshot) => {
        const transactionRef = doc(db, "transactions", docSnapshot.id);
        await updateDoc(transactionRef, {
          status: webhookData.event,
          updatedAt: new Date(),
          asaasPaymentId: webhookData.payment?.id,
          paymentConfirmedAt: new Date(),
          payment: webhookData.payment,
        });
        return docSnapshot.id;
      });

      const updatedTransactionIds = await Promise.all(updatePromises);

      console.log(
        `Pagamento confirmado para ${updatedTransactionIds.length} transação(ões) com pixKeyId: ${pixKeyId}`
      );

      return NextResponse.json({
        success: true,
        message: "Webhook processado com sucesso",
        pixKeyId: pixKeyId,
        updatedTransactions: updatedTransactionIds.length,
        transactionIds: updatedTransactionIds,
      });
    }

    // Para outros tipos de eventos, apenas log
    console.log(`Evento não processado: ${webhookData.event}`);
    return NextResponse.json({
      success: true,
      message: "Webhook recebido mas não processado",
      event: webhookData.event,
    });
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor", details: error },
      { status: 500 }
    );
  }
}

// Rota GET para testar se o webhook está funcionando
export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Webhook endpoint está funcionando",
    timestamp: new Date().toISOString(),
  });
}
