import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

// Rename and export the login action as reduxLogin
export const { login: reduxLogin, logout } = authSlice.actions;

// Also keep the original name for backward compatibility
export const { login, logout: reduxLogout } = authSlice.actions;

export default authSlice.reducer;
