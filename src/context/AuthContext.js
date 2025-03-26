import { createContext } from 'react';

// Create auth context with default values
const AuthContext = createContext({
  user: null,
  loading: true,
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
  register: async () => null,
  verifyEmail: async () => false,
  setUser: () => {}
});

export default AuthContext; 