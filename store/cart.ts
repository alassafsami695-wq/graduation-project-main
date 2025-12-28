import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Course } from '@/types/course.types';

export interface CartState {
    items: Course[];
    isOpen: boolean;
    addItem: (item: Course) => void;
    removeItem: (itemId: number) => void;
    clearCart: () => void;
    toggleCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    total: number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            total: 0,

            addItem: (item: Course) => {
                const currentItems = get().items;
                const exists = currentItems.find((i) => i.id === item.id);

                if (exists) {
                    // Option: toast notification here? For now just ignore
                    return;
                }

                const updatedItems = [...currentItems, item];
                set({
                    items: updatedItems,
                    total: calculateTotal(updatedItems)
                });
            },

            removeItem: (itemId: number) => {
                const updatedItems = get().items.filter((item) => item.id !== itemId);
                set({
                    items: updatedItems,
                    total: calculateTotal(updatedItems)
                });
            },

            clearCart: () => set({ items: [], total: 0 }),

            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ items: state.items, total: state.total }), // Only persist items and total
        }
    )
);

// Helper to calculate total price
const calculateTotal = (items: Course[]) => {
    return items.reduce((total, item) => {
        // Handle price as string or number
        let price = 0;
        if (typeof item.price === 'string') {
            const numericString = item.price.replace(/[^0-9.]/g, '');
            price = parseFloat(numericString) || 0;
        } else {
            price = item.price || 0;
        }
        return total + price;
    }, 0);
};
