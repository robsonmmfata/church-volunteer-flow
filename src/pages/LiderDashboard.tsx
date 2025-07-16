import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, CheckCircle2, UserPlus, Send, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEscalas } from "@/contexts/EscalasContext";
import { format, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { useNotifications } from '@/hooks/useNotifications';

const LiderDashboard = () => {
  const { user } = useAuth();
  const { escalas, voluntarios, atualizarEscala } = useEscalas();
  const navigate = useNavigate();
  const [loadingWhatsApp, setLoadingWhatsApp] = useState(false);
  const [loadingConfirmacao, setLoadingConfirmacao] = useState(false);
  const { addNotification } = useNotifications();

  // Filtrar escalas futuras e ordenar por data
  const escalasFuturas = escalas
    .filter(escala => !isPast(new Date(escala.data)))
    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
    .slice(0, 3); // Mostrar apenas as próximas 3 escalas

  // Contagem de voluntários por tipo
  const totalVoluntarios = voluntarios.length;
  const totalLideres = voluntarios.filter(v => v.tipo === 'lider').length;
  const totalVoluntariosComuns = totalVoluntarios - totalLideres;

  const enviarWhatsApp = (telefone: string, mensagem: string, tipo: 'convocacao' | 'aviso' = 'convocacao') => {
    setLoadingWhatsApp(true);
    
    // Formatar a mensagem para URL
    const mensagemFormatada = encodeURIComponent(mensagem);
    
    // Construir o link do WhatsApp
    const linkWhatsApp = `https://wa.me/${telefone}?text=${mensagemFormatada}`;

    // Abrir o link em uma nova aba
    window.open(linkWhatsApp, '_blank');
    
    setLoadingWhatsApp(false);
    
    // Adicionar notificação local
    addNotification({
      title: tipo === 'convocacao' ? "Convocação Enviada" : "Aviso Enviado",
      message: `Mensagem enviada via WhatsApp com sucesso`,
      type: "success"
    });
  };

  const handleConfirmarVoluntario = async (escalaId: string, voluntarioId: string) => {
    setLoadingConfirmacao(true);
    try {
      // Encontrar a escala e o voluntário
      const escala = escalas.find(e => e.id === escalaId);
      const voluntario = escala?.voluntarios.find(v => v.id === voluntarioId);
  
      if (escala && voluntario) {
        // Atualizar o status de confirmação do voluntário
        const voluntariosAtualizados = escala.voluntarios.map(v =>
          v.id === voluntarioId ? { ...v, confirmado: true } : v
        );
  
        // Atualizar a escala com os voluntários atualizados
        const escalaAtualizada = { ...escala, voluntarios: voluntariosAtualizados };
  
        // Chamar a função para atualizar a escala no contexto
        await atualizarEscala(escalaAtualizada);
  
        toast.success("Voluntário confirmado com sucesso!");
      } else {
        toast.error("Escala ou voluntário não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao confirmar voluntário:", error);
      toast.error("Erro ao confirmar voluntário. Tente novamente.");
    } finally {
      setLoadingConfirmacao(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Olá, {user?.nome}!
          </h1>
          <p className="text-gray-600">
            Bem-vindo ao painel do líder. Aqui está um resumo das suas atividades.
          </p>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Voluntários</CardTitle>
              <CardDescription>Total de voluntários cadastrados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalVoluntarios}</div>
              <div className="mt-2 text-sm text-gray-500">
                <UserPlus className="h-4 w-4 inline-block mr-1" />
                {totalLideres} líderes | {totalVoluntariosComuns} voluntários
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Próximas Escalas</CardTitle>
              <CardDescription>Suas próximas atividades</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{escalasFuturas.length}</div>
              <div className="mt-2 text-sm text-gray-500">
                <CalendarDays className="h-4 w-4 inline-block mr-1" />
                {escalasFuturas.length > 0 ? (
                  `Próxima em ${format(new Date(escalasFuturas[0].data), 'dd/MM/yyyy', { locale: ptBR })}`
                ) : (
                  "Nenhuma escala futura"
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Avisos Urgentes</CardTitle>
              <CardDescription>Notificações importantes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-500">0</div>
              <div className="mt-2 text-sm text-gray-500">
                <AlertTriangle className="h-4 w-4 inline-block mr-1" />
                Nenhum aviso urgente no momento
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Próximas Escalas */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Próximas Escalas</h2>
          {escalasFuturas.length > 0 ? (
            <div className="space-y-4">
              {escalasFuturas.map((escala) => (
                <Card key={escala.id}>
                  <CardHeader>
                    <CardTitle>{escala.tipo} - {format(new Date(escala.data), 'dd/MM/yyyy', { locale: ptBR })}</CardTitle>
                    <CardDescription>
                      Local: {escala.local || "Não especificado"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-2">
                      Líder: {escala.lider}
                    </p>
                    <Separator className="my-2" />
                    <h3 className="text-lg font-semibold mb-2">Voluntários:</h3>
                    <div className="space-y-2">
                      {escala.voluntarios.map((voluntario) => (
                        <div key={voluntario.id} className="flex items-center justify-between">
                          <div>
                            <span className="font-medium">{voluntario.nome}</span>
                            <Badge
                              variant={voluntario.confirmado ? "outline" : "secondary"}
                              className="ml-2"
                            >
                              {voluntario.confirmado ? "Confirmado" : "Pendente"}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            {!voluntario.confirmado && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleConfirmarVoluntario(escala.id, voluntario.id)}
                                disabled={loadingConfirmacao}
                              >
                                {loadingConfirmacao ? "Confirmando..." : (
                                  <>
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    Confirmar
                                  </>
                                )}
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const mensagem = `Olá ${voluntario.nome}, você está escalado para o culto de ${escala.tipo} no dia ${format(new Date(escala.data), 'dd/MM/yyyy', { locale: ptBR })}. Confirme sua presença!`;
                                enviarWhatsApp(voluntario.telefone || '', mensagem, 'convocacao');
                              }}
                              disabled={loadingWhatsApp}
                            >
                              {loadingWhatsApp ? "Enviando..." : (
                                <>
                                  <Send className="h-4 w-4 mr-2" />
                                  WhatsApp
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Nenhuma escala futura encontrada.</p>
          )}
        </div>

        {/* Ações Rápidas */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => navigate("/admin/escalas/nova")}>
              <CardContent className="flex items-center space-x-4">
                <CalendarDays className="h-6 w-6 text-blue-500" />
                <div>
                  <h3 className="font-semibold text-lg">Criar Nova Escala</h3>
                  <p className="text-gray-500">Adicione uma nova escala ao sistema</p>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => navigate("/admin/voluntarios/novo")}>
              <CardContent className="flex items-center space-x-4">
                <UserPlus className="h-6 w-6 text-green-500" />
                <div>
                  <h3 className="font-semibold text-lg">Adicionar Voluntário</h3>
                  <p className="text-gray-500">Cadastre um novo membro para as escalas</p>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => navigate("/admin/substituicoes")}>
              <CardContent className="flex items-center space-x-4">
                <AlertTriangle className="h-6 w-6 text-orange-500" />
                <div>
                  <h3 className="font-semibold text-lg">Gerenciar Substituições</h3>
                  <p className="text-gray-500">Veja as solicitações de substituição</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiderDashboard;
