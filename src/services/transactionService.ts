import { db } from '@/src/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export interface TransactionData {
  userId: string;
  planId: string;
  planName: string;
  planPrice: number;
  planType: 'package' | 'subscription';
  paymentMethod: 'pix' | 'card';
  pixKeyId?: string;
  pixKey?: string;
  pixQrCode?: string;
  pixPayload?: string;
  pixExpirationDate?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  asaasPaymentId?: string;
  createdAt: any;
  updatedAt: any;
}

// Função para salvar transação no Firestore
export const saveTransaction = async (transactionData: Omit<TransactionData, 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'transactions'), {
      ...transactionData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    console.log('Transação salva com ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao salvar transação:', error);
    throw error;
  }
};

// Função para atualizar status da transação por ID
export const updateTransactionStatus = async (transactionId: string, status: TransactionData['status']): Promise<void> => {
  try {
    const { doc, updateDoc } = await import('firebase/firestore');
    const transactionRef = doc(db, 'transactions', transactionId);
    
    await updateDoc(transactionRef, {
      status,
      updatedAt: serverTimestamp(),
    });
    
    console.log('Status da transação atualizado:', status);
  } catch (error) {
    console.error('Erro ao atualizar status da transação:', error);
    throw error;
  }
};

// Função para atualizar status da transação por pixKeyId
export const updateTransactionStatusByPixKeyId = async (pixKeyId: string, status: TransactionData['status']): Promise<string[]> => {
  try {
    const { query, where, getDocs, updateDoc, doc } = await import('firebase/firestore');
    const transactionsRef = collection(db, 'transactions');
    const q = query(transactionsRef, where('pixKeyId', '==', pixKeyId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error('Transação não encontrada');
    }

    const updatePromises = querySnapshot.docs.map(async (docSnapshot) => {
      const transactionRef = doc(db, 'transactions', docSnapshot.id);
      await updateDoc(transactionRef, {
        status,
        updatedAt: serverTimestamp(),
      });
      return docSnapshot.id;
    });

    const updatedIds = await Promise.all(updatePromises);
    console.log(`Status atualizado para ${updatedIds.length} transação(ões) com pixKeyId: ${pixKeyId}`);
    
    return updatedIds;
  } catch (error) {
    console.error('Erro ao atualizar status da transação por pixKeyId:', error);
    throw error;
  }
};

// Função para buscar transação por pixKeyId
export const getTransactionByPixKeyId = async (pixKeyId: string): Promise<TransactionData[]> => {
  try {
    const { query, where, getDocs } = await import('firebase/firestore');
    const transactionsRef = collection(db, 'transactions');
    const q = query(transactionsRef, where('pixKeyId', '==', pixKeyId));
    const querySnapshot = await getDocs(q);

    const transactions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as (TransactionData & { id: string })[];

    return transactions;
  } catch (error) {
    console.error('Erro ao buscar transação por pixKeyId:', error);
    throw error;
  }
};
