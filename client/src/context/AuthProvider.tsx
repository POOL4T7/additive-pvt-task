// src/context/AuthContext.tsx
import {
  ReactNode,
  useState,
  useEffect,
  useContext,
  createContext,
} from 'react';
import axios from '@/axios';

// Define the User type
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  status: 'active' | 'inactive' | 'blocked';
  bio: string;
  profile: string;
}

// Define the AuthContext type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  console.log('auth context called');
  // Function to fetch user data from API
  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await axios.get('/user/get-profile');

        setUser(res.data?.data?.profile);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setIsAuthenticated(false);
        setUser(null);
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  // Fetch user data on mount
  useEffect(() => {
    fetchUserData();
  }, []);

  // Function to handle login
  const login = (token: string) => {
    localStorage.setItem('token', token);
    fetchUserData(); // Refresh user data after login
  };

  // Function to handle logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Provide context value
  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
