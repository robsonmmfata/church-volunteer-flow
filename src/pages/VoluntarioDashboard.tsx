
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useEscalas } from "@/contexts/EscalasContext";
import { toast } from "sonner";
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle,
  AlertCircle,
  Home,
  Settings,
  LogOut,
  Bell
} from "lucide-react";

const VoluntarioDashboard = () => {
  const { user, logout } = useAuth();
  const { escalas } = useEscalas();
  const navigate = useNavigate();

  // Filtrar escalas onde o usuário está como voluntário
  const minhasEscalas = escalas.filter(escala => 
    escala.voluntarios.includes(user?.nome || '')
  ).map(escala => ({
    id: escala.id,
    data: escala.data,
    culto: escala.culto,
    status: "confirmado",
    lider: escala.lider,
    criadoPor: escala.criadoPor,
    modificadoPor: escala.modificadoPor,
    ultimaModificacao: escala.ultimaModificacao
  }));

  const [substituicoesPendentes, setSubstituicoesPendentes] = useState([
    { id: 1, data: "2024-01-21", culto: "Quarta 20h", solicitante: "Maria Santos" }
  ]);

  const [notificacoes, setNotificacoes] = useState<string[]>([]);

  // Monitorar mudanças nas escalas para notificar voluntários
  useEffect(() => {
    const escalasMaisRecentes = escalas.filter(escala => {
      if (!escala.ultimaModificacao) return false;
      const ultimaModificacao = new Date(escala.ultimaModificacao);
      const agora = new Date();
      const diferencaMinutos = (agora.getTime() - ultimaModificacao.getTime()) / (1000 * 60);
      
      // Notificar se foi modificada recentemente por admin ou líder E o voluntário está na escala
      return diferencaMinutos < 1 && 
             (escala.criadoPor === 'admin' || escala.criadoPor === 'lider' || escala.modificadoPor === 'admin' || escala.modificadoPor === 'lider') &&
             escala.voluntarios.includes(user?.nome || '');
    });

    if (escalasMaisRecentes.length > 0) {
      escalasMaisRecentes.forEach(escala => {
        const modificador = escala.modificadoPor === 'admin' ? 'administrador' : 'líder';
        toast.info(`Escala ${escala.culto} foi atualizada pelo ${modificador}`, {
          duration: 5000,
          action: {
            label: "Ver Detalhes",
            onClick: () => console.log(`Ver escala ${escala.id}`)
          }
        });
      });
    }
  }, [escalas, user?.nome]);

  // Escutar notificações do localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const novasNotificacoes = JSON.parse(localStorage.getItem('voluntario_notifications') || '[]');
      if (novasNotificacoes.length > 0) {
        novasNotificacoes.forEach((notif: string) => {
          toast.info(notif, { duration: 5000 });
        });
        setNotificacoes(prev => [...prev, ...novasNotificacoes]);
        localStorage.removeItem('voluntario_notifications');
      }
    };

    // Verificar notificações a cada segundo
    const interval = setInterval(handleStorageChange, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success("Logout realizado com sucesso");
  };

  const handleAceitarSubstituicao = (id: number) => {
    setSubstituicoesPendentes(prev => prev.filter(sub => sub.id !== id));
    
    toast.success("Substituição aceita - Você aceitou participar desta escala");
    
    console.log("Substituição aceita:", id);
  };

  const handleRecusarSubstituicao = (id: number) => {
    setSubstituicoesPendentes(prev => prev.filter(sub => sub.id !== id));
    
    toast.error("Substituição recusada");
    
    console.log("Substituição recusada:", id);
  };

  const handleVerEscalaDia = () => {
    const hoje = new Date().toISOString().split('T')[0];
    const escalaHoje = minhasEscalas.find(escala => 
      escala.data === hoje
    );
    
    if (escalaHoje) {
      toast.success(`Escala de hoje - Você está escalado para: ${escalaHoje.culto}`, {
        duration: 8000,
        action: {
          label: "Ver Detalhes",
          onClick: () => {
            toast.info(`Detalhes da Escala:
            Data: ${new Date(escalaHoje.data).toLocaleDateString('pt-BR')}
            Culto: ${escalaHoje.culto}
            Líder: ${escalaHoje.lider}
            Status: Confirmado`, { duration: 10000 });
          }
        }
      });
    } else {
      // Verificar próxima escala
      const proximaEscala = minhasEscalas
        .filter(escala => new Date(escala.data) > new Date())
        .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())[0];
      
      if (proximaEscala) {
        toast.info(`Sem escala hoje - Próxima escala: ${proximaEscala.culto} em ${new Date(proximaEscala.data).toLocaleDateString('pt-BR')}`, {
          duration: 8000
        });
      } else {
        toast.info("Sem escala hoje - Você não tem escalas programadas");
      }
    }
  };

  const handleConfirmarPresenca = (escalaId: number) => {
    toast.success("Presença confirmada com sucesso");
    
    console.log("Presença confirmada para escala:", escalaId);
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
                Olá, {user?.nome || 'Voluntário'}
              </span>
              <p className="text-sm text-gray-600">Bem-vindo ao seu painel</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notificações {notificacoes.length > 0 && <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1">{notificacoes.length}</span>}
            </Button>
            <Link to="/">
              <Button variant="outline" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Início
              </Button>
            </Link>
            <Link to="/perfil-usuario">
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
              <div className="text-2xl font-bold">{minhasEscalas.length}</div>
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
              <div className="text-2xl font-bold">{substituicoesPendentes.length}</div>
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
          <Card>
            <CardHeader>
              <CardTitle>Minhas Próximas Escalas</CardTitle>
              <CardDescription>
                Cultos em que você está escalado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {minhasEscalas.map((escala) => (
                  <div key={escala.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{escala.culto}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(escala.data).toLocaleDateString('pt-BR')}
                      </p>
                      <p className="text-sm text-blue-600">
                        Líder: {escala.lider}
                      </p>
                      {(escala.modificadoPor === 'admin' || escala.modificadoPor === 'lider') && (
                        <Badge variant="outline" className="mt-1">
                          <Bell className="h-3 w-3 mr-1" />
                          Atualizada por {escala.modificadoPor === 'admin' ? 'Admin' : 'Líder'}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="default">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Confirmado
                      </Badge>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          toast.success("Presença confirmada com sucesso!");
                          console.log("Presença confirmada para escala:", escala.id);
                        }}
                      >
                        Confirmar
                      </Button>
                    </div>
                  </div>
                ))}
                
                {minhasEscalas.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    Nenhuma escala programada no momento
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Solicitações de Substituição</CardTitle>
              <CardDescription>
                Outros voluntários solicitaram sua ajuda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {substituicoesPendentes.map((solicitacao) => (
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
                      </div>
                      <Badge variant="secondary">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Pendente
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1" onClick={() => handleAceitarSubstituicao(solicitacao.id)}>
                        Aceitar
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => handleRecusarSubstituicao(solicitacao.id)}>
                        Recusar
                      </Button>
                    </div>
                  </div>
                ))}
                
                {substituicoesPendentes.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    Nenhuma solicitação pendente
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
              
              <Button 
                variant="outline" 
                className="h-auto p-4 flex-col space-y-2" 
                onClick={handleVerEscalaDia}
              >
                <Users className="h-6 w-6" />
                <span>Ver Escala do Dia</span>
              </Button>
              
              <Link to="/perfil-usuario">
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
