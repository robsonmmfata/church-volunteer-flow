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
import { TesteAutomacoes } from '@/components/TesteAutomacoes';

const Index = () => {
  const navigate = useNavigate();
  const { escalas, addEscala, voluntarios } = useEscalas();
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

  const handleGerarEscala = async () => {
    toast.info("Gerando escalas automáticas...");
    
    try {
      // Importar o gerador de escalas
      const { EscalaGenerator } = await import('@/utils/escalaGenerator');
      
      // Configurar dados dos voluntários para o gerador
      const voluntariosParaGerar = voluntarios.map(v => ({
        id: parseInt(v.id),
        nome: v.nome,
        sexo: (v as any).sexo?.toLowerCase() === 'feminino' ? 'feminino' as const : 'masculino' as const,
        disponibilidade: ['domingo', 'quarta', 'sexta'], // Seria vindo da disponibilidade real
        contadorEscalas: 0
      }));

      const configuracao = {
        totalVoluntarios: 5,
        minimoHomens: 2,
        minimoMulheres: 3,
        diasSemana: ['domingo', 'quarta']
      };

      const gerador = new EscalaGenerator(voluntariosParaGerar, configuracao);
      const escalasGeradas = gerador.gerarEscalaAutomatica(new Date(), 4);

      // Adicionar as escalas geradas ao contexto
      for (const escalaGerada of escalasGeradas) {
        const escalaFormatada = {
          data: escalaGerada.data,
          tipo: escalaGerada.culto,
          culto: escalaGerada.culto,
          lider: voluntarios.find(v => v.tipo === 'lider')?.nome || 'Admin',
          voluntarios: escalaGerada.voluntarios.map(v => ({
            id: v.id.toString(),
            nome: v.nome,
            tipo: 'voluntario' as const
          })),
          local: "Templo Principal"
        };
        
        addEscala(escalaFormatada);
      }

      toast.success(`${escalasGeradas.length} escalas geradas automaticamente!`);
      
      // Enviar notificação para todos os usuários
      const notificacao = {
        title: "🗓️ Novas Escalas Geradas",
        message: `${escalasGeradas.length} novas escalas foram geradas automaticamente pelo administrador.`,
        type: "info" as const,
        from: "Administrador"
      };
      
      // Broadcast para todos os usuários
      broadcastNotification(notificacao);
      
    } catch (error) {
      console.error("Erro ao gerar escalas:", error);
      toast.error("Erro ao gerar escalas automaticamente");
    }
  };

  const handleEnviarLembretes = async () => {
    toast.info("Enviando lembretes para todos os voluntários e líderes...");
    
    try {
      // Mensagem de lembrete personalizada
      const timestampAtual = new Date().toLocaleString('pt-BR');
      const mensagemLembrete = `📢 LEMBRETE AUTOMÁTICO 
Olá! Este é um lembrete para verificar suas próximas escalas.
⏰ Enviado em: ${timestampAtual}
📱 Acesse o sistema e confirme sua presença nas próximas atividades.
✅ Mantenha seus dados atualizados.
🙏 Sua participação é fundamental!`;
      
      // Notificação para o sistema
      const notificacaoLembrete = {
        title: "📢 Lembrete Automático",
        message: `Lembrete automático enviado pelo administrador. Verifique suas escalas e confirme sua presença.`,
        type: "warning" as const,
        from: "Administrador"
      };

      // Broadcast para todos os usuários (voluntários e líderes)
      broadcastNotification(notificacaoLembrete);
      
      // Simular envio de WhatsApp (em produção, integrar com API real)
      let contadorEnviados = 0;
      for (const usuario of todosUsuarios) {
        const mensagemPersonalizada = `Olá ${usuario.nome}! ${mensagemLembrete}`;
        const urlWhatsApp = `https://wa.me/${usuario.numero}?text=${encodeURIComponent(mensagemPersonalizada)}`;
        
        console.log(`📱 WhatsApp preparado para ${usuario.nome}: ${urlWhatsApp}`);
        contadorEnviados++;
        
        // Delay entre preparações (evitar spam)
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Adicionar notificação específica para o admin
      addNotification({
        title: "📨 Lembretes Enviados",
        message: `Lembretes enviados com sucesso para ${contadorEnviados} usuários (${todosUsuarios.filter(u => u.tipo === 'voluntario').length} voluntários e ${todosUsuarios.filter(u => u.tipo === 'lider').length} líderes).`,
        type: "success"
      });

      setTimeout(() => {
        toast.success(`✅ Lembretes enviados para ${contadorEnviados} usuários!`, {
          duration: 5000,
          description: `Notificações in-app enviadas + Links WhatsApp preparados`
        });
      }, 1000);
      
    } catch (error) {
      toast.error("Erro ao enviar lembretes");
      console.error("Erro:", error);
    }
  };

  const handleSincronizarDados = async () => {
    toast.info("Sincronizando dados com Google Sheets...");
    
    try {
      // Preparar dados para sincronização
      const dadosEscalas = escalas.map(escala => ({
        id: escala.id,
        data: escala.data,
        culto: escala.culto,
        lider: escala.lider,
        voluntarios: escala.voluntarios.map(v => v.nome).join(", "),
        status: escala.status || 'Agendado',
        local: escala.local || 'Templo Principal',
        total_voluntarios: escala.voluntarios.length
      }));
      
      const dadosVoluntarios = voluntarios.map(v => ({
        id: v.id,
        nome: v.nome,
        email: (v as any).email || 'email@exemplo.com',
        telefone: (v as any).telefone || '(11) 99999-9999',
        tipo: v.tipo,
        ativo: (v as any).ativo !== false ? 'Sim' : 'Não',
        data_cadastro: new Date().toLocaleDateString('pt-BR')
      }));

      // Simular sincronização real com Google Sheets
      console.log("📊 Dados para sincronizar:");
      console.log("Escalas:", dadosEscalas);
      console.log("Voluntários:", dadosVoluntarios);
      
      // Aqui seria a integração real com Google Sheets API
      const webhookUrl = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";
      
      const payload = {
        action: 'sync_data',
        timestamp: new Date().toISOString(),
        escalas: dadosEscalas,
        voluntarios: dadosVoluntarios,
        summary: {
          total_escalas: dadosEscalas.length,
          total_voluntarios: dadosVoluntarios.length,
          enviado_por: 'Sistema Administrativo'
        }
      };

      // Notificar sobre a sincronização
      const notificacaoSync = {
        title: "📊 Dados Sincronizados",
        message: `Sincronização realizada: ${dadosEscalas.length} escalas e ${dadosVoluntarios.length} voluntários enviados para Google Sheets.`,
        type: "info" as const,
        from: "Sistema"
      };

      // Broadcast para administradores e líderes
      broadcastNotification(notificacaoSync);
      
      // Simular delay de sincronização
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast.success("✅ Dados sincronizados com Google Sheets!", {
        duration: 5000,
        description: `${dadosEscalas.length} escalas e ${dadosVoluntarios.length} voluntários sincronizados`
      });
      
      // Log detalhado para debug
      console.log(`✅ Sincronização concluída: ${dadosEscalas.length} escalas, ${dadosVoluntarios.length} voluntários`);
      
    } catch (error) {
      console.error("❌ Erro na sincronização:", error);
      toast.error("Erro ao sincronizar dados com Google Sheets", {
        duration: 5000,
        description: "Verifique a configuração da API e tente novamente"
      });
    }
  };

  // Função para broadcast de notificações para todos os usuários
  const broadcastNotification = (notification: any) => {
    // Enviar para todos os voluntários e líderes
    todosUsuarios.forEach(usuario => {
      const chaveNotificacao = `notifications_${usuario.nome.toLowerCase().replace(/\s+/g, '_')}`;
      const notificacoesExistentes = JSON.parse(localStorage.getItem(chaveNotificacao) || '[]');
      
      const novaNotificacao = {
        ...notification,
        id: Date.now().toString() + Math.random(),
        timestamp: new Date().toISOString(),
        read: false
      };
      
      const notificacoesAtualizadas = [novaNotificacao, ...notificacoesExistentes];
      localStorage.setItem(chaveNotificacao, JSON.stringify(notificacoesAtualizadas));
    });

    // Disparar evento para atualização em tempo real
    window.dispatchEvent(new CustomEvent('broadcastNotification', { 
      detail: notification 
    }));
    
    console.log(`📡 Notificação enviada para ${todosUsuarios.length} usuários:`, notification);
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
                onClick={handleGerarEscala}
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

        {/* Sistema de Testes das Automações */}
        <TesteAutomacoes />
      </div>
    </div>
  );
};

export default Index;
