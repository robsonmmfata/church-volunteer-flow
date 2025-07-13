
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle,
  AlertCircle,
  Home,
  Settings,
  LogOut,
  UserCheck,
  MessageCircle,
  Phone
} from "lucide-react";

const LiderDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [liderData, setLiderData] = useState({
    proximasEscalas: [
      { id: 1, data: "2024-01-07", culto: "Domingo 10h", status: "confirmado", voluntarios: 5 },
      { id: 2, data: "2024-01-10", culto: "Quarta 20h", status: "incompleto", voluntarios: 3 },
      { id: 3, data: "2024-01-14", culto: "Domingo 19h30", status: "confirmado", voluntarios: 5 },
    ],
    substituicoesPendentes: [
      { 
        id: 1,
        data: "2024-01-21", 
        culto: "Domingo 10h", 
        solicitante: "Maria Santos", 
        motivo: "Viagem de trabalho" 
      }
    ],
    voluntariosEquipe: [
      { id: 1, nome: "João Silva", celular: "11999999999", status: "ativo" },
      { id: 2, nome: "Maria Santos", celular: "11888888888", status: "ativo" },
      { id: 3, nome: "Pedro Lima", celular: "11777777777", status: "inativo" },
      { id: 4, nome: "Ana Costa", celular: "11666666666", status: "ativo" },
    ]
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso."
    });
  };

  const handleAprovarSubstituicao = (id: number) => {
    setLiderData(prev => ({
      ...prev,
      substituicoesPendentes: prev.substituicoesPendentes.filter(sub => sub.id !== id)
    }));
    
    toast({
      title: "Substituição aprovada",
      description: "A substituição foi aprovada com sucesso."
    });
    
    // Enviar para API
    fetch('/api/substituicoes/aprovar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, aprovadoPor: user?.id })
    }).catch(err => console.error('Erro ao aprovar:', err));
  };

  const handleRecusarSubstituicao = (id: number) => {
    setLiderData(prev => ({
      ...prev,
      substituicoesPendentes: prev.substituicoesPendentes.filter(sub => sub.id !== id)
    }));
    
    toast({
      title: "Substituição recusada",
      description: "A substituição foi recusada."
    });
    
    // Enviar para API
    fetch('/api/substituicoes/recusar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, recusadoPor: user?.id })
    }).catch(err => console.error('Erro ao recusar:', err));
  };

  const handleContatar = (nome: string, celular: string) => {
    const numeroLimpo = celular.replace(/\D/g, '');
    const url = `https://wa.me/55${numeroLimpo}?text=Olá ${nome}, tudo bem? Sou o líder da escala.`;
    window.open(url, '_blank');
    
    toast({
      title: "WhatsApp aberto",
      description: `Contato iniciado com ${nome}`
    });
  };

  const handleConvocarVoluntarios = () => {
    const voluntariosAtivos = liderData.voluntariosEquipe.filter(v => v.status === 'ativo');
    
    voluntariosAtivos.forEach(voluntario => {
      const numeroLimpo = voluntario.celular.replace(/\D/g, '');
      const mensagem = `Olá ${voluntario.nome}! Você está sendo convocado para uma nova escala. Por favor, confirme sua disponibilidade.`;
      
      // Simular envio via WhatsApp API
      fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numero: numeroLimpo,
          mensagem: mensagem
        })
      }).catch(err => console.error('Erro ao enviar:', err));
    });
    
    toast({
      title: "Convocação enviada",
      description: `${voluntariosAtivos.length} voluntários foram convocados via WhatsApp.`
    });
  };

  const handleEnviarAvisos = () => {
    const voluntariosAtivos = liderData.voluntariosEquipe.filter(v => v.status === 'ativo');
    
    toast({
      title: "Enviando avisos",
      description: `Aviso será enviado para ${voluntariosAtivos.length} voluntários.`
    });
    
    // Simular envio de avisos
    setTimeout(() => {
      toast({
        title: "Avisos enviados",
        description: "Todos os voluntários foram notificados com sucesso."
      });
    }, 2000);
  };

  const handleEditarEscala = (escalaId: number) => {
    navigate(`/admin/escalas/editar/${escalaId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-green-600 text-white p-2 rounded-lg">
              <UserCheck className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">
                Olá, {user?.nome}
              </span>
              <p className="text-sm text-gray-600">Painel do Líder</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Link to="/">
              <Button variant="outline" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Início
              </Button>
            </Link>
            <Link to="/lider/perfil">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Perfil
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4">
        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Escalas do Mês</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{liderData.proximasEscalas.length}</div>
              <p className="text-xs text-muted-foreground">
                Como líder responsável
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Substituições</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{liderData.substituicoesPendentes.length}</div>
              <p className="text-xs text-muted-foreground">
                Aguardando aprovação
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Minha Equipe</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {liderData.voluntariosEquipe.filter(v => v.status === 'ativo').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Voluntários ativos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Líder</div>
              <p className="text-xs text-muted-foreground">
                Acesso completo
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Minhas Escalas */}
          <Card>
            <CardHeader>
              <CardTitle>Minhas Escalas como Líder</CardTitle>
              <CardDescription>
                Cultos onde você é o líder responsável
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {liderData.proximasEscalas.map((escala) => (
                  <div key={escala.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{escala.culto}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(escala.data).toLocaleDateString('pt-BR')}
                      </p>
                      <p className="text-sm text-blue-600">
                        {escala.voluntarios} voluntários escalados
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={escala.status === 'confirmado' ? 'default' : 'destructive'}>
                        {escala.status === 'confirmado' ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completo
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Incompleto
                          </>
                        )}
                      </Badge>
                      <Button size="sm" variant="outline" onClick={() => handleEditarEscala(escala.id)}>
                        Editar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Solicitações de Substituição */}
          <Card>
            <CardHeader>
              <CardTitle>Substituições Pendentes</CardTitle>
              <CardDescription>
                Solicitações que precisam da sua aprovação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {liderData.substituicoesPendentes.map((solicitacao) => (
                  <div key={solicitacao.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium">{solicitacao.culto}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(solicitacao.data).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-sm text-blue-600">
                          Solicitado por: {solicitacao.solicitante}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Motivo: {solicitacao.motivo}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Pendente
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1" onClick={() => handleAprovarSubstituicao(solicitacao.id)}>
                        Aprovar
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => handleRecusarSubstituicao(solicitacao.id)}>
                        Recusar
                      </Button>
                    </div>
                  </div>
                ))}
                
                {liderData.substituicoesPendentes.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    Nenhuma solicitação pendente
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Minha Equipe */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Minha Equipe de Voluntários</CardTitle>
            <CardDescription>
              Voluntários sob sua liderança
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {liderData.voluntariosEquipe.map((voluntario) => (
                <div key={voluntario.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{voluntario.nome}</h4>
                    <Badge variant={voluntario.status === 'ativo' ? 'default' : 'secondary'}>
                      {voluntario.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 flex items-center">
                    <Phone className="h-3 w-3 mr-1" />
                    {voluntario.celular}
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleContatar(voluntario.nome, voluntario.celular)}
                  >
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Contatar
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ações de Liderança */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Ações de Liderança</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link to="/admin/escalas">
                <Button className="h-auto p-4 flex-col space-y-2 w-full">
                  <Calendar className="h-6 w-6" />
                  <span>Gerenciar Escalas</span>
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                className="h-auto p-4 flex-col space-y-2" 
                onClick={handleConvocarVoluntarios}
              >
                <Users className="h-6 w-6" />
                <span>Convocar Voluntários</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-4 flex-col space-y-2" 
                onClick={handleEnviarAvisos}
              >
                <MessageCircle className="h-6 w-6" />
                <span>Enviar Avisos</span>
              </Button>
              
              <Link to="/lider/perfil">
                <Button variant="outline" className="h-auto p-4 flex-col space-y-2 w-full">
                  <Settings className="h-6 w-6" />
                  <span>Configurações</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LiderDashboard;
