
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

const NovoVoluntario = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    sexo: "",
    celular: "",
    email: "",
    conjuge: "",
    celularConjuge: "",
    lider: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulação de envio para webhook N8N
      const response = await fetch('/webhook/voluntario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Voluntário cadastrado com sucesso!");
        navigate("/voluntarios");
      } else {
        throw new Error('Erro ao cadastrar voluntário');
      }
    } catch (error) {
      toast.error("Erro ao cadastrar voluntário. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/voluntarios")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Novo Voluntário</h1>
            <p className="text-gray-600">Cadastre um novo voluntário</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dados do Voluntário</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dados Pessoais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => handleInputChange("nome", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sexo">Sexo *</Label>
                  <Select 
                    value={formData.sexo} 
                    onValueChange={(value) => handleInputChange("sexo", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o sexo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Masculino">Masculino</SelectItem>
                      <SelectItem value="Feminino">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Contato */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="celular">Celular com WhatsApp *</Label>
                  <Input
                    id="celular"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={formData.celular}
                    onChange={(e) => handleInputChange("celular", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
              </div>

              {/* Dados do Cônjuge */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Dados do Cônjuge (Opcional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="conjuge">Nome do Cônjuge</Label>
                    <Input
                      id="conjuge"
                      value={formData.conjuge}
                      onChange={(e) => handleInputChange("conjuge", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="celularConjuge">Celular do Cônjuge</Label>
                    <Input
                      id="celularConjuge"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={formData.celularConjuge}
                      onChange={(e) => handleInputChange("celularConjuge", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="border-t pt-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="lider"
                    checked={formData.lider}
                    onCheckedChange={(checked) => handleInputChange("lider", checked as boolean)}
                  />
                  <Label htmlFor="lider" className="text-sm font-medium">
                    É líder da escala
                  </Label>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Líderes podem gerenciar escalas e têm prioridade na composição dos cultos
                </p>
              </div>

              {/* Botões */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/voluntarios")}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{loading ? "Salvando..." : "Salvar Voluntário"}</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NovoVoluntario;
