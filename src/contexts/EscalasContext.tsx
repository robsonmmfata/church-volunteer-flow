
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from "sonner";

interface Escala {
  id: number;
  data: string;
  culto: string;
  lider: string;
  voluntarios: string[];
  status: string;
  criadoPor?: string;
  modificadoPor?: string;
  ultimaModificacao?: string;
}

interface EscalasContextType {
  escalas: Escala[];
  addEscala: (escala: Omit<Escala, 'id' | 'status'>, criadoPor?: string) => void;
  updateEscala: (id: number, escala: Partial<Escala>, modificadoPor?: string) => void;
  deleteEscala: (id: number, deletadoPor?: string) => void;
  notificarAlteracao: (tipo: string, detalhes: string, targetUsers?: string[]) => void;
}

const EscalasContext = createContext<EscalasContextType | undefined>(undefined);

export const useEscalas = () => {
  const context = useContext(EscalasContext);
  if (!context) {
    throw new Error('useEscalas must be used within an EscalasProvider');
  }
  return context;
};

export const EscalasProvider = ({ children }: { children: ReactNode }) => {
  const [escalas, setEscalas] = useState<Escala[]>([
    {
      id: 1,
      data: "2024-01-07",
      culto: "Domingo 10h",
      lider: "João Silva",
      voluntarios: ["Ana Santos", "Carlos Oliveira", "Maria Silva", "Pedro Costa", "Lucia Oliveira"],
      status: "Completa",
      criadoPor: "admin",
      ultimaModificacao: new Date().toISOString()
    },
    {
      id: 2,
      data: "2024-01-07",
      culto: "Domingo 19h30",
      lider: "Ana Santos",
      voluntarios: ["João Silva", "Carlos Oliveira", "Maria Silva", "Pedro Costa"],
      status: "Incompleta",
      criadoPor: "admin",
      ultimaModificacao: new Date().toISOString()
    },
    {
      id: 3,
      data: "2024-01-10",
      culto: "Quarta 20h (Culto da Fé)",
      lider: "Carlos Oliveira",
      voluntarios: ["Ana Santos", "Maria Silva", "Pedro Costa", "Lucia Oliveira", "João Silva"],
      status: "Completa",
      criadoPor: "lider",
      ultimaModificacao: new Date().toISOString()
    }
  ]);

  const notificarAlteracao = (tipo: string, detalhes: string, targetUsers?: string[]) => {
    // Simular notificação em tempo real
    setTimeout(() => {
      toast.success(`${tipo}: ${detalhes}`, {
        duration: 5000,
      });
      console.log(`Notificação enviada para: ${targetUsers?.join(', ') || 'todos'}`);
    }, 1000);
  };

  const addEscala = (escalaData: Omit<Escala, 'id' | 'status'>, criadoPor = 'admin') => {
    const newEscala: Escala = {
      ...escalaData,
      id: Math.max(...escalas.map(e => e.id)) + 1,
      status: escalaData.voluntarios.length === 5 ? "Completa" : "Incompleta",
      criadoPor,
      ultimaModificacao: new Date().toISOString()
    };
    
    setEscalas(prev => [...prev, newEscala]);
    
    // Notificar baseado em quem criou
    if (criadoPor === 'admin') {
      notificarAlteracao(
        "Nova Escala Criada", 
        `Escala para ${newEscala.culto} em ${new Date(newEscala.data).toLocaleDateString('pt-BR')}`,
        ['lideres', 'voluntarios']
      );
    } else if (criadoPor === 'lider') {
      notificarAlteracao(
        "Nova Escala do Líder", 
        `Escala para ${newEscala.culto} em ${new Date(newEscala.data).toLocaleDateString('pt-BR')}`,
        ['voluntarios']
      );
    }
  };

  const updateEscala = (id: number, escalaData: Partial<Escala>, modificadoPor = 'admin') => {
    const escalaAnterior = escalas.find(e => e.id === id);
    
    setEscalas(prev => prev.map(escala => 
      escala.id === id ? { 
        ...escala, 
        ...escalaData,
        modificadoPor,
        ultimaModificacao: new Date().toISOString()
      } : escala
    ));

    if (escalaAnterior) {
      // Notificar baseado em quem modificou
      if (modificadoPor === 'admin') {
        notificarAlteracao(
          "Escala Atualizada pelo Admin", 
          `Escala ${escalaAnterior.culto} foi modificada`,
          ['lideres', 'voluntarios']
        );
      } else if (modificadoPor === 'lider') {
        notificarAlteracao(
          "Escala Atualizada pelo Líder", 
          `Escala ${escalaAnterior.culto} foi modificada`,
          ['voluntarios']
        );
      }
    }
  };

  const deleteEscala = (id: number, deletadoPor = 'admin') => {
    const escalaParaDeletar = escalas.find(e => e.id === id);
    
    setEscalas(prev => prev.filter(escala => escala.id !== id));
    
    if (escalaParaDeletar) {
      // Notificar baseado em quem deletou
      if (deletadoPor === 'admin') {
        notificarAlteracao(
          "Escala Removida pelo Admin", 
          `Escala ${escalaParaDeletar.culto} foi removida`,
          ['lideres', 'voluntarios']
        );
      } else if (deletadoPor === 'lider') {
        notificarAlteracao(
          "Escala Removida pelo Líder", 
          `Escala ${escalaParaDeletar.culto} foi removida`,
          ['voluntarios']
        );
      }
    }
  };

  return (
    <EscalasContext.Provider value={{ 
      escalas, 
      addEscala, 
      updateEscala, 
      deleteEscala, 
      notificarAlteracao 
    }}>
      {children}
    </EscalasContext.Provider>
  );
};
