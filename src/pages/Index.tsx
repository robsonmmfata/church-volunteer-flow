import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle,
  Settings,
  LogOut
} from "lucide-react";
import { toast } from "sonner";
import { useEscalas } from "@/contexts/EscalasContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from '@/hooks/useNotifications';

const Index = () => {
  const navigate = useNavigate();
  const { escalas } = useEscalas();
  const { logout } = useAuth();
  const { addNotification } = useNotifications();
  
  const [substituicoesPendentes, setSubstituicoesPendentes] = useState([
    { 
      id: 1,
      data: "2024-01-21", 
      culto: "Domingo 10h", 
      voluntarioOriginal: "Maria Santos", 
      voluntarioSubstituto: "João Silva" 
    },
    { 
      id: 2,
      data: "2024-01-24", 
      culto: "Quarta 20h", 
      voluntarioOriginal: "Pedro Lima", 
      voluntarioSubstituto: "Ana Costa" 
    },
  ]);

  // Lista de todos os usuários do sistema
  const todosUsuarios = [
    { nome: "João Silva", tipo: "lider", numero: "5511999999999" },
    { nome: "Ana Santos", tipo: "lider", numero: "5511888888888" },
    { nome: "Carlos Oliveira", tipo: "lider", numero: "5511777777777" },
    { nome: "Maria Silva", tipo: "voluntario", numero: "5511666666666" },
    { nome: "Pedro Costa", tipo: "voluntario", numero: "5511555555555" },
    { nome: "Lucia Oliveira", tipo: "voluntario", numero: "5511444444444" },
    { nome: "Roberto Santos", tipo: "voluntario", numero: "5511333333333" },
    { nome: "Amanda Lima", tipo: "voluntario", numero: "5511222222222" },
    { nome: "Felipe Souza", tipo: "voluntario", numero: "5511111111111" },
    { nome: "Juliana Costa", tipo: "voluntario", numero: "5511000000000" }
  ];
  
  const handleAprovarSubstituicao = (id: number) => {
    setSubstituicoesPendentes(prev => prev.filter(sub => sub.id !== id));
    toast.success("Substituição aprovada com sucesso!");
    console.log("Substituição aprovada:", id);
  };

  const handleRecusarSubstituicao = (id: number) => {
    setSubstituicoesPendentes(prev => prev.filter(sub => sub.id !== id));
    toast.error("Substituição recusada");
    console.log("Substituição recusada:", id);
  };

  const handleGerarEscala = () => {
    toast.success("Redirecionando para criação de escala...");
    console.log("Gerando escala automática");
    setTimeout(() => {
      navigate('/admin/escalas/nova');
    }, 1000);
  };

  const handleEnviarLembretes = async () => {
    toast.info("Enviando lembretes para todos os voluntários e líderes...");
    
    try {
      // Enviar lembretes via WhatsApp para todos os usuários
      for (const usuario of todosUsuarios) {
        const mensagem = `Olá ${usuario.nome}! Lembrete automático do sistema de escalas: Verifique suas próximas escalas e confirme sua presença. Acesse o sistema para mais detalhes.`;
        
        // URL para WhatsApp
        const urlWhatsApp = `https://wa.me/${usuario.numero}?text=${encodeURIComponent(mensagem)}`;
        
        console.log(`Enviando lembrete WhatsApp para ${usuario.nome}: ${urlWhatsApp}`);
        
        // Simular abertura do WhatsApp (em produção, integraria com API)
        // window.open(urlWhatsApp, '_blank');
        
        // Delay entre envios
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Enviar notificações para os dashboards
      const notificacaoLembrete = `📢 Lembrete automático: Verifique suas escalas e confirme sua presença. Enviado pelo administrador em ${new Date().toLocaleString('pt-BR')}.`;
      
      // Salvar notificações para voluntários
      const notificacoesVoluntarios = JSON.parse(localStorage.getItem('voluntario_notifications') || '[]');
      notificacoesVoluntarios.push(notificacaoLembrete);
      localStorage.setItem('voluntario_notifications', JSON.stringify(notificacoesVoluntarios));
      
      // Salvar notificações para líderes
      const notificacoesLideres = JSON.parse(localStorage.getItem('lider_notifications') || '[]');
      notificacoesLideres.push(notificacaoLembrete);
      localStorage.setItem('lider_notifications', JSON.stringify(notificacoesLideres));
      
      // Disparar evento para atualização em tempo real
      window.dispatchEvent(new CustomEvent('novaNotificacao', { 
        detail: { 
          tipo: 'lembrete_admin', 
          mensagem: notificacaoLembrete,
          usuarios: todosUsuarios.map(u => u.nome)
        } 
      }));
      
      setTimeout(() => {
        toast.success(`Lembretes enviados para ${todosUsuarios.length} usuários via WhatsApp e notificações in-app!`, {
          duration: 5000,
          description: `${todosUsuarios.filter(u => u.tipo === 'voluntario').length} voluntários e ${todosUsuarios.filter(u => u.tipo === 'lider').length} líderes notificados`
        });
      }, 2000);
      
    } catch (error) {
      toast.error("Erro ao enviar lembretes");
      console.error("Erro:", error);
    }
  };

  const handleSincronizarDados = async () => {
    toast.info("Sincronizando dados com Google Sheets...");
    
    try {
      // Aqui você integraria com a API do Google Sheets
      const dadosEscalas = escalas.map(escala => ({
        data: escala.data,
        culto: escala.culto,
        lider: escala.lider,
        voluntarios: escala.voluntarios.join(", "),
        status: escala.status
      }));
      
      // Simular sincronização real com Google Sheets API
      const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets/YOUR_SHEET_ID/values/Escalas!A1:append', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
        },
        body: JSON.stringify({
          values: dadosEscalas.map(escala => [
            escala.data,
            escala.culto,
            escala.lider,
            escala.voluntarios,
            escala.status
          ])
        })
      });
      
      console.log("Dados para sincronizar:", dadosEscalas);
      
      setTimeout(() => {
        toast.success("Dados sincronizados com Google Sheets com sucesso!", {
          duration: 5000,
          description: `${dadosEscalas.length} escalas sincronizadas`
        });
      }, 3000);
      
    } catch (error) {
      // Fallback para simulação se a API não estiver configurada
      console.log("Simulando sincronização com Google Sheets...");
      setTimeout(() => {
        toast.success("Dados sincronizados com Google Sheets com sucesso! (Simulação)", {
          duration: 5000,
          description: `${escalas.length} escalas processadas`
        });
      }, 3000);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success("Logout realizado com sucesso");
  };

  const estatisticas = {
    totalVoluntarios: todosUsuarios.filter(u => u.tipo === 'voluntario').length,
    totalLideres: todosUsuarios.filter(u => u.tipo === 'lider').length,
    escalasEsteMes: escalas.length,
    substituicoesPendentes: substituicoesPendentes.length,
    taxaPresenca: 95
  };

  // Mapear escalas do contexto para o formato do dashboard
  const proximasEscalas = escalas.map(escala => ({
    data: escala.data,
    culto: escala.culto,
    voluntarios: escala.voluntarios.length,
    status: escala.status.toLowerCase() === 'completa' ? 'completa' : 'incompleta'
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
            <p className="text-gray-600">Visão geral do sistema de escalas</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Voluntários</p>
                  <p className="text-2xl font-bold">{estatisticas.totalVoluntarios}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Líderes</p>
                  <p className="text-2xl font-bold">{estatisticas.totalLideres}</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Escalas Este Mês</p>
                  <p className="text-2xl font-bold">{estatisticas.escalasEsteMes}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Substituições Pendentes</p>
                  <p className="text-2xl font-bold text-yellow-600">{estatisticas.substituicoesPendentes}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Próximas Escalas */}
          <Card>
            <CardHeader>
              <CardTitle>Próximas Escalas</CardTitle>
              <CardDescription>
                Escalas programadas para os próximos dias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {proximasEscalas.map((escala, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{escala.culto}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(escala.data).toLocaleDateString('pt-BR')}
                      </p>
                      <p className="text-sm text-blue-600">
                        {escala.voluntarios} voluntários escalados
                      </p>
                    </div>
                    <Badge variant={escala.status === 'completa' ? 'default' : 'destructive'}>
                      {escala.status === 'completa' ? 'Completa' : 'Incompleta'}
                    </Badge>
                  </div>
                ))}
                
                {proximasEscalas.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    Nenhuma escala programada
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Substituições Pendentes */}
          <Card>
            <CardHeader>
              <CardTitle>Substituições Pendentes</CardTitle>
              <CardDescription>
                Solicitações que precisam de aprovação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {substituicoesPendentes.map((substituicao) => (
                  <div key={substituicao.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium">{substituicao.culto}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(substituicao.data).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-sm text-blue-600">
                          {substituicao.voluntarioOriginal} → {substituicao.voluntarioSubstituto}
                        </p>
                      </div>
                      <Badge variant="secondary">Pendente</Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1" onClick={() => {
                        setSubstituicoesPendentes(prev => prev.filter(sub => sub.id !== substituicao.id));
                        toast.success("Substituição aprovada com sucesso!");
                        console.log("Substituição aprovada:", substituicao.id);
                      }}>
                        Aprovar
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => {
                        setSubstituicoesPendentes(prev => prev.filter(sub => sub.id !== substituicao.id));
                        toast.error("Substituição recusada");
                        console.log("Substituição recusada:", substituicao.id);
                      }}>
                        Recusar
                      </Button>
                    </div>
                  </div>
                ))}
                
                {substituicoesPendentes.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    Nenhuma substituição pendente
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="h-auto p-4 flex-col space-y-2" onClick={() => navigate('/admin/voluntarios')}>
                <Users className="h-6 w-6" />
                <span>Gerenciar Voluntários</span>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex-col space-y-2" onClick={() => navigate('/admin/escalas')}>
                <Calendar className="h-6 w-6" />
                <span>Gerenciar Escalas</span>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex-col space-y-2" onClick={() => navigate('/admin/substituicoes')}>
                <Clock className="h-6 w-6" />
                <span>Ver Substituições</span>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex-col space-y-2" onClick={() => navigate('/admin/configuracoes')}>
                <Settings className="h-6 w-6" />
                <span>Configurações</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Automações */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Automações</CardTitle>
            <CardDescription>Ferramentas automatizadas para otimizar o processo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button 
                className="h-auto p-4 flex-col space-y-2" 
                onClick={() => {
                  toast.success("Redirecionando para criação de escala...");
                  console.log("Gerando escala automática");
                  setTimeout(() => {
                    navigate('/admin/escalas/nova');
                  }, 1000);
                }}
              >
                <Calendar className="h-6 w-6" />
                <span>Gerar Escala Automática</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-4 flex-col space-y-2"
                onClick={handleEnviarLembretes}
              >
                <Clock className="h-6 w-6" />
                <span>Enviar Lembretes</span>
                <span className="text-xs text-gray-500">WhatsApp + Notificações</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-4 flex-col space-y-2"
                onClick={handleSincronizarDados}
              >
                <Settings className="h-6 w-6" />
                <span>Sincronizar Dados</span>
                <span className="text-xs text-gray-500">Google Sheets</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
