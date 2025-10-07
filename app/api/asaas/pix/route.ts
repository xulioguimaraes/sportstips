import { NextRequest, NextResponse } from "next/server";

const ASAAS_API_URL =
  process.env.NEXT_PUBLIC_ASAAS_API_URL || "https://api.asaas.com/v3";
const ASAAS_API_KEY = process.env.NEXT_PUBLIC_ASAAS_API_KEY;

export async function POST(request: NextRequest) {
  try {
    console.log(request.json());
    const { value, description, addressKey } = await request.json();

    // Validar dados obrigatórios
    if (!value || !description || !addressKey) {
      return NextResponse.json(
        { error: "Dados obrigatórios não fornecidos" },
        { status: 400 }
      );
    }

    // Calcular data de expiração (2 horas a partir de agora)
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 2);

    // Formatar data no formato esperado pelo Asaas (YYYY-MM-DD HH:mm:ss)
    const formattedExpirationDate = expirationDate
      .toISOString()
      .replace("T", " ")
      .replace(/\.\d{3}Z$/, "");
    console.log(ASAAS_API_KEY);
    // Fazer requisição para o Asaas
    const response = await fetch(`${ASAAS_API_URL}/pix/qrCodes/static`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access_token: ASAAS_API_KEY!,
      },
      body: JSON.stringify({
        value: value,
        description: description,
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

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro na API route:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor", errors: error },
      { status: 500 }
    );
  }
}
