import { NextRequest, NextResponse } from 'next/server';

const ASAAS_API_URL = process.env.ASAAS_API_URL || 'https://api.asaas.com/v3';
const ASAAS_API_KEY = process.env.ASAAS_API_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const customerData = await request.json();

    // Validar dados obrigatórios
    if (!customerData.name || !customerData.email || !customerData.cpfCnpj) {
      return NextResponse.json(
        { error: 'Dados obrigatórios não fornecidos (name, email, cpfCnpj)' },
        { status: 400 }
      );
    }

    // Fazer requisição para o Asaas
    const response = await fetch(`${ASAAS_API_URL}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_API_KEY,
      },
      body: JSON.stringify(customerData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Erro na API do Asaas:', errorData);
      return NextResponse.json(
        { error: 'Erro ao criar cliente no Asaas' },
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
