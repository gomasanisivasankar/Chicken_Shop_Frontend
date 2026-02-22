import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = import.meta.env.VITE_API_URL || '';
const API_URL = `${BASE_URL}/api/products`;

async function safeJson(res) {
    const text = await res.text();
    try { return JSON.parse(text); } catch { return { message: text || `Server error (${res.status})` }; }
}

export const fetchProducts = createAsyncThunk('products/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const res = await fetch(API_URL);
        const data = await safeJson(res);
        if (!res.ok) throw new Error(data.message);
        return data;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

export const fetchAllProductsAdmin = createAsyncThunk('products/fetchAllAdmin', async (_, { getState, rejectWithValue }) => {
    try {
        const token = getState().auth.token;
        const res = await fetch(`${API_URL}/all`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await safeJson(res);
        if (!res.ok) throw new Error(data.message);
        return data;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

export const createProduct = createAsyncThunk('products/create', async (productData, { getState, rejectWithValue }) => {
    try {
        const token = getState().auth.token;
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(productData)
        });
        const data = await safeJson(res);
        if (!res.ok) throw new Error(data.message);
        return data;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

export const updateProduct = createAsyncThunk('products/update', async ({ id, ...productData }, { getState, rejectWithValue }) => {
    try {
        const token = getState().auth.token;
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(productData)
        });
        const data = await safeJson(res);
        if (!res.ok) throw new Error(data.message);
        return data;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

export const deleteProduct = createAsyncThunk('products/delete', async (id, { getState, rejectWithValue }) => {
    try {
        const token = getState().auth.token;
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await safeJson(res);
        if (!res.ok) throw new Error(data.message || 'Delete failed');
        return id;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

const productSlice = createSlice({
    name: 'products',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchProducts.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
            .addCase(fetchProducts.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(fetchAllProductsAdmin.pending, (state) => { state.loading = true; })
            .addCase(fetchAllProductsAdmin.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
            .addCase(fetchAllProductsAdmin.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(createProduct.fulfilled, (state, action) => { state.items.push(action.payload); })
            .addCase(updateProduct.fulfilled, (state, action) => {
                const idx = state.items.findIndex(p => p._id === action.payload._id);
                if (idx !== -1) state.items[idx] = action.payload;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.items = state.items.filter(p => p._id !== action.payload);
            });
    }
});

export default productSlice.reducer;
