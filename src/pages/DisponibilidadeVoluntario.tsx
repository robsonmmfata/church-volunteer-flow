
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { ArrowLeft, Calendar as CalendarIcon, Clock, Save } from "lucide-react";
import { toast } from "sonner";

interface HorarioDisponivel {
  dia: string;
  horarios: string[];
  disponivel: boolean;
}

const DisponibilidadeVoluntario = () => {
  const navigate = useNavigate();
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [observacoes, setObservacoes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [disponibilidadeSemanal, setDisponibilidadeSemanal] = useState<HorarioDisponivel[]>([
    {
      dia: "Domingo",
      horarios: ["10:00", "19:30"],
      disponivel: true
    },
    {
      dia: "Segunda-feira", 
      horarios: ["20:00"],
      disponivel: false
    },
    {
      dia: "Terça-feira",
      horarios: ["20:00"],
      disponivel: false
    },
    {
      dia: "Quarta-feira",
      horarios: ["20:00"],
      disponivel: true
    },
    {
      dia: "Quinta-feira",
      horarios: ["20:00"],
      disponivel: false
    },
    {
      dia: "Sexta-feira",
      horarios: ["20:00"],
      disponivel: false
    },
    {
      dia: "Sábado",
      horarios: ["19:30"],
      disponivel: false
    }
  ]);

  const handleDiaChange = (dia: string, disponivel: boolean) => {
    setDisponibilidadeSemanal(prev =>
      prev.map(item =>
        item.dia === dia ? { ...item, disponivel } : item
      )
    );
  };

  const handleSalvar = async () => {
    setIsLoading(true);

    // Simular salvamento
    setTimeout(() => {
      toast.success("Disponibilidade atualizada com sucesso!");
      setIsLoading(false);
      
      // Opcional: voltar para o dashboard
      // navigate(-1);
    }, 1000);
  };

  const diasDisponiveis = disponibilidadeSemanal.filter(d => d.disponivel).length;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Minha Disponibilidade</h1>
            <p className="text-gray-600">Informe quando você está disponível para servir</p>
          </div>
        </div>

        {/* Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Dias Disponíveis</p>
                  <p className="text-2xl font-bold text-green-600">{diasDisponiveis}</p>
                </div>
                <CalendarIcon className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Datas Bloqueadas</p>
                  <p className="text-2xl font-bold text-red-600">{selectedDates.length}</p>
                </div>
                <Clock className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <p className="text-lg font-bold text-blue-600">
                    {diasDisponiveis >= 2 ? "Ativo" : "Limitado"}
                  </p>
                </div>
                <Badge variant={diasDisponiveis >= 2 ? "default" : "secondary"}>
                  {diasDisponiveis >= 2 ? "OK" : "Pouco"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Disponibilidade Semanal */}
          <Card>
            <CardHeader>
              <CardTitle>Disponibilidade Semanal</CardTitle>
              <CardDescription>
                Marque os dias e horários que você está disponível regularmente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {disponibilidadeSemanal.map((item) => (
                  <div key={item.dia} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={item.dia}
                        checked={item.disponivel}
                        onCheckedChange={(checked) => 
                          handleDiaChange(item.dia, checked as boolean)
                        }
                      />
                      <Label htmlFor={item.dia} className="font-medium">
                        {item.dia}
                      </Label>
                    </div>
                    <div className="flex space-x-2">
                      {item.horarios.map((horario) => (
                        <Badge 
                          key={horario} 
                          variant={item.disponivel ? "default" : "secondary"}
                        >
                          {horario}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Label htmlFor="observacoes">Observações sobre Disponibilidade</Label>
                <Textarea
                  id="observacoes"
                  placeholder="Ex: Não posso nos primeiros domingos do mês, prefiro cultos da manhã, etc."
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  className="mt-2"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Datas Específicas Indisponíveis */}
          <Card>
            <CardHeader>
              <CardTitle>Datas Específicas Indisponíveis</CardTitle>
              <CardDescription>
                Selecione datas específicas em que você não poderá servir
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="multiple"
                selected={selectedDates}
                onSelect={setSelectedDates}
                className="rounded-md border"
                disabled={(date) => date < new Date()}
              />
              
              {selectedDates.length > 0 && (
                <div className="mt-4">
                  <Label>Datas Selecionadas:</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedDates.map((date, index) => (
                      <Badge key={index} variant="destructive">
                        {date.toLocaleDateString('pt-BR')}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Botão Salvar */}
        <div className="flex justify-end mt-6">
          <Button onClick={handleSalvar} disabled={isLoading} size="lg">
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Salvando..." : "Salvar Disponibilidade"}
          </Button>
        </div>

        {/* Dicas */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>💡 Dicas Importantes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Mantenha sua disponibilidade sempre atualizada</li>
              <li>• Comunique mudanças com antecedência aos líderes</li>
              <li>• Marque períodos de férias ou viagens com antecedência</li>
              <li>• Em caso de emergência, use o sistema de substituições</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DisponibilidadeVoluntario;
