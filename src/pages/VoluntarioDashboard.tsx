import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, CheckCircle, User2, ChevronRight, Check } from "lucide-react";
import { format, isPast, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from "@/contexts/AuthContext";
import { useEscalas } from "@/contexts/EscalasContext";
import { useNotifications } from '@/hooks/useNotifications';

const VoluntarioDashboard = () => {
  const { user } = useAuth();
  const { escalas, confirmarPresenca } = useEscalas();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const [escalasDoVoluntario, setEscalasDoVoluntario] = useState([]);
  const [loadingPresenca, setLoadingPresenca] = useState({});

  useEffect(() => {
    if (user && escalas) {
      const escalasFiltradas = escalas.filter(escala =>
        escala.voluntarios.some(voluntario => voluntario.id === user.id)
      );
      setEscalasDoVoluntario(escalasFiltradas);
    }
  }, [user, escalas]);

  const handleConfirmarPresenca = async (escalaId: string) => {
    setLoadingPresenca(prev => ({ ...prev, [escalaId]: true }));
    
    try {
      await confirmarPresenca(escalaId, user!.id);
      toast.success("Presença confirmada com sucesso!");
      
      // Adicionar notificação
      addNotification({
        title: "Presença Confirmada",
        message: "Sua presença foi confirmada na escala",
        type: "success"
      });
    } catch (error) {
      toast.error("Erro ao confirmar presença");
    } finally {
      setLoadingPresenca(prev => ({ ...prev, [escalaId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Olá, {user?.nome}!
            </h1>
            <p className="text-gray-600">
              Bem-vindo ao seu painel de voluntário
            </p>
          </div>
        </div>

        {/* Próximas Escalas */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5" />
              <span>Suas Próximas Escalas</span>
            </CardTitle>
            <CardDescription>
              Confirme sua presença nas próximas atividades
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {escalasDoVoluntario.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-500">
                  Nenhuma escala agendada para você no momento.
                </p>
              </div>
            ) : (
              escalasDoVoluntario.map((escala) => (
                <div
                  key={escala.id}
                  className="border rounded-md p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">{escala.tipo}</h3>
                      <p className="text-gray-500">
                        {format(new Date(escala.data), 'dd/MM/yyyy', { locale: ptBR })}
                      </p>
                      <p className="text-gray-500">{escala.local}</p>
                    </div>
                    <div>
                      {isPast(new Date(escala.data)) ? (
                        <CheckCircle className="text-green-500 h-6 w-6" />
                      ) : (
                        <Button 
                          size="sm"
                          onClick={() => handleConfirmarPresenca(escala.id)}
                          disabled={loadingPresenca[escala.id]}
                        >
                          {loadingPresenca[escala.id] ? (
                            <>
                              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Confirmando...
                            </>
                          ) : (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              Confirmar Presença
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Ações Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User2 className="h-5 w-5" />
              <span>Ações Rápidas</span>
            </CardTitle>
            <CardDescription>
              Acesse rapidamente as funcionalidades mais utilizadas
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button variant="outline" className="justify-between" onClick={() => navigate("/voluntario/perfil")}>
              <span>Meu Perfil</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="justify-between" onClick={() => navigate("/voluntario/disponibilidade")}>
              <span>Minha Disponibilidade</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="justify-between" onClick={() => navigate("/voluntario/solicitar-substituicao")}>
              <span>Solicitar Substituição</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VoluntarioDashboard;
