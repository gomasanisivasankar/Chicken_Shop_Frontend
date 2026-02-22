import { createSlice } from '@reduxjs/toolkit';

const loadCart = () => {
    try {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
};

const saveCart = (items) => {
    localStorage.setItem('cart', JSON.stringify(items));
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: loadCart(),
        toast: null,
    },
    reducers: {
        addToCart(state, action) {
            const { product, quantity = 0.5 } = action.payload;
            const existing = state.items.find(i => i._id === product._id);
            if (existing) {
                existing.quantity = Math.round((existing.quantity + quantity) * 100) / 100;
            } else {
                state.items.push({ ...product, quantity });
            }
            saveCart(state.items);
            state.toast = { message: `${product.name} added to cart!`, type: 'success' };
        },
        removeFromCart(state, action) {
            state.items = state.items.filter(i => i._id !== action.payload);
            saveCart(state.items);
        },
        updateQuantity(state, action) {
            const { productId, quantity } = action.payload;
            if (quantity <= 0) {
                state.items = state.items.filter(i => i._id !== productId);
            } else {
                const item = state.items.find(i => i._id === productId);
                if (item) {
                    item.quantity = Math.round(quantity * 100) / 100;
                }
            }
            saveCart(state.items);
        },
        clearCart(state) {
            state.items = [];
            saveCart(state.items);
        },
        clearToast(state) {
            state.toast = null;
        }
    }
});

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) =>
    state.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
export const selectCartCount = (state) => state.cart.items.length;
export const selectCartToast = (state) => state.cart.toast;

export const { addToCart, removeFromCart, updateQuantity, clearCart, clearToast } = cartSlice.actions;
export default cartSlice.reducer;
