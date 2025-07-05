
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, 
  Users, 
  Sync, 
  Bell, 
  Database,
  Save,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";

const Configuracoes = () => {
  const [loading, setLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  
  // Estados das configurações
  const [config, setConfig] = useState({
    maxVoluntarios: 5,
    minHomens: 2,
    minMulheres: 3,
    notificacaoWhatsapp: true,
    notificacaoEmail: true,
    lembreteAutomatico: true,
    horasAntecedencia: 24,
    webhookN8N: "https://webhook.n8n.cloud/sua-instancia",
    sheetId: "1ABC123...",
    autoApproval: false
  });

  const handleConfigChange = (field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    
    try {
      // Simulação de envio para API/webhook
      const response = await fetch('/webhook/configuracoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        toast.success("Configurações salvas com sucesso!");
      } else {
        throw new Error('Erro ao salvar configurações');
      }
    } catch (error) {
      toast.error("Erro ao salvar configurações. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncLoading(true);
    
    try {
      // Simulação de sincronização com Google Sheets/N8N
      const response = await fetch('/webhook/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: 'sync',
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        toast.success("Sincronização concluída com sucesso!");
      } else {
        throw new Error('Erro na sincronização');
      }
    } catch (error) {
      toast.error("Erro na sincronização. Verifique as conexões.");
    } finally {
      setSyncLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600">Gerencie as configurações do sistema</p>
        </div>

        <div className="space-y-6">
          {/* Regras de Escala */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Regras de Escala</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxVoluntarios">Máximo de Voluntários</Label>
                  <Input
                    id="maxVoluntarios"
                    type="number"
                    min="3"
                    max="10"
                    value={config.maxVoluntarios}
                    onChange={(e) => handleConfigChange("maxVoluntarios", parseInt(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="minHomens">Mínimo de Homens</Label>
                  <Input
                    id="minHomens"
                    type="number"
                    min="0"
                    max="5"
                    value={config.minHomens}
                    onChange={(e) => handleConfigChange("minHomens", parseInt(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="minMulheres">Mínimo de Mulheres</Label>
                  <Input
                    id="minMulheres"
                    type="number"
                    min="0"
                    max="5"
                    value={config.minMulheres}
                    onChange={(e) => handleConfigChange("minMulheres", parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Configuração atual:</strong> Máximo de {config.maxVoluntarios} voluntários por escala, 
                  sendo pelo menos {config.minHomens} homens e {config.minMulheres} mulheres.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Notificações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notificações</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">WhatsApp</Label>
                  <p className="text-sm text-gray-500">
                    Enviar notificações via WhatsApp
                  </p>
                </div>
                <Switch
                  checked={config.notificacaoWhatsapp}
                  onCheckedChange={(checked) => handleConfigChange("notificacaoWhatsapp", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">E-mail</Label>
                  <p className="text-sm text-gray-500">
                    Enviar notificações por e-mail
                  </p>
                </div>
                <Switch
                  checked={config.notificacaoEmail}
                  onCheckedChange={(checked) => handleConfigChange("notificacaoEmail", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Lembretes Automáticos</Label>
                  <p className="text-sm text-gray-500">
                    Enviar lembretes antes dos cultos
                  </p>
                </div>
                <Switch
                  checked={config.lembreteAutomatico}
                  onCheckedChange={(checked) => handleConfigChange("lembreteAutomatico", checked)}
                />
              </div>

              {config.lembreteAutomatico && (
                <div className="ml-6 space-y-2">
                  <Label htmlFor="horasAntecedencia">Horas de Antecedência</Label>
                  <Input
                    id="horasAntecedencia"
                    type="number"
                    min="1"
                    max="72"
                    value={config.horasAntecedencia}
                    onChange={(e) => handleConfigChange("horasAntecedencia", parseInt(e.target.value))}
                    className="w-32"
                  />
                  <p className="text-sm text-gray-500">
                    Enviar lembrete {config.horasAntecedencia} horas antes do culto
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Integrações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Integrações</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhookN8N">Webhook N8N</Label>
                <Input
                  id="webhookN8N"
                  value={config.webhookN8N}
                  onChange={(e) => handleConfigChange("webhookN8N", e.target.value)}
                  placeholder="https://webhook.n8n.cloud/sua-instancia"
                />
                <p className="text-sm text-gray-500">
                  URL do webhook do N8N para automações
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sheetId">ID da Planilha Google</Label>
                <Input
                  id="sheetId"
                  value={config.sheetId}
                  onChange={(e) => handleConfigChange("sheetId", e.target.value)}
                  placeholder="1ABC123DEF456..."
                />
                <p className="text-sm text-gray-500">
                  ID da planilha Google Sheets para sincronização
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Aprovação Automática</Label>
                  <p className="text-sm text-gray-500">
                    Aprovar substituições automaticamente quando há substituto
                  </p>
                </div>
                <Switch
                  checked={config.autoApproval}
                  onCheckedChange={(checked) => handleConfigChange("autoApproval", checked)}
                />
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleSync}
                  disabled={syncLoading}
                  variant="outline"
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <RefreshCw className={`h-4 w-4 ${syncLoading ? 'animate-spin' : ''}`} />
                  <span>{syncLoading ? "Sincronizando..." : "Sincronizar com Google Sheets"}</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Botão Salvar */}
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? "Salvando..." : "Salvar Configurações"}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;
