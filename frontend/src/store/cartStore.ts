import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types';

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (producto_id: string) => void;
  updateCantidad: (producto_id: string, cantidad: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const items = get().items;
        const existingItem = items.find(i => i.producto_id === item.producto_id);
        
        if (existingItem) {
          set({
            items: items.map(i => 
              i.producto_id === item.producto_id
                ? { ...i, cantidad: i.cantidad + item.cantidad }
                : i
            )
          });
        } else {
          set({ items: [...items, item] });
        }
      },
      
      removeItem: (producto_id) => {
        set({
          items: get().items.filter(i => i.producto_id !== producto_id)
        });
      },
      
      updateCantidad: (producto_id, cantidad) => {
        if (cantidad <= 0) {
          get().removeItem(producto_id);
          return;
        }
        
        set({
          items: get().items.map(i =>
            i.producto_id === producto_id
              ? { ...i, cantidad }
              : i
          )
        });
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotal: () => {
        return get().items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
      },
      
      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.cantidad, 0);
      }
    }),
    {
      name: 'mi-vaquita-cart',
    }
  )
);
