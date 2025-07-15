import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  UserCheck,
  MessageCircle,
  Phone,
  Bell
} from "lucide-react";

interface Voluntario {
  id: number;
  nome: string;
  celular: string;
  status: string;
}

const LiderDashboard = () => {
  const { user, logout } = useAuth();
  const { escalas, updateEscala } = useEscalas();
  const navigate = useNavigate();

  // Filtrar escalas onde o usuário é líder
  const minhasEscalas = escalas.filter(escala => escala.lider === user?.nome);

  const [substituicoesPendentes, setSubstituicoesPendentes] = useState([
    { 
      id: 1,
      data: "2024-01-21", 
      culto: "Domingo 10h", 
      solicitante: "Maria Santos", 
      motivo: "Viagem de trabalho" 
    }
  ]);

  // Lista completa de voluntários do sistema
  const [voluntariosEquipe] = useState<Voluntario[]>([
    { id: 1, nome: "João Silva", celular: "11999999999", status: "ativo" },
    { id: 2, nome: "Maria Santos", celular: "11888888888", status: "ativo" },
    { id: 3, nome: "Pedro Lima", celular: "11777777777", status: "inativo" },
    { id: 4, nome: "Ana Costa", celular: "11666666666", status: "ativo" },
    { id: 5, nome: "Carlos Oliveira", celular: "11555555555", status: "ativo" },
    { id: 6, nome: "Lucia Santos", celular: "11444444444", status: "ativo" },
    { id: 7, nome: "Rafael Pereira", celular: "11333333333", status: "inativo" },
    { id: 8, nome: "Julia Costa", celular: "11222222222", status: "ativo" },
  ]);

  // Estados para modais
  const [isConvocarModalOpen, setIsConvocarModalOpen] = useState(false);
  const [isAvisosModalOpen, setIsAvisosModalOpen] = useState(false);
  const [selectedVoluntarios, setSelectedVoluntarios] = useState<number[]>([]);
  const [mensagemAviso, setMensagemAviso] = useState("");

  // Monitorar mudanças nas escalas para notificar
  useEffect(() => {
    const escalasMaisRecentes = escalas.filter(escala => {
      if (!escala.ultimaModificacao) return false;
      const ultimaModificacao = new Date(escala.ultimaModificacao);
      const agora = new Date();
      const diferencaMinutos = (agora.getTime() - ultimaModificacao.getTime()) / (1000 * 60);
      return diferencaMinutos < 1 && escala.criadoPor === 'admin'; // Notificar apenas alterações do admin
    });

    if (escalasMaisRecentes.length > 0) {
      toast.info(`${escalasMaisRecentes.length} escala(s) foram atualizadas pelo administrador`, {
        duration: 5000,
        action: {
          label: "Ver",
          onClick: () => navigate('/lider/escalas')
        }
      });
    }
  }, [escalas, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success("Logout realizado com sucesso");
  };

  const handleAprovarSubstituicao = (id: number) => {
    setSubstituicoesPendentes(prev => prev.filter(sub => sub.id !== id));
    
    toast.success("Substituição aprovada com sucesso");
    
    console.log("Substituição aprovada pelo líder:", id);
  };

  const handleRecusarSubstituicao = (id: number) => {
    setSubstituicoesPendentes(prev => prev.filter(sub => sub.id !== id));
    
    toast.error("Substituição recusada");
    
    console.log("Substituição recusada pelo líder:", id);
  };

  const handleContatar = (nome: string, celular: string) => {
    const numeroLimpo = celular.replace(/\D/g, '');
    const url = `https://wa.me/55${numeroLimpo}?text=Olá ${nome}, tudo bem? Sou o líder da escala.`;
    window.open(url, '_blank');
    
    toast.success(`Contato iniciado com ${nome}`);
  };

  const handleOpenConvocarModal = () => {
    setSelectedVoluntarios([]);
    setIsConvocarModalOpen(true);
  };

  const handleOpenAvisosModal = () => {
    setSelectedVoluntarios([]);
    setMensagemAviso("📢 Aviso importante: Lembrete sobre as próximas escalas. Mantenha-se atento às suas responsabilidades. Qualquer dúvida, entre em contato.");
    setIsAvisosModalOpen(true);
  };

  const handleVoluntarioSelection = (voluntarioId: number, checked: boolean) => {
    if (checked) {
      setSelectedVoluntarios(prev => [...prev, voluntarioId]);
    } else {
      setSelectedVoluntarios(prev => prev.filter(id => id !== voluntarioId));
    }
  };

  const handleConvocarSelecionados = () => {
    if (selectedVoluntarios.length === 0) {
      toast.error("Selecione pelo menos um voluntário");
      return;
    }

    const voluntariosSelecionados = voluntariosEquipe.filter(v => 
      selectedVoluntarios.includes(v.id) && v.status === 'ativo'
    );

    // Enviar mensagem via WhatsApp para cada voluntário selecionado
    voluntariosSelecionados.forEach((voluntario, index) => {
      const numeroLimpo = voluntario.celular.replace(/\D/g, '');
      const mensagem = `Olá ${voluntario.nome}! Você foi convocado para uma nova escala. Por favor, confirme sua disponibilidade. Atenciosamente, ${user?.nome || 'Líder'}`;
      const url = `https://wa.me/55${numeroLimpo}?text=${encodeURIComponent(mensagem)}`;
      
      // Abrir WhatsApp Web em nova aba para cada voluntário
      setTimeout(() => {
        window.open(url, '_blank');
      }, 1000 * index); // Delay de 1 segundo entre cada abertura
    });

    // Notificar voluntários através do sistema
    const notificacoes = JSON.parse(localStorage.getItem('voluntario_notifications') || '[]');
    voluntariosSelecionados.forEach(voluntario => {
      notificacoes.push(`Você foi convocado pelo líder ${user?.nome} para uma nova escala`);
    });
    localStorage.setItem('voluntario_notifications', JSON.stringify(notificacoes));

    toast.success(`${voluntariosSelecionados.length} voluntários foram convocados via WhatsApp e notificados no sistema`);
    
    setIsConvocarModalOpen(false);
    setSelectedVoluntarios([]);
  };

  const handleEnviarAvisosSelecionados = () => {
    if (selectedVoluntarios.length === 0) {
      toast.error("Selecione pelo menos um voluntário");
      return;
    }

    if (!mensagemAviso.trim()) {
      toast.error("Digite uma mensagem para enviar");
      return;
    }

    const voluntariosSelecionados = voluntariosEquipe.filter(v => 
      selectedVoluntarios.includes(v.id) && v.status === 'ativo'
    );

    // Enviar aviso personalizado para cada voluntário selecionado
    voluntariosSelecionados.forEach((voluntario, index) => {
      const numeroLimpo = voluntario.celular.replace(/\D/g, '');
      const mensagemCompleta = `${mensagemAviso}\n\nAtenciosamente, ${user?.nome || 'Líder'}`;
      const url = `https://wa.me/55${numeroLimpo}?text=${encodeURIComponent(mensagemCompleta)}`;
      
      // Abrir WhatsApp Web em nova aba para cada voluntário
      setTimeout(() => {
        window.open(url, '_blank');
      }, 1500 * index); // Delay de 1.5 segundos entre cada abertura
    });

    // Notificar voluntários através do sistema
    const notificacoes = JSON.parse(localStorage.getItem('voluntario_notifications') || '[]');
    voluntariosSelecionados.forEach(voluntario => {
      notificacoes.push(`📢 Novo aviso do líder ${user?.nome}: ${mensagemAviso}`);
    });
    localStorage.setItem('voluntario_notifications', JSON.stringify(notificacoes));

    toast.success(`Avisos enviados para ${voluntariosSelecionados.length} voluntários via WhatsApp e sistema de notificações`);
    
    setIsAvisosModalOpen(false);
    setSelectedVoluntarios([]);
    setMensagemAviso("");
  };

  const handleEditarEscala = (escalaId: number) => {
    const escala = escalas.find(e => e.id === escalaId);
    if (escala) {
      // Simulação de edição pelo líder
      const updatedData = {
        ...escala,
        voluntarios: escala.voluntarios.length < 5 
          ? [...escala.voluntarios, "Novo Voluntário"]
          : escala.voluntarios.slice(0, 4)
      };
      
      updateEscala(escalaId, { 
        voluntarios: updatedData.voluntarios,
        status: updatedData.voluntarios.length === 5 ? "Completa" : "Incompleta"
      }, 'lider');
      
      toast.success("Escala atualizada! Voluntários foram notificados.");
    }
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
                Olá, {user?.nome || 'Líder'}
              </span>
              <p className="text-sm text-gray-600">Painel do Líder</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notificações
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Escalas do Mês</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{minhasEscalas.length}</div>
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
              <div className="text-2xl font-bold">{substituicoesPendentes.length}</div>
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
                {voluntariosEquipe.filter(v => v.status === 'ativo').length}
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
          <Card>
            <CardHeader>
              <CardTitle>Minhas Escalas como Líder</CardTitle>
              <CardDescription>
                Cultos onde você é o líder responsável
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
                        {escala.voluntarios.length} voluntários escalados
                      </p>
                      {escala.modificadoPor === 'admin' && (
                        <Badge variant="outline" className="mt-1">
                          <Bell className="h-3 w-3 mr-1" />
                          Atualizada pelo Admin
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={escala.status === 'Completa' ? 'default' : 'destructive'}>
                        {escala.status === 'Completa' ? (
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
                
                {minhasEscalas.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    Nenhuma escala onde você é líder no momento
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Substituições Pendentes</CardTitle>
              <CardDescription>
                Solicitações que precisam da sua aprovação
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
                
                {substituicoesPendentes.length === 0 && (
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
              {voluntariosEquipe.map((voluntario) => (
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
              <Link to="/lider/escalas">
                <Button className="h-auto p-4 flex-col space-y-2 w-full">
                  <Calendar className="h-6 w-6" />
                  <span>Gerenciar Escalas</span>
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                className="h-auto p-4 flex-col space-y-2" 
                onClick={handleOpenConvocarModal}
              >
                <Users className="h-6 w-6" />
                <span>Convocar Voluntários</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-4 flex-col space-y-2" 
                onClick={handleOpenAvisosModal}
              >
                <MessageCircle className="h-6 w-6" />
                <span>Enviar Avisos</span>
              </Button>
              
              <Link to="/perfil-usuario">
                <Button variant="outline" className="h-auto p-4 flex-col space-y-2 w-full">
                  <Settings className="h-6 w-6" />
                  <span>Configurações</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal Convocar Voluntários */}
      <Dialog open={isConvocarModalOpen} onOpenChange={setIsConvocarModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Convocar Voluntários</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Selecione os voluntários que deseja convocar via WhatsApp:
            </p>
            <div className="space-y-3">
              {voluntariosEquipe.map((voluntario) => (
                <div key={voluntario.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={selectedVoluntarios.includes(voluntario.id)}
                      onCheckedChange={(checked) => 
                        handleVoluntarioSelection(voluntario.id, checked as boolean)
                      }
                      disabled={voluntario.status === 'inativo'}
                    />
                    <div>
                      <p className="font-medium">{voluntario.nome}</p>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {voluntario.celular}
                      </p>
                    </div>
                  </div>
                  <Badge variant={voluntario.status === 'ativo' ? 'default' : 'secondary'}>
                    {voluntario.status}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="flex space-x-2 pt-4">
              <Button 
                onClick={handleConvocarSelecionados}
                disabled={selectedVoluntarios.length === 0}
                className="flex-1"
              >
                Convocar Selecionados ({selectedVoluntarios.length})
              </Button>
              <Button 
                variant="outline"
                onClick={() => setIsConvocarModalOpen(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Enviar Avisos */}
      <Dialog open={isAvisosModalOpen} onOpenChange={setIsAvisosModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Enviar Avisos</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="mensagem">Mensagem do Aviso</Label>
              <Textarea
                id="mensagem"
                value={mensagemAviso}
                onChange={(e) => setMensagemAviso(e.target.value)}
                rows={4}
                placeholder="Digite sua mensagem aqui..."
              />
            </div>
            <p className="text-sm text-gray-600">
              Selecione os voluntários que receberão o aviso via WhatsApp:
            </p>
            <div className="space-y-3">
              {voluntariosEquipe.map((voluntario) => (
                <div key={voluntario.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={selectedVoluntarios.includes(voluntario.id)}
                      onCheckedChange={(checked) => 
                        handleVoluntarioSelection(voluntario.id, checked as boolean)
                      }
                      disabled={voluntario.status === 'inativo'}
                    />
                    <div>
                      <p className="font-medium">{voluntario.nome}</p>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {voluntario.celular}
                      </p>
                    </div>
                  </div>
                  <Badge variant={voluntario.status === 'ativo' ? 'default' : 'secondary'}>
                    {voluntario.status}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="flex space-x-2 pt-4">
              <Button 
                onClick={handleEnviarAvisosSelecionados}
                disabled={selectedVoluntarios.length === 0 || !mensagemAviso.trim()}
                className="flex-1"
              >
                Enviar para Selecionados ({selectedVoluntarios.length})
              </Button>
              <Button 
                variant="outline"
                onClick={() => setIsAvisosModalOpen(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LiderDashboard;
