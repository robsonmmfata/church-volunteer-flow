
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
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEscalas } from "@/contexts/EscalasContext";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { escalas } = useEscalas();
  
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
  
  const handleAprovarSubstituicao = (id: number) => {
    setSubstituicoesPendentes(prev => prev.filter(sub => sub.id !== id));
    toast({
      title: "Substituição aprovada",
      description: "Substituição aprovada com sucesso!",
    });
    console.log("Substituição aprovada:", id);
  };

  const handleRecusarSubstituicao = (id: number) => {
    setSubstituicoesPendentes(prev => prev.filter(sub => sub.id !== id));
    toast({
      title: "Substituição recusada", 
      description: "Substituição recusada",
      variant: "destructive"
    });
    console.log("Substituição recusada:", id);
  };

  const handleGerarEscala = () => {
    toast({
      title: "Gerando escala",
      description: "Gerando nova escala automaticamente...",
    });
    console.log("Gerando escala automática");
    setTimeout(() => {
      navigate('/admin/escalas/nova');
    }, 1500);
  };

  const handleEnviarLembretes = () => {
    toast({
      title: "Lembretes enviados",
      description: "Lembretes enviados via WhatsApp!",
    });
    console.log("Enviando lembretes");
  };

  const handleSincronizarDados = () => {
    toast({
      title: "Sincronizando dados",
      description: "Sincronizando dados com Google Sheets...",
    });
    console.log("Sincronizando dados");
  };

  const estatisticas = {
    totalVoluntarios: 50,
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
                      <Button size="sm" className="flex-1" onClick={() => handleAprovarSubstituicao(substituicao.id)}>
                        Aprovar
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => handleRecusarSubstituicao(substituicao.id)}>
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
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-4 flex-col space-y-2"
                onClick={handleSincronizarDados}
              >
                <Settings className="h-6 w-6" />
                <span>Sincronizar Dados</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
