# Exemplos de Uso das APIs

## 1. Atualizar Status de Transação PIX

### POST `/api/asaas/pix/update-status`

Atualiza o status de uma transação PIX baseado no `pixKeyId`.

**Request:**
```json
{
  "pixKeyId": "5277056600000529272922ASA",
  "status": "completed"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Status atualizado para 1 transação(ões)",
  "pixKeyId": "5277056600000529272922ASA",
  "newStatus": "completed",
  "updatedTransactions": 1
}
```

### GET `/api/asaas/pix/update-status?pixKeyId=5277056600000529272922ASA`

Consulta o status de uma transação PIX.

**Response:**
```json
{
  "success": true,
  "pixKeyId": "5277056600000529272922ASA",
  "transactions": [
    {
      "id": "transaction_doc_id",
      "userId": "user123",
      "planId": "single",
      "planName": "Palpite Unico",
      "planPrice": 49.90,
      "status": "pending",
      "pixKeyId": "5277056600000529272922ASA",
      "createdAt": "2025-01-15T14:30:00Z"
    }
  ]
}
```

## 2. Webhook do Asaas

### POST `/api/asaas/webhook`

Endpoint para receber notificações automáticas do Asaas quando um pagamento PIX é confirmado.

**Webhook do Asaas:**
```json
{
  "event": "PAYMENT_RECEIVED",
  "payment": {
    "id": "pay_123456789",
    "pixTransaction": {
      "id": "5277056600000529272922ASA"
    },
    "status": "RECEIVED",
    "value": 49.90
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Webhook processado com sucesso",
  "pixKeyId": "5277056600000529272922ASA",
  "updatedTransactions": 1,
  "transactionIds": ["transaction_doc_id"]
}
```

## 3. Exemplos de Uso no Frontend

### Atualizar Status Manualmente
```typescript
const updatePixStatus = async (pixKeyId: string) => {
  try {
    const response = await fetch('/api/asaas/pix/update-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pixKeyId: pixKeyId,
        status: 'completed'
      }),
    });

    const data = await response.json();
    console.log('Status atualizado:', data);
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
  }
};
```

### Consultar Status de Transação
```typescript
const checkPixStatus = async (pixKeyId: string) => {
  try {
    const response = await fetch(`/api/asaas/pix/update-status?pixKeyId=${pixKeyId}`);
    const data = await response.json();
    
    if (data.success && data.transactions.length > 0) {
      const transaction = data.transactions[0];
      console.log('Status atual:', transaction.status);
      return transaction.status;
    }
  } catch (error) {
    console.error('Erro ao consultar status:', error);
  }
};
```

## 4. Configuração do Webhook no Asaas

Para receber notificações automáticas, configure o webhook no painel do Asaas:

1. Acesse o painel do Asaas
2. Vá em Configurações > Webhooks
3. Adicione a URL: `https://seudominio.com/api/asaas/webhook`
4. Selecione os eventos: `PAYMENT_RECEIVED`, `PAYMENT_CONFIRMED`
5. Salve as configurações

## 5. Estados de Transação

- `pending`: Aguardando pagamento
- `processing`: Processando pagamento
- `completed`: Pagamento confirmado
- `failed`: Pagamento falhou
- `expired`: PIX expirado
