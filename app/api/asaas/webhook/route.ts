import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  getDoc,
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

      // Atualizar status da transação e processar pacotes
      const updatePromises = querySnapshot.docs.map(async (docSnapshot) => {
        const transactionData = docSnapshot.data();
        const transactionRef = doc(db, "transactions", docSnapshot.id);
        
        // Atualizar status da transação
        await updateDoc(transactionRef, {
          status: webhookData.event,
          updatedAt: new Date(),
          asaasPaymentId: webhookData.payment?.id,
          paymentConfirmedAt: new Date(),
          payment: webhookData.payment,
        });

        // Buscar informações do plano
        const planId = transactionData.planId;
        const userId = transactionData.userId; // email do usuário

        if (!planId || !userId) {
          console.error("planId ou userId não encontrado na transação");
          return { transactionId: docSnapshot.id, userUpdated: false };
        }

        try {
          // Buscar o plano no Firestore
          const planRef = doc(db, "plans", planId);
          const planSnap = await getDoc(planRef);

          if (!planSnap.exists()) {
            console.error(`Plano não encontrado: ${planId}`);
            return { transactionId: docSnapshot.id, userUpdated: false };
          }

          const planData = planSnap.data();

          // Verificar se é um pacote (package)
          if (planData.type === "package") {
            // Buscar usuário pelo email
            const usersRef = collection(db, "users");
            const userQuery = query(usersRef, where("email", "==", userId));
            const userSnapshot = await getDocs(userQuery);

            if (userSnapshot.empty) {
              console.error(`Usuário não encontrado: ${userId}`);
              return { transactionId: docSnapshot.id, userUpdated: false };
            }

            // Atualizar informações do usuário com o pacote
            const userUpdatePromises = userSnapshot.docs.map(async (userDoc) => {
              const userRef = doc(db, "users", userDoc.id);
              const currentUserData = userDoc.data();

              // Preparar dados do pacote para adicionar ao usuário
              const packageInfo = {
                id: planId,
                name: planData.name,
                tipsIncluded: planData.tipsIncluded,
                tipsRemaining: planData.tipsIncluded, // Inicialmente todos os tips disponíveis
                purchasedAt: new Date(),
                transactionId: docSnapshot.id,
              };

              // Adicionar ou atualizar pacote no array de pacotes do usuário
              const currentPackages = currentUserData.packages || [];
              const updatedPackages = [...currentPackages, packageInfo];

              await updateDoc(userRef, {
                packages: updatedPackages,
                updatedAt: new Date(),
              });

              console.log(
                `Pacote adicionado ao usuário ${userId}: ${planData.name}`
              );

              return userDoc.id;
            });

            await Promise.all(userUpdatePromises);
            return { transactionId: docSnapshot.id, userUpdated: true };
          } else if (planData.type === "subscription") {
            // TODO: Implementar lógica de assinatura
            console.log(
              `Assinatura detectada para o plano ${planId}. Implementação pendente.`
            );
            return { transactionId: docSnapshot.id, userUpdated: false };
          }
        } catch (error) {
          console.error("Erro ao processar plano/usuário:", error);
          return { transactionId: docSnapshot.id, userUpdated: false };
        }

        return { transactionId: docSnapshot.id, userUpdated: false };
      });

      const updateResults = await Promise.all(updatePromises);

      console.log(
        `Pagamento confirmado para ${updateResults.length} transação(ões) com pixKeyId: ${pixKeyId}`
      );

      return NextResponse.json({
        success: true,
        message: "Webhook processado com sucesso",
        pixKeyId: pixKeyId,
        updatedTransactions: updateResults.length,
        results: updateResults,
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
