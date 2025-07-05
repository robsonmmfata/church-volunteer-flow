
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, CalendarIcon, Users, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const NovaEscala = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date>();
  const [selectedCulto, setSelectedCulto] = useState("");
  const [selectedLider, setSelectedLider] = useState("");
  const [selectedVoluntarios, setSelectedVoluntarios] = useState<string[]>([]);

  // Mock data - Em produção, viria de uma API
  const cultos = [
    "Domingo 10h",
    "Domingo 19h30",
    "Quarta 20h (Culto da Fé)",
    "Sexta 20h (Hope)",
    "Vigília 21h (Última sexta do mês)"
  ];

  const lideres = [
    { id: "1", nome: "João Silva", sexo: "Masculino", conjuge: "Maria Silva" },
    { id: "2", nome: "Ana Santos", sexo: "Feminino", conjuge: "" },
    { id: "3", nome: "Carlos Oliveira", sexo: "Masculino", conjuge: "Lucia Oliveira" }
  ];

  const voluntarios = [
    { id: "1", nome: "Pedro Costa", sexo: "Masculino" },
    { id: "2", nome: "Julia Santos", sexo: "Feminino" },
    { id: "3", nome: "Ricardo Lima", sexo: "Masculino" },
    { id: "4", nome: "Fernanda Silva", sexo: "Feminino" },
    { id: "5", nome: "Marcos Oliveira", sexo: "Masculino" },
    { id: "6", nome: "Carla Costa", sexo: "Feminino" },
    { id: "7", nome: "Daniel Santos", sexo: "Masculino" },
    { id: "8", nome: "Patricia Lima", sexo: "Feminino" }
  ];

  const handleVoluntarioChange = (voluntarioId: string, checked: boolean) => {
    if (checked && selectedVoluntarios.length >= 5) {
      toast.error("Máximo de 5 voluntários por escala");
      return;
    }

    setSelectedVoluntarios(prev => 
      checked 
        ? [...prev, voluntarioId]
        : prev.filter(id => id !== voluntarioId)
    );
  };

  const validateComposition = () => {
    const selected = voluntarios.filter(v => selectedVoluntarios.includes(v.id));
    const homens = selected.filter(v => v.sexo === "Masculino").length;
    const mulheres = selected.filter(v => v.sexo === "Feminino").length;
    
    return {
      totalOk: selected.length === 5,
      compositionOk: homens === 2 && mulheres === 3,
      homens,
      mulheres
    };
  };

  const validation = validateComposition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !selectedCulto || !selectedLider || selectedVoluntarios.length !== 5) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (!validation.compositionOk) {
      toast.error("A composição deve ter exatamente 2 homens e 3 mulheres");
      return;
    }

    setLoading(true);

    try {
      const escalaData = {
        data: format(date, 'yyyy-MM-dd'),
        culto: selectedCulto,
        lider: selectedLider,
        voluntarios: selectedVoluntarios
      };

      const response = await fetch('/webhook/escala', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(escalaData),
      });

      if (response.ok) {
        toast.success("Escala criada com sucesso!");
        navigate("/escalas");
      } else {
        throw new Error('Erro ao criar escala');
      }
    } catch (error) {
      toast.error("Erro ao criar escala. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/escalas")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nova Escala</h1>
            <p className="text-gray-600">Crie uma nova escala de voluntários</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dados Básicos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5" />
                  <span>Dados Básicos</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Data do Culto *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Selecione uma data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Culto *</Label>
                  <Select value={selectedCulto} onValueChange={setSelectedCulto}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o culto" />
                    </SelectTrigger>
                    <SelectContent>
                      {cultos.map((culto) => (
                        <SelectItem key={culto} value={culto}>
                          {culto}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Líder *</Label>
                  <Select value={selectedLider} onValueChange={setSelectedLider}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o líder" />
                    </SelectTrigger>
                    <SelectContent>
                      {lideres.map((lider) => (
                        <SelectItem key={lider.id} value={lider.nome}>
                          {lider.nome} {lider.conjuge && `e ${lider.conjuge}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Composição da Escala */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Composição</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">
                        {validation.homens}
                      </p>
                      <p className="text-sm text-blue-600">Homens</p>
                      <p className="text-xs text-gray-500">Meta: 2</p>
                    </div>
                    <div className="bg-pink-50 p-3 rounded-lg">
                      <p className="text-2xl font-bold text-pink-600">
                        {validation.mulheres}
                      </p>
                      <p className="text-sm text-pink-600">Mulheres</p>
                      <p className="text-xs text-gray-500">Meta: 3</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">
                        {selectedVoluntarios.length}
                      </p>
                      <p className="text-sm text-green-600">Total</p>
                      <p className="text-xs text-gray-500">Meta: 5</p>
                    </div>
                  </div>

                  {!validation.compositionOk && selectedVoluntarios.length > 0 && (
                    <div className="flex items-center space-x-2 p-3 bg-yellow-50 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <p className="text-sm text-yellow-800">
                        Composição incorreta: precisa de exatamente 2 homens e 3 mulheres
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Seleção de Voluntários */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Voluntários * (Selecione exatamente 5)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {voluntarios.map((voluntario) => (
                  <div
                    key={voluntario.id}
                    className={cn(
                      "flex items-center space-x-3 p-3 rounded-lg border",
                      selectedVoluntarios.includes(voluntario.id) 
                        ? "bg-blue-50 border-blue-200" 
                        : "bg-white"
                    )}
                  >
                    <Checkbox
                      id={voluntario.id}
                      checked={selectedVoluntarios.includes(voluntario.id)}
                      onCheckedChange={(checked) => 
                        handleVoluntarioChange(voluntario.id, checked as boolean)
                      }
                    />
                    <div className="flex-1">
                      <Label htmlFor={voluntario.id} className="cursor-pointer">
                        <p className="font-medium">{voluntario.nome}</p>
                        <p className="text-sm text-gray-500">{voluntario.sexo}</p>
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/escalas")}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !validation.totalOk || !validation.compositionOk}
              className="flex-1 flex items-center justify-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? "Salvando..." : "Criar Escala"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NovaEscala;
