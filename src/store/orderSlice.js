import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = import.meta.env.VITE_API_URL || '';
const API_URL = `${BASE_URL}/api/orders`;

async function safeJson(res) {
    const text = await res.text();
    try { return JSON.parse(text); } catch { return { message: text || `Server error (${res.status})` }; }
}

export const createOrder = createAsyncThunk('orders/create', async (orderData, { getState, rejectWithValue }) => {
    try {
        const token = getState().auth.token;
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await fetch(API_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify(orderData)
        });
        const data = await safeJson(res);
        if (!res.ok) throw new Error(data.message || 'Order failed');
        return data;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

export const fetchOrders = createAsyncThunk('orders/fetchAll', async (_, { getState, rejectWithValue }) => {
    try {
        const token = getState().auth.token;
        const res = await fetch(API_URL, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await safeJson(res);
        if (!res.ok) throw new Error(data.message || 'Failed to load orders');
        return data;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

export const fetchOrderById = createAsyncThunk('orders/fetchById', async (id, { getState, rejectWithValue }) => {
    try {
        const token = getState().auth.token;
        const res = await fetch(`${API_URL}/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await safeJson(res);
        if (!res.ok) throw new Error(data.message || 'Order not found');
        return data;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

export const fetchOrderStats = createAsyncThunk('orders/fetchStats', async (_, { getState, rejectWithValue }) => {
    try {
        const token = getState().auth.token;
        const res = await fetch(`${API_URL}/stats`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await safeJson(res);
        if (!res.ok) throw new Error(data.message || 'Failed to load stats');
        return data;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

export const updateOrderStatus = createAsyncThunk('orders/updateStatus', async ({ id, status }, { getState, rejectWithValue }) => {
    try {
        const token = getState().auth.token;
        const res = await fetch(`${API_URL}/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ status })
        });
        const data = await safeJson(res);
        if (!res.ok) throw new Error(data.message || 'Failed to update status');
        return data;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

export const cancelOrder = createAsyncThunk('orders/cancel', async (id, { getState, rejectWithValue }) => {
    try {
        const token = getState().auth.token;
        const res = await fetch(`${API_URL}/${id}/cancel`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await safeJson(res);
        if (!res.ok) throw new Error(data.message || 'Failed to cancel order');
        return data;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        items: [],
        stats: null,
        currentOrder: null,
        trackingOrder: null,
        loading: false,
        error: null,
    },
    reducers: {
        setCurrentOrder(state, action) {
            state.currentOrder = action.payload;
        },
        clearOrderError(state) {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.currentOrder = action.payload;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchOrders.pending, (state) => { state.loading = true; })
            .addCase(fetchOrders.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
            .addCase(fetchOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(fetchOrderById.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchOrderById.fulfilled, (state, action) => { state.loading = false; state.trackingOrder = action.payload; })
            .addCase(fetchOrderById.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(fetchOrderStats.fulfilled, (state, action) => { state.stats = action.payload; })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                const idx = state.items.findIndex(o => o._id === action.payload._id);
                if (idx !== -1) state.items[idx] = action.payload;
                if (state.trackingOrder?._id === action.payload._id) state.trackingOrder = action.payload;
            })
            .addCase(cancelOrder.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(cancelOrder.fulfilled, (state, action) => {
                state.loading = false;
                const idx = state.items.findIndex(o => o._id === action.payload._id);
                if (idx !== -1) state.items[idx] = action.payload;
                if (state.trackingOrder?._id === action.payload._id) state.trackingOrder = action.payload;
            })
            .addCase(cancelOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
    }
});

export const { setCurrentOrder, clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;
