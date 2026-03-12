import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LocalNotification {
  id: string;
  orderId: string;
  title: string;
  message: string;
  type: 'order_status' | 'loyalty';
  status: 'unread' | 'read';
  createdAt: string;
}

export interface UserProfile {
  id: string;
  email?: string;
  name?: string;
  avatar_url?: string;
}

interface UserStore {
  // Fidelity Card
  stamps: number;
  coupons: number;
  addStamp: () => void;
  redeemCoupon: () => void;
  resetFidelity: () => void;

  // Notifications
  notifications: LocalNotification[];
  addNotification: (notification: Omit<LocalNotification, 'id' | 'createdAt' | 'status'>) => void;
  markAsRead: (id: string) => void;
  clearNotifications: () => void;

  // Orders
  activeOrderIds: string[];
  addActiveOrder: (id: string) => void;
  removeActiveOrder: (id: string) => void;

  // Auth (Optional)
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      stamps: 0,
      coupons: 0,
      notifications: [],
      activeOrderIds: [],
      user: null,

      addStamp: () => {
        const currentStamps = get().stamps + 1;
        if (currentStamps >= 10) {
          set({ 
            stamps: 0, 
            coupons: get().coupons + 1 
          });
          get().addNotification({
            orderId: 'loyalty',
            title: '¡Felicidades!',
            message: 'Has completado tu tarjeta. ¡Tienes un regalo esperándote!',
            type: 'loyalty'
          });
        } else {
          set({ stamps: currentStamps });
        }
      },

      redeemCoupon: () => {
        const currentCoupons = get().coupons;
        if (currentCoupons > 0) {
          set({ coupons: currentCoupons - 1 });
        }
      },

      resetFidelity: () => set({ stamps: 0, coupons: 0 }),

      addNotification: (notification) => {
        const newNotification: LocalNotification = {
          ...notification,
          id: Math.random().toString(36).substring(2, 9),
          createdAt: new Date().toISOString(),
          status: 'unread',
        };
        set({ notifications: [newNotification, ...get().notifications].slice(0, 50) }); // Limit to 50
      },

      markAsRead: (id) => {
        set({
          notifications: get().notifications.map(n => 
            n.id === id ? { ...n, status: 'read' } : n
          )
        });
      },

      clearNotifications: () => set({ notifications: [] }),

      addActiveOrder: (id) => {
        if (!get().activeOrderIds.includes(id)) {
          set({ activeOrderIds: [...get().activeOrderIds, id] });
        }
      },

      removeActiveOrder: (id) => {
        set({ activeOrderIds: get().activeOrderIds.filter(oid => oid !== id) });
      },

      setUser: (user) => set({ user }),
    }),
    {
      name: 'mi-vaquita-user',
    }
  )
);
