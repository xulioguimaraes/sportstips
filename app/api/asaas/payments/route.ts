import { NextRequest, NextResponse } from 'next/server';

const ASAAS_API_URL = process.env.ASAAS_API_URL || 'https://api.asaas.com/v3';
const ASAAS_API_KEY = process.env.ASAAS_API_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const paymentData = await request.json();

    // Validar dados obrigatórios
    if (!paymentData.customer || !paymentData.value || !paymentData.billingType) {
      return NextResponse.json(
        { error: 'Dados obrigatórios não fornecidos (customer, value, billingType)' },
        { status: 400 }
      );
    }

    // Fazer requisição para o Asaas
    const response = await fetch(`${ASAAS_API_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_API_KEY,
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Erro na API do Asaas:', errorData);
      return NextResponse.json(
        { error: 'Erro ao criar pagamento no Asaas' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro na API route:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('id');

    if (!paymentId) {
      return NextResponse.json(
        { error: 'ID do pagamento é obrigatório' },
        { status: 400 }
      );
    }

    // Fazer requisição para o Asaas
    const response = await fetch(`${ASAAS_API_URL}/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'access_token': ASAAS_API_KEY,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Erro na API do Asaas:', errorData);
      return NextResponse.json(
        { error: 'Erro ao buscar pagamento no Asaas' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro na API route:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
