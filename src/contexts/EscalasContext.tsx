
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Escala {
  id: number;
  data: string;
  culto: string;
  lider: string;
  voluntarios: string[];
  status: string;
}

interface EscalasContextType {
  escalas: Escala[];
  addEscala: (escala: Omit<Escala, 'id' | 'status'>) => void;
  updateEscala: (id: number, escala: Partial<Escala>) => void;
  deleteEscala: (id: number) => void;
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
      status: "Completa"
    },
    {
      id: 2,
      data: "2024-01-07",
      culto: "Domingo 19h30",
      lider: "Ana Santos",
      voluntarios: ["João Silva", "Carlos Oliveira", "Maria Silva", "Pedro Costa"],
      status: "Incompleta"
    },
    {
      id: 3,
      data: "2024-01-10",
      culto: "Quarta 20h (Culto da Fé)",
      lider: "Carlos Oliveira",
      voluntarios: ["Ana Santos", "Maria Silva", "Pedro Costa", "Lucia Oliveira", "João Silva"],
      status: "Completa"
    }
  ]);

  const addEscala = (escalaData: Omit<Escala, 'id' | 'status'>) => {
    const newEscala: Escala = {
      ...escalaData,
      id: Math.max(...escalas.map(e => e.id)) + 1,
      status: escalaData.voluntarios.length === 5 ? "Completa" : "Incompleta"
    };
    setEscalas(prev => [...prev, newEscala]);
  };

  const updateEscala = (id: number, escalaData: Partial<Escala>) => {
    setEscalas(prev => prev.map(escala => 
      escala.id === id ? { ...escala, ...escalaData } : escala
    ));
  };

  const deleteEscala = (id: number) => {
    setEscalas(prev => prev.filter(escala => escala.id !== id));
  };

  return (
    <EscalasContext.Provider value={{ escalas, addEscala, updateEscala, deleteEscala }}>
      {children}
    </EscalasContext.Provider>
  );
};
