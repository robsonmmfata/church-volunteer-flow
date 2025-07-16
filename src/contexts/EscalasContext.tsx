
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Voluntario {
  id: string;
  nome: string;
  telefone?: string;
  tipo: 'voluntario' | 'lider';
  confirmado?: boolean;
}

export interface Escala {
  id: string;
  data: string;
  culto: string;
  tipo: string;
  lider: string;
  voluntarios: Voluntario[];
  status: 'Ativa' | 'Completa' | 'Incompleta';
  local?: string;
  criadoPor?: string;
  modificadoPor?: string;
}

export interface EscalasContextType {
  escalas: Escala[];
  voluntarios: Voluntario[];
  adicionarEscala: (escala: Omit<Escala, 'id' | 'status'>) => void;
  addEscala: (escala: Omit<Escala, 'id' | 'status'>) => void;
  editarEscala: (id: string, escala: Partial<Escala>) => void;
  updateEscala: (id: string, escala: Partial<Escala>, userType?: string) => void;
  excluirEscala: (id: string) => void;
  deleteEscala: (id: string, userType?: string) => void;
  atualizarEscala: (escala: Escala) => void;
  confirmarPresenca: (escalaId: string, voluntarioId: string) => void;
  adicionarVoluntario: (voluntario: Omit<Voluntario, 'id'>) => void;
  editarVoluntario: (id: string, voluntario: Partial<Voluntario>) => void;
  excluirVoluntario: (id: string) => void;
}

const EscalasContext = createContext<EscalasContextType | undefined>(undefined);

export const useEscalas = () => {
  const context = useContext(EscalasContext);
  if (!context) {
    throw new Error('useEscalas deve ser usado dentro de um EscalasProvider');
  }
  return context;
};

export const EscalasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [escalas, setEscalas] = useState<Escala[]>([
    {
      id: '1',
      data: '2025-01-26',
      culto: 'Domingo 10h',
      tipo: 'Culto Dominical',
      lider: 'João Silva',
      local: 'Templo Principal',
      voluntarios: [
        { id: '1', nome: 'Maria Santos', telefone: '5511999999999', tipo: 'voluntario', confirmado: true },
        { id: '2', nome: 'Pedro Lima', telefone: '5511888888888', tipo: 'voluntario', confirmado: false }
      ],
      status: 'Ativa',
      criadoPor: 'admin'
    },
    {
      id: '2',
      data: '2025-01-29',
      culto: 'Quarta 20h',
      tipo: 'Culto de Oração',
      lider: 'Ana Costa',
      local: 'Salão de Eventos',
      voluntarios: [
        { id: '3', nome: 'Carlos Oliveira', telefone: '5511777777777', tipo: 'voluntario', confirmado: true }
      ],
      status: 'Incompleta',
      criadoPor: 'admin'
    }
  ]);

  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([
    { id: '1', nome: 'Maria Santos', telefone: '5511999999999', tipo: 'voluntario' },
    { id: '2', nome: 'Pedro Lima', telefone: '5511888888888', tipo: 'voluntario' },
    { id: '3', nome: 'Carlos Oliveira', telefone: '5511777777777', tipo: 'voluntario' },
    { id: '4', nome: 'João Silva', telefone: '5511666666666', tipo: 'lider' },
    { id: '5', nome: 'Ana Costa', telefone: '5511555555555', tipo: 'lider' }
  ]);

  const adicionarEscala = (novaEscala: Omit<Escala, 'id' | 'status'>) => {
    const escala: Escala = {
      ...novaEscala,
      id: Date.now().toString(),
      status: novaEscala.voluntarios.length >= 5 ? 'Ativa' : 'Incompleta',
      criadoPor: 'admin'
    };
    setEscalas(prev => [...prev, escala]);
  };

  const addEscala = adicionarEscala;

  const editarEscala = (id: string, dadosEscala: Partial<Escala>) => {
    setEscalas(prev => prev.map(escala => 
      escala.id === id ? { ...escala, ...dadosEscala, modificadoPor: 'admin' } : escala
    ));
  };

  const updateEscala = (id: string, dadosEscala: Partial<Escala>, userType: string = 'admin') => {
    setEscalas(prev => prev.map(escala => 
      escala.id === id ? { ...escala, ...dadosEscala, modificadoPor: userType } : escala
    ));
  };

  const excluirEscala = (id: string) => {
    setEscalas(prev => prev.filter(escala => escala.id !== id));
  };

  const deleteEscala = (id: string, userType: string = 'admin') => {
    setEscalas(prev => prev.filter(escala => escala.id !== id));
  };

  const atualizarEscala = (escalaAtualizada: Escala) => {
    setEscalas(prev => prev.map(escala => 
      escala.id === escalaAtualizada.id ? { ...escalaAtualizada, modificadoPor: 'admin' } : escala
    ));
  };

  const confirmarPresenca = (escalaId: string, voluntarioId: string) => {
    setEscalas(prev => prev.map(escala => {
      if (escala.id === escalaId) {
        return {
          ...escala,
          voluntarios: escala.voluntarios.map(vol => 
            vol.id === voluntarioId ? { ...vol, confirmado: true } : vol
          )
        };
      }
      return escala;
    }));
  };

  const adicionarVoluntario = (novoVoluntario: Omit<Voluntario, 'id'>) => {
    const voluntario: Voluntario = {
      ...novoVoluntario,
      id: Date.now().toString()
    };
    setVoluntarios(prev => [...prev, voluntario]);
  };

  const editarVoluntario = (id: string, dadosVoluntario: Partial<Voluntario>) => {
    setVoluntarios(prev => prev.map(vol => 
      vol.id === id ? { ...vol, ...dadosVoluntario } : vol
    ));
  };

  const excluirVoluntario = (id: string) => {
    setVoluntarios(prev => prev.filter(vol => vol.id !== id));
  };

  const value: EscalasContextType = {
    escalas,
    voluntarios,
    adicionarEscala,
    addEscala,
    editarEscala,
    updateEscala,
    excluirEscala,
    deleteEscala,
    atualizarEscala,
    confirmarPresenca,
    adicionarVoluntario,
    editarVoluntario,
    excluirVoluntario
  };

  return (
    <EscalasContext.Provider value={value}>
      {children}
    </EscalasContext.Provider>
  );
};
