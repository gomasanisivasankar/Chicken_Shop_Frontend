import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = '/api/auth';

// Safely parse JSON — avoids crash when backend is down or returns non-JSON
async function safeJson(res) {
    const text = await res.text();
    try {
        return JSON.parse(text);
    } catch {
        return { message: text || `Server error (${res.status})` };
    }
}

// Thunks
export const loginUser = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await safeJson(res);
        if (!res.ok) throw new Error(data.message || 'Login failed');
        localStorage.setItem('token', data.token);
        return data;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

export const signupUser = createAsyncThunk('auth/signup', async ({ name, email, password, phone }, { rejectWithValue }) => {
    try {
        const res = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, phone })
        });
        const data = await safeJson(res);
        if (!res.ok) throw new Error(data.message || 'Signup failed');
        localStorage.setItem('token', data.token);
        return data;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

export const fetchCurrentUser = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token');
        const res = await fetch(`${API_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await safeJson(res);
        if (!res.ok) throw new Error(data.message || 'Auth failed');
        return data;
    } catch (err) {
        localStorage.removeItem('token');
        return rejectWithValue(err.message);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: localStorage.getItem('token') || null,
        loading: false,
        error: null,
    },
    reducers: {
        logout(state) {
            state.user = null;
            state.token = null;
            state.error = null;
            localStorage.removeItem('token');
        },
        clearAuthError(state) {
            state.error = null;
        },
        setTokenFromOAuth(state, action) {
            state.token = action.payload;
            localStorage.setItem('token', action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.token = action.payload.token;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Signup
            .addCase(signupUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.token = action.payload.token;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch current user
            .addCase(fetchCurrentUser.pending, (state) => { state.loading = true; })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(fetchCurrentUser.rejected, (state) => {
                state.loading = false;
                state.user = null;
                state.token = null;
            });
    }
});

export const { logout, clearAuthError, setTokenFromOAuth } = authSlice.actions;
export default authSlice.reducer;
