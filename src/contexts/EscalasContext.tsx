
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from "sonner";

interface Voluntario {
  id: string;
  nome: string;
  telefone?: string;
  confirmado?: boolean;
  tipo: 'lider' | 'voluntario';
}

interface Escala {
  id: string;
  data: string;
  tipo: string;
  culto: string;
  lider: string;
  voluntarios: Voluntario[];
  status: string;
  local?: string;
  criadoPor?: string;
  modificadoPor?: string;
  ultimaModificacao?: string;
}

interface EscalasContextType {
  escalas: Escala[];
  voluntarios: Voluntario[];
  addEscala: (escala: Omit<Escala, 'id' | 'status'>, criadoPor?: string) => void;
  updateEscala: (id: string, escala: Partial<Escala>, modificadoPor?: string) => void;
  atualizarEscala: (escala: Escala) => Promise<void>;
  deleteEscala: (id: string, deletadoPor?: string) => void;
  confirmarPresenca: (escalaId: string, voluntarioId: string) => Promise<void>;
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
  const [voluntarios] = useState<Voluntario[]>([
    { id: '1', nome: 'João Silva', telefone: '5511999999999', tipo: 'lider' },
    { id: '2', nome: 'Ana Santos', telefone: '5511888888888', tipo: 'lider' },
    { id: '3', nome: 'Carlos Oliveira', telefone: '5511777777777', tipo: 'voluntario' },
    { id: '4', nome: 'Maria Silva', telefone: '5511666666666', tipo: 'voluntario' },
    { id: '5', nome: 'Pedro Costa', telefone: '5511555555555', tipo: 'voluntario' },
    { id: '6', nome: 'Lucia Oliveira', telefone: '5511444444444', tipo: 'voluntario' },
  ]);

  const [escalas, setEscalas] = useState<Escala[]>([
    {
      id: '1',
      data: "2024-01-07",
      tipo: "Domingo Manhã",
      culto: "Domingo 10h",
      lider: "João Silva",
      voluntarios: [
        { id: '2', nome: 'Ana Santos', telefone: '5511888888888', tipo: 'voluntario', confirmado: true },
        { id: '3', nome: 'Carlos Oliveira', telefone: '5511777777777', tipo: 'voluntario', confirmado: false },
        { id: '4', nome: 'Maria Silva', telefone: '5511666666666', tipo: 'voluntario', confirmado: true },
      ],
      status: "agendada",
      local: "Templo Principal",
      criadoPor: "admin",
      ultimaModificacao: new Date().toISOString()
    },
    {
      id: '2',
      data: "2024-01-07",
      tipo: "Domingo Noite",
      culto: "Domingo 19h30",
      lider: "Ana Santos",
      voluntarios: [
        { id: '1', nome: 'João Silva', telefone: '5511999999999', tipo: 'voluntario', confirmado: true },
        { id: '3', nome: 'Carlos Oliveira', telefone: '5511777777777', tipo: 'voluntario', confirmado: false },
        { id: '5', nome: 'Pedro Costa', telefone: '5511555555555', tipo: 'voluntario', confirmado: true },
      ],
      status: "agendada",
      local: "Templo Principal",
      criadoPor: "admin",
      ultimaModificacao: new Date().toISOString()
    }
  ]);

  const notificarAlteracao = (tipo: string, detalhes: string, targetUsers?: string[]) => {
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
      id: Date.now().toString(),
      status: "agendada",
      criadoPor,
      ultimaModificacao: new Date().toISOString()
    };
    
    setEscalas(prev => [...prev, newEscala]);
    
    if (criadoPor === 'admin') {
      notificarAlteracao(
        "Nova Escala Criada", 
        `Escala para ${newEscala.tipo} em ${new Date(newEscala.data).toLocaleDateString('pt-BR')}`,
        ['lideres', 'voluntarios']
      );
    }
  };

  const updateEscala = (id: string, escalaData: Partial<Escala>, modificadoPor = 'admin') => {
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
      notificarAlteracao(
        "Escala Atualizada", 
        `Escala ${escalaAnterior.tipo} foi modificada`,
        ['lideres', 'voluntarios']
      );
    }
  };

  const atualizarEscala = async (escala: Escala) => {
    setEscalas(prev => prev.map(e => e.id === escala.id ? escala : e));
    notificarAlteracao(
      "Escala Atualizada", 
      `Escala ${escala.tipo} foi modificada`,
      ['voluntarios']
    );
  };

  const confirmarPresenca = async (escalaId: string, voluntarioId: string) => {
    setEscalas(prev => prev.map(escala => {
      if (escala.id === escalaId) {
        const voluntariosAtualizados = escala.voluntarios.map(v =>
          v.id === voluntarioId ? { ...v, confirmado: true } : v
        );
        return { ...escala, voluntarios: voluntariosAtualizados };
      }
      return escala;
    }));
  };

  const deleteEscala = (id: string, deletadoPor = 'admin') => {
    const escalaParaDeletar = escalas.find(e => e.id === id);
    
    setEscalas(prev => prev.filter(escala => escala.id !== id));
    
    if (escalaParaDeletar) {
      notificarAlteracao(
        "Escala Removida", 
        `Escala ${escalaParaDeletar.tipo} foi removida`,
        ['lideres', 'voluntarios']
      );
    }
  };

  return (
    <EscalasContext.Provider value={{ 
      escalas,
      voluntarios,
      addEscala, 
      updateEscala,
      atualizarEscala,
      deleteEscala,
      confirmarPresenca,
      notificarAlteracao 
    }}>
      {children}
    </EscalasContext.Provider>
  );
};
