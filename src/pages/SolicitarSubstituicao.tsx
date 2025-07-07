
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, Clock, User, Calendar } from "lucide-react";
import { toast } from "sonner";

interface MinhaEscala {
  id: string;
  data: string;
  culto: string;
  funcao: string;
  status: "confirmado" | "pendente";
}

const SolicitarSubstituicao = () => {
  const navigate = useNavigate();
  const [selectedEscala, setSelectedEscala] = useState("");
  const [motivo, setMotivo] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [substitutoSugerido, setSubstitutoSugerido] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Mock das minhas escalas
  const minhasEscalas: MinhaEscala[] = [
    {
      id: "1",
      data: "2024-01-14",
      culto: "Domingo 10h",
      funcao: "Portaria",
      status: "confirmado"
    },
    {
      id: "2", 
      data: "2024-01-21",
      culto: "Domingo 19h30",
      funcao: "Recepção",
      status: "confirmado"
    },
    {
      id: "3",
      data: "2024-01-24",
      culto: "Quarta 20h (Culto da Fé)",
      funcao: "Portaria",
      status: "confirmado"
    }
  ];

  // Mock dos voluntários disponíveis
  const voluntariosDisponiveis = [
    "Pedro Lima",
    "Maria Santos", 
    "João Silva",
    "Ana Costa",
    "Carlos Oliveira"
  ];

  const handleSolicitar = async () => {
    if (!selectedEscala || !motivo) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setIsLoading(true);

    // Encontrar a escala selecionada
    const escala = minhasEscalas.find(e => e.id === selectedEscala);
    
    // Simular envio da solicitação
    setTimeout(() => {
      toast.success("Solicitação enviada com sucesso!");
      toast.info("Você receberá uma notificação quando alguém aceitar sua solicitação");
      
      // Opcional: Enviar notificação via webhook
      // sendNotificationToLeaders(escala, motivo, substitutoSugerido);
      
      setIsLoading(false);
      navigate(-1);
    }, 1500);
  };

  const formatarData = (dataString: string) => {
    return new Date(dataString).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };

  const escalaSelecionada = minhasEscalas.find(e => e.id === selectedEscala);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Solicitar Substituição</h1>
            <p className="text-gray-600">Solicite um substituto para uma de suas escalas</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário Principal */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Nova Solicitação</CardTitle>
                <CardDescription>
                  Preencha os dados para solicitar um substituto
                </CardDescription>  
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Seleção da Escala */}
                <div>
                  <Label>Para qual escala você precisa de substituto?</Label>
                  <Select value={selectedEscala} onValueChange={setSelectedEscala}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Selecione uma escala" />
                    </SelectTrigger>
                    <SelectContent>
                      {minhasEscalas.map((escala) => (
                        <SelectItem key={escala.id} value={escala.id}>
                          <div className="flex items-center space-x-2">
                            <span>{escala.culto}</span>
                            <Badge variant="outline">{escala.funcao}</Badge>
                            <span className="text-sm text-gray-500">
                              - {new Date(escala.data).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Detalhes da Escala Selecionada */}
                {escalaSelecionada && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-blue-900">
                          {formatarData(escalaSelecionada.data)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-blue-700">
                        <span>Culto: {escalaSelecionada.culto}</span>
                        <span>Função: {escalaSelecionada.funcao}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Motivo */}
                <div>
                  <Label htmlFor="motivo">Motivo da solicitação *</Label>
                  <Textarea
                    id="motivo"
                    placeholder="Ex: Viagem de trabalho, compromisso familiar, problema de saúde..."
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    className="mt-2"
                    rows={3}
                  />
                </div>

                {/* Substituto Sugerido */}
                <div>
                  <Label>Você gostaria de sugerir alguém? (Opcional)</Label>
                  <Select value={substitutoSugerido} onValueChange={setSubstitutoSugerido}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Selecione um voluntário (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {voluntariosDisponiveis.map((voluntario) => (
                        <SelectItem key={voluntario} value={voluntario}>
                          {voluntario}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500 mt-1">
                    Se você já conversou com alguém, pode sugerir aqui
                  </p>
                </div>

                {/* Observações */}
                <div>
                  <Label htmlFor="observacoes">Observações Adicionais</Label>
                  <Textarea
                    id="observacoes"
                    placeholder="Informações extras que podem ajudar..."
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    className="mt-2"
                    rows={2}
                  />
                </div>

                {/* Botão Enviar */}
                <div className="flex justify-end pt-4">
                  <Button 
                    onClick={handleSolicitar} 
                    disabled={isLoading || !selectedEscala || !motivo}
                    size="lg"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isLoading ? "Enviando..." : "Enviar Solicitação"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Minhas Escalas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Minhas Próximas Escalas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {minhasEscalas.map((escala) => (
                    <div key={escala.id} className="p-3 border rounded-lg text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{escala.culto}</span>
                        <Badge variant="outline">{escala.funcao}</Badge>
                      </div>
                      <div className="text-gray-600">
                        {new Date(escala.data).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Dicas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Dicas Importantes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Solicite com pelo menos 3 dias de antecedência</li>
                  <li>• Seja claro sobre o motivo da ausência</li>
                  <li>• Se possível, sugira um substituto</li>
                  <li>• Mantenha contato com a liderança</li>
                  <li>• Você receberá notificação da resposta</li>
                </ul>
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Como Funciona</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">1</div>
                    <span>Você faz a solicitação</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-bold text-xs">2</div>
                    <span>Liderança avalia e notifica outros voluntários</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-xs">3</div>
                    <span>Substituto aceita e você é notificado</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolicitarSubstituicao;
