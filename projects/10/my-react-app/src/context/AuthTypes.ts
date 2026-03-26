export interface User {
  name: string;
  email: string;
}

export interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}