
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Calendar, 
  Clock, 
  AlertTriangle,
  Plus,
  Eye,
  CheckCircle,
  XCircle
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleNovoVoluntario = () => {
    navigate('/admin/voluntarios/novo');
  };

  const handleVerVoluntarios = () => {
    navigate('/admin/voluntarios');
  };

  const handleNovaEscala = () => {
    navigate('/admin/escalas/nova');
  };

  const handleVerEscalas = () => {
    navigate('/admin/escalas');
  };

  const handleVerSubstituicoes = () => {
    navigate('/admin/substituicoes');
  };

  const handleAprovarSubstituicao = (id: number) => {
    toast({
      title: "Substituição aprovada",
      description: "A substituição foi aprovada com sucesso."
    });
  };

  const handleRejeitarSubstituicao = (id: number) => {
    toast({
      title: "Substituição rejeitada",
      description: "A substituição foi rejeitada."
    });
  };

  // Mock data - Em produção viria de uma API
  const dashboardData = {
    totalVoluntarios: 24,
    escalasAtivas: 8,
    substituicoesPendentes: 3,
    proximosEventos: 12,
    proximasEscalas: [
      { id: 1, data: "2024-01-07", culto: "Domingo 10h", lider: "João Silva", voluntarios: 5, status: "completa" },
      { id: 2, data: "2024-01-10", culto: "Quarta 20h", lider: "Maria Santos", voluntarios: 3, status: "incompleta" },
      { id: 3, data: "2024-01-14", culto: "Domingo 19h30", lider: "Pedro Lima", voluntarios: 5, status: "completa" },
    ],
    substituicoesPendentesLista: [
      { id: 1, solicitante: "Ana Costa", culto: "Domingo 10h", data: "2024-01-21", motivo: "Viagem" },
      { id: 2, solicitante: "Carlos Silva", culto: "Quarta 20h", data: "2024-01-24", motivo: "Trabalho" },
    ],
    voluntariosRecentes: [
      { nome: "Maria Oliveira", cadastro: "2024-01-01", status: "ativo" },
      { nome: "João Santos", cadastro: "2024-01-02", status: "pendente" },
      { nome: "Ana Silva", cadastro: "2024-01-03", status: "ativo" },
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
          <p className="text-gray-600">Bem-vindo, {user?.nome}! Gerencie escalas e voluntários.</p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Voluntários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.totalVoluntarios}</div>
              <p className="text-xs text-muted-foreground">
                +2 desde a semana passada
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Escalas Ativas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.escalasAtivas}</div>
              <p className="text-xs text-muted-foreground">
                Este mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Substituições</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.substituicoesPendentes}</div>
              <p className="text-xs text-muted-foreground">
                Aguardando aprovação
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximos Eventos</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.proximosEventos}</div>
              <p className="text-xs text-muted-foreground">
                Nos próximos 30 dias
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Próximas Escalas */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Próximas Escalas</CardTitle>
                <CardDescription>Escalas programadas para os próximos dias</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" onClick={handleNovaEscala}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova
                </Button>
                <Button size="sm" variant="outline" onClick={handleVerEscalas}>
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Todas
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.proximasEscalas.map((escala) => (
                  <div key={escala.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{escala.culto}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(escala.data).toLocaleDateString('pt-BR')} - Líder: {escala.lider}
                      </p>
                      <p className="text-sm text-blue-600">{escala.voluntarios} voluntários</p>
                    </div>
                    <Badge variant={escala.status === 'completa' ? 'default' : 'destructive'}>
                      {escala.status === 'completa' ? 'Completa' : 'Incompleta'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Substituições Pendentes */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Substituições Pendentes</CardTitle>
                <CardDescription>Solicitações aguardando aprovação</CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={handleVerSubstituicoes}>
                <Eye className="h-4 w-4 mr-2" />
                Ver Todas
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.substituicoesPendentesLista.map((sub) => (
                  <div key={sub.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium">{sub.solicitante}</p>
                        <p className="text-sm text-gray-600">{sub.culto} - {new Date(sub.data).toLocaleDateString('pt-BR')}</p>
                        <p className="text-sm text-gray-500">Motivo: {sub.motivo}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-3">
                      <Button size="sm" className="flex-1" onClick={() => handleAprovarSubstituicao(sub.id)}>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Aprovar
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => handleRejeitarSubstituicao(sub.id)}>
                        <XCircle className="h-3 w-3 mr-1" />
                        Rejeitar
                      </Button>
                    </div>
                  </div>
                ))}
                
                {dashboardData.substituicoesPendentesLista.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    Nenhuma substituição pendente
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Voluntários Recentes e Ações Rápidas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Voluntários Recentes */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Voluntários Recentes</CardTitle>
                <CardDescription>Últimos cadastros realizados</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" onClick={handleNovoVoluntario}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo
                </Button>
                <Button size="sm" variant="outline" onClick={handleVerVoluntarios}>
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Todos
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.voluntariosRecentes.map((voluntario, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{voluntario.nome}</p>
                      <p className="text-sm text-gray-600">
                        Cadastrado em {new Date(voluntario.cadastro).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <Badge variant={voluntario.status === 'ativo' ? 'default' : 'secondary'}>
                      {voluntario.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Ações Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>Acesso rápido às principais funcionalidades</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button className="h-auto p-4 flex-col space-y-2" onClick={handleNovoVoluntario}>
                  <Users className="h-6 w-6" />
                  <span>Novo Voluntário</span>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex-col space-y-2" onClick={handleNovaEscala}>
                  <Calendar className="h-6 w-6" />
                  <span>Nova Escala</span>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex-col space-y-2" onClick={handleVerVoluntarios}>
                  <Eye className="h-6 w-6" />
                  <span>Ver Voluntários</span>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex-col space-y-2" onClick={handleVerSubstituicoes}>
                  <Clock className="h-6 w-6" />
                  <span>Substituições</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
