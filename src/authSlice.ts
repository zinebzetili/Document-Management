// authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  user: { email: string; name: string } | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ email: string; name: string }>) {
      state.isAuthenticated = true;
      state.user = { email: action.payload.email, name: action.payload.name };
      localStorage.setItem('isAuthenticated', 'true'); // Persist login state
      localStorage.setItem('user', JSON.stringify(action.payload)); // Persist user data
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('isAuthenticated'); // Clear login state
      localStorage.removeItem('user'); // Clear user data
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;