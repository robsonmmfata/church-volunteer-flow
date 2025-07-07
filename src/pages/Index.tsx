import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleAprovarSubstituicao = async (index: number) => {
    try {
      // Simular aprovação via webhook
      const response = await fetch('/webhook/substituicao-aprovada', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify({
          action: 'approve_substitution',
          index: index,
          timestamp: new Date().toISOString()
        }),
      });

      toast({
        title: "Substituição aprovada com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro ao aprovar substituição",
      });
    }
  };

  const handleRecusarSubstituicao = async (index: number) => {
    try {
      // Simular recusa via webhook
      const response = await fetch('/webhook/substituicao-recusada', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify({
          action: 'reject_substitution', 
          index: index,
          timestamp: new Date().toISOString()
        }),
      });

      toast({
        title: "Substituição recusada",
      });
    } catch (error) {
      toast({
        title: "Erro ao recusar substituição",
      });
    }
  };

  const handleGerenciarVoluntarios = () => {
    navigate('/admin/voluntarios');
  };

  const handleGerenciarEscalas = () => {
    navigate('/admin/escalas');
  };

  const handleGerenciarSubstituicoes = () => {
    navigate('/admin/substituicoes');
  };

  const handleConfiguracoes = () => {
    navigate('/admin/configuracoes');
  };

  // Mock data - Em produção, viria de uma API
  const estatisticas = {
    totalVoluntarios: 50,
    escalasEsteMes: 20,
    substituicoesPendentes: 5,
    taxaPresenca: 95
  };

  const proximasEscalas = [
    { data: "2024-01-07", culto: "Domingo 10h", voluntarios: 5, status: "completa" },
    { data: "2024-01-10", culto: "Quarta 20h", voluntarios: 3, status: "incompleta" },
    { data: "2024-01-14", culto: "Domingo 19h30", voluntarios: 5, status: "completa" },
  ];

  const substituicoesPendentes = [
    { data: "2024-01-21", culto: "Domingo 10h", voluntarioOriginal: "Maria Santos", voluntarioSubstituto: "João Silva" },
    { data: "2024-01-24", culto: "Quarta 20h", voluntarioOriginal: "Pedro Lima", voluntarioSubstituto: "Ana Costa" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
          <p className="text-gray-600">Visão geral do sistema de escalas</p>
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

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taxa de Presença</p>
                  <p className="text-2xl font-bold text-green-600">{estatisticas.taxaPresenca}%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
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
                {substituicoesPendentes.map((substituicao, index) => (
                  <div key={index} className="p-4 border rounded-lg">
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
                      <Button size="sm" className="flex-1" onClick={() => handleAprovarSubstituicao(index)}>
                        Aprovar
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => handleRecusarSubstituicao(index)}>
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

        {/* Ações Rápidas */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="h-auto p-4 flex-col space-y-2" onClick={handleGerenciarVoluntarios}>
                <Users className="h-6 w-6" />
                <span>Gerenciar Voluntários</span>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex-col space-y-2" onClick={handleGerenciarEscalas}>
                <Calendar className="h-6 w-6" />
                <span>Gerenciar Escalas</span>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex-col space-y-2" onClick={handleGerenciarSubstituicoes}>
                <Clock className="h-6 w-6" />
                <span>Ver Substituições</span>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex-col space-y-2" onClick={handleConfiguracoes}>
                <Settings className="h-6 w-6" />
                <span>Configurações</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
