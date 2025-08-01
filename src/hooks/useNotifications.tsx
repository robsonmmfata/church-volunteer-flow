
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  from?: string;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user) return;

    // Carregar notificações do localStorage
    const loadNotifications = () => {
      // Primeiro, tentar carregar usando ID do usuário
      let saved = localStorage.getItem(`notifications_${user.id}`);
      
      // Se não encontrar, tentar usando nome do usuário
      if (!saved) {
        const chaveNome = `notifications_${user.nome.toLowerCase().replace(/\s+/g, '_')}`;
        saved = localStorage.getItem(chaveNome);
      }
      
      if (saved) {
        const parsed = JSON.parse(saved);
        const notificacoesFormatadas = parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
        setNotifications(notificacoesFormatadas);
      }
    };

    loadNotifications();

    // Listener para notificações broadcast em tempo real
    const handleBroadcastNotification = (event: CustomEvent) => {
      const notification = event.detail;
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString() + Math.random(),
        timestamp: new Date(),
        read: false
      };
      
      setNotifications(prev => {
        const updated = [newNotification, ...prev];
        // Salvar usando ambas as chaves para garantia
        localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updated));
        const chaveNome = `notifications_${user.nome.toLowerCase().replace(/\s+/g, '_')}`;
        localStorage.setItem(chaveNome, JSON.stringify(updated));
        return updated;
      });
    };

    // Adicionar listener para broadcast
    window.addEventListener('broadcastNotification', handleBroadcastNotification as EventListener);

    // Verificar por novas notificações a cada 3 segundos
    const interval = setInterval(loadNotifications, 3000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('broadcastNotification', handleBroadcastNotification as EventListener);
    };
  }, [user]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };

    const updated = [newNotification, ...notifications];
    setNotifications(updated);

    if (user) {
      // Salvar usando ID e nome do usuário para máxima compatibilidade
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updated));
      const chaveNome = `notifications_${user.nome.toLowerCase().replace(/\s+/g, '_')}`;
      localStorage.setItem(chaveNome, JSON.stringify(updated));
    }
  };

  const markAsRead = (id: string) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);

    if (user) {
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updated));
      const chaveNome = `notifications_${user.nome.toLowerCase().replace(/\s+/g, '_')}`;
      localStorage.setItem(chaveNome, JSON.stringify(updated));
    }
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);

    if (user) {
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updated));
      const chaveNome = `notifications_${user.nome.toLowerCase().replace(/\s+/g, '_')}`;
      localStorage.setItem(chaveNome, JSON.stringify(updated));
    }
  };

  const deleteNotification = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);

    if (user) {
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updated));
      const chaveNome = `notifications_${user.nome.toLowerCase().replace(/\s+/g, '_')}`;
      localStorage.setItem(chaveNome, JSON.stringify(updated));
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };
};
