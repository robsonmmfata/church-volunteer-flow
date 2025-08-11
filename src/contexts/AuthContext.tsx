
import React, { createContext, useContext, useState, useEffect } from 'react';
import { emailService } from '@/services/emailService';

export type UserType = 'voluntario' | 'administrador' | 'lider';

export interface User {
  id: string;
  nome: string;
  email: string;
  tipo: UserType;
  telefone?: string;
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
  telefone?: string;
}

// Local storage helpers for demo-only auth with email verification
type StoredUser = User & { password: string; verified: boolean };

const getStoredUsers = (): StoredUser[] => {
  try { return JSON.parse(localStorage.getItem('users') || '[]'); } catch { return []; }
};
const setStoredUsers = (users: StoredUser[]) => localStorage.setItem('users', JSON.stringify(users));

const saveVerificationToken = (email: string, token: string) => {
  const map = JSON.parse(localStorage.getItem('verificationTokens') || '{}');
  map[email] = token;
  localStorage.setItem('verificationTokens', JSON.stringify(map));
  const link = `${window.location.origin}/verificar-email?token=${token}&email=${encodeURIComponent(email)}`;
  localStorage.setItem('lastVerificationLink', JSON.stringify({ email, link }));
};
const getVerificationToken = (email: string) => {
  const map = JSON.parse(localStorage.getItem('verificationTokens') || '{}');
  return map[email];
};
const clearVerificationToken = (email: string) => {
  const map = JSON.parse(localStorage.getItem('verificationTokens') || '{}');
  delete map[email];
  localStorage.setItem('verificationTokens', JSON.stringify(map));
};

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
    
    // Usuários de exemplo (sempre verificados)
    const mockUsers = [
      { id: '1', nome: 'Admin Sistema', email: 'admin@igreja.com', tipo: 'administrador' as UserType, telefone: '11999999999' },
      { id: '2', nome: 'João Líder', email: 'joao@igreja.com', tipo: 'lider' as UserType, telefone: '11999999999' },
      { id: '3', nome: 'Maria Voluntária', email: 'maria@igreja.com', tipo: 'voluntario' as UserType, telefone: '11888888888' },
    ];

    // Primeiro, tentar usuários cadastrados localmente
    const storedUsers = getStoredUsers();
    const localUser = storedUsers.find(u => u.email === email && u.tipo === tipo);
    if (localUser && localUser.password === password) {
      if (!localUser.verified) {
        setIsLoading(false);
        return false; // não permite login sem verificação
      }
      const { password: _pwd, ...publicUser } = localUser as any;
      setUser(publicUser);
      localStorage.setItem('currentUser', JSON.stringify(publicUser));
      setIsLoading(false);
      return true;
    }

    // Fallback: usuários de exemplo
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
    try {
      const users = getStoredUsers();
      if (users.some(u => u.email === userData.email)) {
        setIsLoading(false);
        return false; // email já cadastrado
      }

      const newUser: StoredUser = {
        id: Date.now().toString(),
        nome: userData.nome,
        email: userData.email,
        tipo: userData.tipo,
        telefone: userData.telefone,
        password: userData.password,
        verified: false,
      };

      users.push(newUser);
      setStoredUsers(users);

      // Gera token e envia email de verificação
      const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
      saveVerificationToken(userData.email, token);
      const link = `${window.location.origin}/verificar-email?token=${token}&email=${encodeURIComponent(userData.email)}`;

      try {
        await emailService.enviarEmail({
          to: userData.email,
          subject: 'Confirme seu cadastro - Sistema de Voluntários',
          html: `<h2>Confirmação de Cadastro</h2>
                 <p>Olá ${userData.nome},</p>
                 <p>Para concluir seu cadastro, clique no link abaixo:</p>
                 <p><a href="${link}">Confirmar cadastro</a></p>
                 <p>Se você não solicitou este cadastro, ignore este email.</p>`,
        } as any);
      } catch (e) {
        // Ignorar erro de envio (ambiente sem backend). Link fica salvo localmente.
      }

      setIsLoading(false);
      return true;
    } catch {
      setIsLoading(false);
      return false;
    }
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
