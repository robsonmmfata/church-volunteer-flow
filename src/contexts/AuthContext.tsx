
import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserType = 'voluntario' | 'administrador' | 'lider';

export interface User {
  id: string;
  nome: string;
  email: string;
  tipo: UserType;
  celular?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, tipo: UserType) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

interface RegisterData {
  nome: string;
  email: string;
  password: string;
  tipo: UserType;
  celular?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, tipo: UserType): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulação de login (em produção, seria uma chamada para API)
    // Usuários de exemplo
    const mockUsers = [
      { id: '1', nome: 'Admin Sistema', email: 'admin@igreja.com', tipo: 'administrador' as UserType },
      { id: '2', nome: 'João Líder', email: 'joao@igreja.com', tipo: 'lider' as UserType, celular: '11999999999' },
      { id: '3', nome: 'Maria Voluntária', email: 'maria@igreja.com', tipo: 'voluntario' as UserType, celular: '11888888888' },
    ];

    const foundUser = mockUsers.find(u => u.email === email && u.tipo === tipo);
    
    if (foundUser && password === '123456') {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulação de registro (em produção, seria uma chamada para API)
    const newUser: User = {
      id: Date.now().toString(),
      nome: userData.nome,
      email: userData.email,
      tipo: userData.tipo,
      celular: userData.celular,
    };

    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};
