
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, RefreshCw, Bell, Users, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import WhatsAppNotifications from "@/components/WhatsAppNotifications";

const Configuracoes = () => {
  const [config, setConfig] = useState({
    maxVoluntarios: 5,
    maxHomens: 2,
    maxMulheres: 3,
    notificacaoWhatsApp: true,
    notificacaoEmail: true,
    lembreteAntecipado: 24,
  });

  const handleSave = () => {
    // Aqui seria enviado para o webhook N8N
    toast.success("Configurações salvas com sucesso!");
  };

  const handleSync = () => {
    // Sincronização com Google Sheets
    toast.success("Sincronização realizada com sucesso!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <Settings className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
            <p className="text-gray-600">Gerencie limites, notificações e automações do sistema</p>
          </div>
        </div>

        <Tabs defaultValue="geral" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="geral" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Configurações Gerais</span>
            </TabsTrigger>
            <TabsTrigger value="whatsapp" className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4" />
              <span>Automação WhatsApp</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="geral" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Limites de Escala */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Limites de Escala</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxVoluntarios">Máximo de Voluntários por Culto</Label>
                    <Input
                      id="maxVoluntarios"
                      type="number"
                      value={config.maxVoluntarios}
                      onChange={(e) => setConfig({...config, maxVoluntarios: parseInt(e.target.value)})}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxHomens">Máximo de Homens</Label>
                    <Input
                      id="maxHomens"
                      type="number"
                      value={config.maxHomens}
                      onChange={(e) => setConfig({...config, maxHomens: parseInt(e.target.value)})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxMulheres">Máximo de Mulheres</Label>
                    <Input
                      id="maxMulheres"
                      type="number"
                      value={config.maxMulheres}
                      onChange={(e) => setConfig({...config, maxMulheres: parseInt(e.target.value)})}
                    />
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
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Switch
                      id="whatsapp"
                      checked={config.notificacaoWhatsApp}
                      onCheckedChange={(checked) => 
                        setConfig({...config, notificacaoWhatsApp: checked})
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email">E-mail</Label>
                    <Switch
                      id="email"
                      checked={config.notificacaoEmail}
                      onCheckedChange={(checked) => 
                        setConfig({...config, notificacaoEmail: checked})
                      }
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="lembrete">Lembrete Antecipado (horas)</Label>
                    <Input
                      id="lembrete"
                      type="number"
                      value={config.lembreteAntecipado}
                      onChange={(e) => 
                        setConfig({...config, lembreteAntecipado: parseInt(e.target.value)})
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Ações */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleSave} className="flex-1">
                Salvar Configurações
              </Button>
              <Button 
                variant="outline" 
                onClick={handleSync}
                className="flex-1 flex items-center justify-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Sincronizar Dados</span>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="whatsapp">
            <WhatsAppNotifications />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Configuracoes;
