import { NextRequest, NextResponse } from "next/server";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";

const ASAAS_API_URL =
  process.env.NEXT_PUBLIC_ASAAS_API_URL || "https://api.asaas.com/v3";
const ASAAS_API_KEY = process.env.NEXT_PUBLIC_ASAAS_API_KEY;

// Inicializar Firebase Admin no lado do servidor
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Inicializar Firebase apenas se não estiver inicializado
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export async function POST(request: NextRequest) {
  try {
    const addressKey = "00e90a64-45d4-46e4-b109-23f52be1897f";

    const { planId, userId } = await request.json();

    // Validar dados obrigatórios
    if (!planId || !userId) {
      return NextResponse.json(
        { error: "planId e userId são obrigatórios" },
        { status: 400 }
      );
    }

    // Buscar informações do plano no Firestore
    const planRef = doc(db, "plans", planId);
    const planSnap = await getDoc(planRef);

    if (!planSnap.exists()) {
      return NextResponse.json(
        { error: "Plano não encontrado" },
        { status: 404 }
      );
    }

    const planData = planSnap.data();
    const planValue = planData.price / 100; // Converter centavos para reais
    const planDescription = planData.name || "Plano SportsTips";

    // Calcular data de expiração (2 horas a partir de agora)
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 2);

    // Formatar data no formato esperado pelo Asaas (YYYY-MM-DD HH:mm:ss)
    const formattedExpirationDate = expirationDate
      .toISOString()
      .replace("T", " ")
      .replace(/\.\d{3}Z$/, "");

    // Fazer requisição para o Asaas
    const response = await fetch(`${ASAAS_API_URL}/pix/qrCodes/static`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access_token: ASAAS_API_KEY!,
      },
      body: JSON.stringify({
        value: 0.01,
        description: planDescription,
        format: "ALL",
        expirationDate: formattedExpirationDate,
        addressKey: addressKey,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Erro na API do Asaas:", errorData);
      return NextResponse.json(
        { error: "Erro ao criar PIX no Asaas" },
        { status: response.status }
      );
    }

    const pixData = await response.json();

    // Salvar transação no Firestore
    const transactionRef = await addDoc(collection(db, "transactions"), {
      userId: userId,
      planId: planId,
      planName: planData.name,
      planPrice: planData.price,
      planType: planData.type,
      paymentMethod: "pix",
      pixKeyId: pixData.id,
      pixKey: addressKey,
      pixQrCode: pixData.encodedImage,
      pixPayload: pixData.payload,
      pixExpirationDate: pixData.expirationDate,
      status: "pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Retornar dados do PIX junto com o ID da transação
    return NextResponse.json({
      ...pixData,
      transactionId: transactionRef.id,
    });
  } catch (error) {
    console.error("Erro na API route:", error);
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
