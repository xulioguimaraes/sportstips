// Serviço para integração com a API do Asaas
// Documentação: https://docs.asaas.com/

// Nota: As variáveis ASAAS_API_URL e ASAAS_API_KEY não são mais necessárias aqui
// pois todas as chamadas para a API do Asaas agora são feitas através das API routes do Next.js

interface AsaasCustomer {
  name: string;
  email: string;
  cpfCnpj: string;
  phone?: string;
}

interface AsaasPayment {
  customer: string;
  billingType: "PIX" | "CREDIT_CARD";
  value: number;
  dueDate: string;
  description: string;
  externalReference?: string;
}

interface AsaasSubscription {
  customer: string;
  billingType: "CREDIT_CARD";
  value: number;
  nextDueDate: string;
  cycle:
    | "WEEKLY"
    | "BIWEEKLY"
    | "MONTHLY"
    | "QUARTERLY"
    | "SEMIANNUALLY"
    | "YEARLY";
  description: string;
  externalReference?: string;
}

interface AsaasResponse {
  id: string;
  status: string;
  pixTransaction?: {
    qrCode: string;
    payload: string;
  };
  pixQrCodeId?: string;
  pixCopiaECola?: string;
}

// Função para criar cliente no Asaas
export const createCustomer = async (
  customerData: AsaasCustomer
): Promise<string> => {
  try {
    const response = await fetch('/api/asaas/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Erro ao criar cliente: ${response.statusText}`);
    }

    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error("Erro ao criar cliente no Asaas:", error);
    throw error;
  }
};

// Função para criar pagamento PIX
export const createPixPayment = async (
  paymentData: AsaasPayment
): Promise<AsaasResponse> => {
  try {
    const response = await fetch('/api/asaas/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...paymentData,
        billingType: "PIX",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Erro ao criar pagamento PIX: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao criar pagamento PIX:", error);
    throw error;
  }
};

// Função para criar assinatura
export const createSubscription = async (
  subscriptionData: AsaasSubscription
): Promise<AsaasResponse> => {
  try {
    const response = await fetch('/api/asaas/subscriptions', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscriptionData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Erro ao criar assinatura: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao criar assinatura:", error);
    throw error;
  }
};

// Função para obter QR Code PIX
export const getPixQrCode = async (
  paymentId: string
): Promise<{ qrCode: string; payload: string }> => {
  try {
    const response = await fetch(`/api/asaas/payments/${paymentId}/pixQrCode`, {
      method: "GET",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Erro ao obter QR Code PIX: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      qrCode: data.encodedImage,
      payload: data.payload,
    };
  } catch (error) {
    console.error("Erro ao obter QR Code PIX:", error);
    throw error;
  }
};

// Função para verificar status do pagamento
export const getPaymentStatus = async (
  paymentId: string
): Promise<{ status: string }> => {
  try {
    const response = await fetch(`/api/asaas/payments?id=${paymentId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Erro ao verificar status do pagamento: ${response.statusText}`);
    }

    const data = await response.json();
    return { status: data.status };
  } catch (error) {
    console.error("Erro ao verificar status do pagamento:", error);
    throw error;
  }
};

// Função para processar pagamento com cartão (simulação)
export const processCardPayment = async (paymentData: {
  customerId: string;
  value: number;
  description: string;
  cardToken: string;
}): Promise<AsaasResponse> => {
  try {
    // Esta função seria implementada com a integração real do cartão
    // Por enquanto, simulamos o processo
    const response = await fetch('/api/asaas/payments', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer: paymentData.customerId,
        billingType: "CREDIT_CARD",
        value: paymentData.value,
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0], // 1 dia
        description: paymentData.description,
        creditCard: {
          token: paymentData.cardToken,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `Erro ao processar pagamento com cartão: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao processar pagamento com cartão:", error);
    throw error;
  }
};

// Função para criar chave PIX EVP (Endereço Virtual de Pagamento)
export const createPixEVPKey = async (
  value: number,
  description: string,
  addressKey: string
): Promise<{
  id: string;
  encodedImage: string;
  payload: string;
  allowsMultiplePayments: boolean;
  expirationDate: string;
  externalReference: string | null;
  description: string;
}> => {
  try {
    // Usar API route do Next.js para evitar problemas de CORS
    const response = await fetch('/api/asaas/pix', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        value: value,
        description: description,
        addressKey: addressKey,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Erro ao criar chave PIX EVP: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao criar chave PIX EVP:", error);
    throw error;
  }
};

// Função para criar chave PIX (se necessário)
export const createPixKey = async (
  customerId: string,
  keyType: "CPF" | "CNPJ" | "EMAIL" | "PHONE" | "RANDOM"
): Promise<{ id: string; key: string }> => {
  try {
    const response = await fetch(`/api/asaas/customers/${customerId}/pixKeys`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: keyType,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Erro ao criar chave PIX: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      id: data.id,
      key: data.key,
    };
  } catch (error) {
    console.error("Erro ao criar chave PIX:", error);
    throw error;
  }
};
