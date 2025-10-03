import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc,
  setDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { User, Subscription } from '@/src/types';

const USERS_COLLECTION = 'users';

export const userService = {
  // Criar um novo usuário
  async createUser(userData: {
    uid: string;
    email: string;
    displayName?: string;
  }): Promise<void> {
    const userRef = doc(db, USERS_COLLECTION, userData.uid);
    
    // Criar assinatura gratuita padrão
    const freeSubscription: Subscription = {
      id: `sub_${userData.uid}_${Date.now()}`,
      type: 'free',
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 ano
      autoRenew: false,
    };

    const newUser: User = {
      uid: userData.uid,
      email: userData.email,
      displayName: userData.displayName,
      role: 'user',
      subscription: freeSubscription,
      freeTipsUsed: 0,
      freeTipsLimit: 5, // 5 palpites gratuitos por dia
      createdAt: new Date(),
    };

    await setDoc(userRef, {
      ...newUser,
      createdAt: Timestamp.now(),
      subscription: {
        ...freeSubscription,
        startDate: Timestamp.now(),
        endDate: Timestamp.fromDate(freeSubscription.endDate),
      },
    });
  },

  // Buscar usuário por ID
  async getUserById(uid: string): Promise<User | null> {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate(),
        subscription: data.subscription ? {
          ...data.subscription,
          startDate: data.subscription.startDate?.toDate(),
          endDate: data.subscription.endDate?.toDate(),
        } : undefined,
      } as User;
    }
    
    return null;
  },

  // Atualizar informações do usuário
  async updateUser(uid: string, userData: Partial<User>): Promise<void> {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const updateData: any = { ...userData };
    
    // Converter datas para Timestamp se necessário
    if (updateData.subscription) {
      updateData.subscription = {
        ...updateData.subscription,
        startDate: Timestamp.fromDate(updateData.subscription.startDate),
        endDate: Timestamp.fromDate(updateData.subscription.endDate),
      };
    }
    
    await updateDoc(userRef, updateData);
  },

  // Atualizar assinatura do usuário
  async updateUserSubscription(uid: string, subscription: Subscription): Promise<void> {
    const userRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(userRef, {
      subscription: {
        ...subscription,
        startDate: Timestamp.fromDate(subscription.startDate),
        endDate: Timestamp.fromDate(subscription.endDate),
      },
    });
  },

  // Incrementar contador de palpites gratuitos usados
  async incrementFreeTipsUsed(uid: string): Promise<void> {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const currentUsed = userSnap.data().freeTipsUsed || 0;
      await updateDoc(userRef, {
        freeTipsUsed: currentUsed + 1,
      });
    }
  },

  // Resetar contador de palpites gratuitos (diário)
  async resetFreeTipsUsed(uid: string): Promise<void> {
    const userRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(userRef, {
      freeTipsUsed: 0,
    });
  },

  // Verificar se usuário pode usar palpites gratuitos
  async canUseFreeTips(uid: string): Promise<boolean> {
    const user = await this.getUserById(uid);
    if (!user) return false;
    
    // Se tem assinatura ativa, pode usar palpites ilimitados
    if (user.subscription && user.subscription.status === 'active' && user.subscription.type !== 'free') {
      return true;
    }
    
    // Se é usuário gratuito, verificar limite
    const used = user.freeTipsUsed || 0;
    const limit = user.freeTipsLimit || 5;
    
    return used < limit;
  },
};

