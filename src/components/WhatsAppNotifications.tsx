
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, Send, Settings, TestTube } from "lucide-react";
import { toast } from "sonner";

const WhatsAppNotifications = () => {
  const [config, setConfig] = useState({
    webhookUrl: "",
    apiKey: "",
    enabled: true,
    templates: {
      lembrete: "Olá {nome}! Lembre-se que você está escalado para o culto de {culto} no dia {data}. Confirme sua presença.",
      convocacao: "Olá {nome}! Você foi convocado para participar da escala de {culto} no dia {data}. Por favor, confirme sua disponibilidade.",
      aprovacao: "Olá {nome}! Sua solicitação de substituição para {culto} foi aprovada.",
      rejeicao: "Olá {nome}! Sua solicitação de substituição para {culto} foi rejeitada."
    }
  });

  const [testMessage, setTestMessage] = useState({
    numero: "",
    mensagem: "Teste de envio automático do sistema de escalas."
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSaveConfig = async () => {
    setIsLoading(true);
    
    try {
      // Simular salvamento das configurações
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Salvar no localStorage ou enviar para API
      localStorage.setItem('whatsapp-config', JSON.stringify(config));
      
      toast.success("Configurações do WhatsApp salvas com sucesso!");
      console.log("Configurações salvas:", config);
      
    } catch (error) {
      toast.error("Erro ao salvar configurações");
      console.error("Erro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestMessage = async () => {
    if (!testMessage.numero || !testMessage.mensagem) {
      toast.error("Preencha o número e a mensagem para teste");
      return;
    }

    if (!config.webhookUrl) {
      toast.error("Configure o webhook URL primeiro");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(config.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(config.apiKey && { 'Authorization': `Bearer ${config.apiKey}` })
        },
        body: JSON.stringify({
          numero: testMessage.numero.replace(/\D/g, ''),
          mensagem: testMessage.mensagem,
          teste: true
        })
      });

      if (response.ok) {
        toast.success("Mensagem de teste enviada com sucesso!");
        console.log("Teste enviado para:", testMessage.numero);
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      toast.error("Erro ao enviar mensagem de teste");
      console.error("Erro no teste:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendBulkReminders = async () => {
    if (!config.webhookUrl) {
      toast.error("Configure o webhook URL primeiro");
      return;
    }

    setIsLoading(true);

    try {
      // Simular envio em massa
      const voluntarios = [
        { nome: "João Silva", numero: "11999999999", culto: "Domingo 10h", data: "07/01/2024" },
        { nome: "Maria Santos", numero: "11888888888", culto: "Domingo 19h30", data: "07/01/2024" },
        { nome: "Pedro Lima", numero: "11777777777", culto: "Quarta 20h", data: "10/01/2024" }
      ];

      for (const voluntario of voluntarios) {
        const mensagem = config.templates.lembrete
          .replace('{nome}', voluntario.nome)
          .replace('{culto}', voluntario.culto)
          .replace('{data}', voluntario.data);

        await fetch(config.webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(config.apiKey && { 'Authorization': `Bearer ${config.apiKey}` })
          },
          body: JSON.stringify({
            numero: voluntario.numero,
            mensagem: mensagem
          })
        });

        // Delay entre envios para evitar spam
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      toast.success(`Lembretes enviados para ${voluntarios.length} voluntários!`);
      console.log("Lembretes enviados em massa");

    } catch (error) {
      toast.error("Erro ao enviar lembretes em massa");
      console.error("Erro no envio em massa:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Configurações de Conexão */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Configuração da API WhatsApp</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="enabled">Ativar notificações WhatsApp</Label>
            <Switch
              id="enabled"
              checked={config.enabled}
              onCheckedChange={(checked) => 
                setConfig({...config, enabled: checked})
              }
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="webhookUrl">Webhook URL *</Label>
            <Input
              id="webhookUrl"
              placeholder="https://hooks.zapier.com/hooks/catch/..."
              value={config.webhookUrl}
              onChange={(e) => setConfig({...config, webhookUrl: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key (opcional)</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Sua chave de API"
              value={config.apiKey}
              onChange={(e) => setConfig({...config, apiKey: e.target.value})}
            />
          </div>
        </CardContent>
      </Card>

      {/* Templates de Mensagem */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Templates de Mensagem</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="lembrete">Lembrete de Escala</Label>
            <Textarea
              id="lembrete"
              value={config.templates.lembrete}
              onChange={(e) => setConfig({
                ...config, 
                templates: {...config.templates, lembrete: e.target.value}
              })}
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">
              Use: {'{nome}'}, {'{culto}'}, {'{data}'}
            </p>
          </div>

          <div>
            <Label htmlFor="convocacao">Convocação</Label>
            <Textarea
              id="convocacao"
              value={config.templates.convocacao}
              onChange={(e) => setConfig({
                ...config, 
                templates: {...config.templates, convocacao: e.target.value}
              })}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="aprovacao">Aprovação de Substituição</Label>
            <Textarea
              id="aprovacao"
              value={config.templates.aprovacao}
              onChange={(e) => setConfig({
                ...config, 
                templates: {...config.templates, aprovacao: e.target.value}
              })}
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="rejeicao">Rejeição de Substituição</Label>
            <Textarea
              id="rejeicao"
              value={config.templates.rejeicao}
              onChange={(e) => setConfig({
                ...config, 
                templates: {...config.templates, rejeicao: e.target.value}
              })}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Teste de Envio */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TestTube className="h-5 w-5" />
            <span>Teste de Envio</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="testNumero">Número para teste</Label>
              <Input
                id="testNumero"
                placeholder="11999999999"
                value={testMessage.numero}
                onChange={(e) => setTestMessage({...testMessage, numero: e.target.value})}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="testMensagem">Mensagem de teste</Label>
            <Textarea
              id="testMensagem"
              value={testMessage.mensagem}
              onChange={(e) => setTestMessage({...testMessage, mensagem: e.target.value})}
              rows={3}
            />
          </div>

          <Button 
            onClick={handleTestMessage}
            disabled={isLoading || !config.enabled}
            className="w-full"
          >
            <Send className="h-4 w-4 mr-2" />
            {isLoading ? "Enviando..." : "Enviar Teste"}
          </Button>
        </CardContent>
      </Card>

      {/* Ações em Massa */}
      <Card>
        <CardHeader>
          <CardTitle>Ações em Massa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={handleSendBulkReminders}
              disabled={isLoading || !config.enabled}
              variant="outline"
              className="h-auto p-4 flex-col space-y-2"
            >
              <MessageCircle className="h-6 w-6" />
              <span>Enviar Lembretes para Todos</span>
            </Button>

            <Button 
              onClick={() => toast.info("Funcionalidade em desenvolvimento")}
              disabled={isLoading || !config.enabled}
              variant="outline"
              className="h-auto p-4 flex-col space-y-2"
            >
              <Send className="h-6 w-6" />
              <span>Convocar Disponíveis</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Salvar Configurações */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSaveConfig}
          disabled={isLoading}
          className="min-w-32"
        >
          {isLoading ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>
    </div>
  );
};

export default WhatsAppNotifications;
