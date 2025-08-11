
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const VoluntarioCadastro = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    nome: "",
    sexo: "",
    celular: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    conjuge: "",
    celularConjuge: "",
    disponibilidade: {
      domingoManha: false,
      domingoNoite: false,
      quarta: false,
      sexta: false,
      vigilia: false
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.senha || formData.senha.length < 6) {
        toast.error("A senha deve ter no mínimo 6 caracteres.");
        setLoading(false);
        return;
      }
      if (formData.senha !== formData.confirmarSenha) {
        toast.error("As senhas não coincidem.");
        setLoading(false);
        return;
      }

      const ok = await register({
        nome: formData.nome,
        email: formData.email,
        password: formData.senha,
        tipo: 'voluntario',
        telefone: formData.celular,
      });

      if (ok) {
        toast.success("Cadastro criado! Verifique seu e-mail para confirmar.");
        // Notificação em tempo real
        window.dispatchEvent(new CustomEvent('broadcastNotification', {
          detail: {
            title: "🆕 Novo Cadastro",
            message: `${formData.nome} se cadastrou como voluntário.`,
            type: "info",
            from: "Sistema"
          }
        }));
        navigate(`/verificacao-enviada?email=${encodeURIComponent(formData.email)}`);
      } else {
        toast.error("E-mail já cadastrado. Tente fazer login ou use outro e-mail.");
      }
    } catch (error) {
      toast.error("Erro ao realizar cadastro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDisponibilidadeChange = (culto: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      disponibilidade: {
        ...prev.disponibilidade,
        [culto]: checked
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <Link to="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cadastro de Voluntário</h1>
            <p className="text-gray-600">Preencha seus dados para se voluntariar</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserPlus className="h-5 w-5" />
              <span>Seus Dados</span>
            </CardTitle>
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
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Senha */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="senha">Senha *</Label>
                  <Input
                    id="senha"
                    type="password"
                    value={formData.senha}
                    onChange={(e) => handleInputChange("senha", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmarSenha">Confirmar Senha *</Label>
                  <Input
                    id="confirmarSenha"
                    type="password"
                    value={formData.confirmarSenha}
                    onChange={(e) => handleInputChange("confirmarSenha", e.target.value)}
                    required
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

              {/* Disponibilidade */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Disponibilidade para Cultos</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="domingoManha"
                      checked={formData.disponibilidade.domingoManha}
                      onCheckedChange={(checked) => handleDisponibilidadeChange("domingoManha", checked as boolean)}
                    />
                    <Label htmlFor="domingoManha">Domingo 10h</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="domingoNoite"
                      checked={formData.disponibilidade.domingoNoite}
                      onCheckedChange={(checked) => handleDisponibilidadeChange("domingoNoite", checked as boolean)}
                    />
                    <Label htmlFor="domingoNoite">Domingo 19h30</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="quarta"
                      checked={formData.disponibilidade.quarta}
                      onCheckedChange={(checked) => handleDisponibilidadeChange("quarta", checked as boolean)}
                    />
                    <Label htmlFor="quarta">Quarta-feira 20h (Culto da Fé)</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sexta"
                      checked={formData.disponibilidade.sexta}
                      onCheckedChange={(checked) => handleDisponibilidadeChange("sexta", checked as boolean)}
                    />
                    <Label htmlFor="sexta">Sexta-feira 20h (Hope)</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="vigilia"
                      checked={formData.disponibilidade.vigilia}
                      onCheckedChange={(checked) => handleDisponibilidadeChange("vigilia", checked as boolean)}
                    />
                    <Label htmlFor="vigilia">Vigília (última sexta do mês - 21h)</Label>
                  </div>
                </div>
              </div>

              {/* Botões */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Link to="/" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Voltar
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center space-x-2"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>{loading ? "Cadastrando..." : "Realizar Cadastro"}</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VoluntarioCadastro;
