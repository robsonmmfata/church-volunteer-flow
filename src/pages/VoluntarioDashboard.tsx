
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
  LogOut
} from "lucide-react";

const VoluntarioDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso."
    });
  };

  const handleAceitarSubstituicao = (index: number) => {
    toast({
      title: "Substituição aceita",
      description: "Você aceitou participar desta escala."
    });
  };

  const handleRecusarSubstituicao = (index: number) => {
    toast({
      title: "Substituição recusada",
      description: "Você recusou esta solicitação."
    });
  };

  // Mock data - Em produção, viria de uma API
  const voluntario = {
    nome: user?.nome || "Voluntário",
    proximasEscalas: [
      { data: "2024-01-07", culto: "Domingo 10h", status: "confirmado" },
      { data: "2024-01-14", culto: "Domingo 19h30", status: "confirmado" },
    ],
    substituicoesPendentes: [
      { data: "2024-01-21", culto: "Quarta 20h", solicitante: "Maria Santos" }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">
                Olá, {voluntario.nome}
              </span>
              <p className="text-sm text-gray-600">Bem-vindo ao seu painel</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Link to="/">
              <Button variant="outline" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Início
              </Button>
            </Link>
            <Link to="/voluntario/perfil">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximas Escalas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{voluntario.proximasEscalas.length}</div>
              <p className="text-xs text-muted-foreground">
                Cultos confirmados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Substituições</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{voluntario.substituicoesPendentes.length}</div>
              <p className="text-xs text-muted-foreground">
                Aguardando resposta
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Ativo</div>
              <p className="text-xs text-muted-foreground">
                Cadastro aprovado
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Próximas Escalas */}
          <Card>
            <CardHeader>
              <CardTitle>Minhas Próximas Escalas</CardTitle>
              <CardDescription>
                Cultos em que você está escalado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {voluntario.proximasEscalas.map((escala, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{escala.culto}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(escala.data).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <Badge variant="default">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Confirmado
                    </Badge>
                  </div>
                ))}
                
                {voluntario.proximasEscalas.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    Nenhuma escala programada no momento
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Solicitações de Substituição */}
          <Card>
            <CardHeader>
              <CardTitle>Solicitações de Substituição</CardTitle>
              <CardDescription>
                Outros voluntários solicitaram sua ajuda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {voluntario.substituicoesPendentes.map((solicitacao, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium">{solicitacao.culto}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(solicitacao.data).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-sm text-blue-600">
                          Solicitado por: {solicitacao.solicitante}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Pendente
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1" onClick={() => handleAceitarSubstituicao(index)}>
                        Aceitar
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => handleRecusarSubstituicao(index)}>
                        Recusar
                      </Button>
                    </div>
                  </div>
                ))}
                
                {voluntario.substituicoesPendentes.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    Nenhuma solicitação pendente
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
              <Link to="/voluntario/disponibilidade">
                <Button className="h-auto p-4 flex-col space-y-2 w-full">
                  <Calendar className="h-6 w-6" />
                  <span>Informar Disponibilidade</span>
                </Button>
              </Link>
              
              <Link to="/voluntario/solicitar-substituicao">
                <Button variant="outline" className="h-auto p-4 flex-col space-y-2 w-full">
                  <Clock className="h-6 w-6" />
                  <span>Solicitar Substituição</span>
                </Button>
              </Link>
              
              <Button variant="outline" className="h-auto p-4 flex-col space-y-2" onClick={() => toast({ title: "Em desenvolvimento", description: "Funcionalidade será implementada em breve." })}>
                <Users className="h-6 w-6" />
                <span>Ver Escala do Dia</span>
              </Button>
              
              <Link to="/voluntario/perfil">
                <Button variant="outline" className="h-auto p-4 flex-col space-y-2 w-full">
                  <Settings className="h-6 w-6" />
                  <span>Atualizar Perfil</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VoluntarioDashboard;
