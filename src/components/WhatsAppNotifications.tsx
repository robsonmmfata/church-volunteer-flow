
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Settings, Webhook } from "lucide-react";
import { toast } from "sonner";

interface NotificationTemplate {
  id: string;
  name: string;
  message: string;
  active: boolean;
  type: "escala" | "substituicao" | "lembrete" | "geral";
}

const WhatsAppNotifications = () => {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [testNumber, setTestNumber] = useState("");
  
  const [templates, setTemplates] = useState<NotificationTemplate[]>([
    {
      id: "1",
      name: "Nova Escala",
      message: "Olá {nome}! Você foi escalado para o culto {culto} no dia {data}. Confirme sua presença.",
      active: true,
      type: "escala"
    },
    {
      id: "2", 
      name: "Solicitação de Substituição",
      message: "Olá {nome}! {solicitante} precisa de um substituto para o culto {culto} no dia {data}. Você pode ajudar?",
      active: true,
      type: "substituicao"
    },
    {
      id: "3",
      name: "Lembrete de Culto",
      message: "Lembrete: Você está escalado para o culto {culto} hoje às {horario}. Te esperamos!",
      active: true,
      type: "lembrete"
    }
  ]);

  const sendTestNotification = async () => {
    if (!webhookUrl || !testNumber) {
      toast.error("Preencha a URL do webhook e o número para teste");
      return;
    }

    setIsLoading(true);
    console.log("Enviando notificação de teste via webhook:", webhookUrl);

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          action: "send_whatsapp",
          to: testNumber,
          message: "🙏 Teste de notificação do sistema de escalas da igreja! Se você recebeu esta mensagem, a integração está funcionando perfeitamente.",
          timestamp: new Date().toISOString(),
          type: "test"
        }),
      });

      toast.success("Notificação de teste enviada! Verifique o WhatsApp do número informado.");
      console.log("Webhook chamado com sucesso");
    } catch (error) {
      console.error("Erro ao enviar notificação:", error);
      toast.error("Erro ao enviar notificação. Verifique a URL do webhook.");
    } finally {
      setIsLoading(false);
    }
  };

  const sendNotificationToUser = async (phoneNumber: string, message: string, type: string) => {
    if (!webhookUrl) {
      console.error("Webhook URL não configurada");
      return false;
    }

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          action: "send_whatsapp",
          to: phoneNumber,
          message: message,
          timestamp: new Date().toISOString(),
          type: type
        }),
      });
      
      console.log(`Notificação ${type} enviada para ${phoneNumber}`);
      return true;
    } catch (error) {
      console.error("Erro ao enviar notificação:", error);
      return false;
    }
  };

  const toggleTemplate = (id: string) => {
    setTemplates(prev => 
      prev.map(template => 
        template.id === id 
          ? { ...template, active: !template.active }
          : template
      )
    );
    toast.success("Template atualizado!");
  };

  const saveWebhookUrl = () => {
    if (!webhookUrl) {
      toast.error("Digite uma URL válida");
      return;
    }
    
    // Salvar no localStorage para persistir
    localStorage.setItem('whatsapp_webhook_url', webhookUrl);
    toast.success("URL do webhook salva com sucesso!");
  };

  const loadWebhookUrl = () => {
    const savedUrl = localStorage.getItem('whatsapp_webhook_url');
    if (savedUrl) {
      setWebhookUrl(savedUrl);
      toast.info("URL do webhook carregada");
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "escala": return "bg-blue-100 text-blue-800";
      case "substituicao": return "bg-yellow-100 text-yellow-800";
      case "lembrete": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Carregar URL salva quando o componente carrega
  useState(() => {
    loadWebhookUrl();
  });

  return (
    <div className="space-y-6">
      {/* Configuração do Webhook */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Webhook className="h-5 w-5" />
            <span>Configuração do Webhook</span>
          </CardTitle>
          <CardDescription>
            Configure a URL do webhook para integrar com Zapier, Make ou outros serviços
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="webhook-url">URL do Webhook</Label>
            <div className="flex space-x-2">
              <Input
                id="webhook-url"
                type="url"
                placeholder="https://hooks.zapier.com/hooks/catch/..."
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="flex-1"
              />
              <Button onClick={saveWebhookUrl} variant="outline">
                Salvar
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Cole aqui a URL do webhook fornecida pelo Zapier, Make ou seu serviço escolhido
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="test-number">Número para Teste</Label>
              <Input
                id="test-number"
                placeholder="5511999999999"
                value={testNumber}
                onChange={(e) => setTestNumber(e.target.value)}
              />
              <p className="text-sm text-gray-500 mt-1">
                Número com código do país (ex: 5511999999999)
              </p>
            </div>
            
            <div className="flex items-end">
              <Button 
                onClick={sendTestNotification}
                disabled={isLoading || !webhookUrl || !testNumber}
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                {isLoading ? "Enviando..." : "Enviar Teste"}
              </Button>
            </div>
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
          <CardDescription>
            Configure os templates automáticos de mensagens WhatsApp
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {templates.map((template) => (
              <div key={template.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-medium">{template.name}</h4>
                    <Badge className={getTypeColor(template.type)}>
                      {template.type}
                    </Badge>
                  </div>
                  <Switch
                    checked={template.active}
                    onCheckedChange={() => toggleTemplate(template.id)}
                  />
                </div>
                <Textarea
                  value={template.message}
                  readOnly
                  className="text-sm bg-gray-50"
                  rows={2}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Variáveis disponíveis: {"{nome}, {culto}, {data}, {horario}, {solicitante}"}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Status da Integração */}
      <Card>
        <CardHeader>
          <CardTitle>Status da Integração</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Webhook URL:</span>
              <Badge variant={webhookUrl ? "default" : "destructive"}>
                {webhookUrl ? "Configurado" : "Não Configurado"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Templates Ativos:</span>
              <Badge variant="default">
                {templates.filter(t => t.active).length} de {templates.length}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instruções de Configuração */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Como Configurar</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose text-sm">
            <h4 className="font-medium mb-2">Passo a passo para Zapier:</h4>
            <ol className="list-decimal list-inside space-y-1">
              <li>Acesse zapier.com e crie uma nova automação (Zap)</li>
              <li>Escolha "Webhooks by Zapier" como trigger</li>
              <li>Selecione "Catch Hook" e copie a URL fornecida</li>
              <li>Cole a URL no campo acima e clique em "Salvar"</li>
              <li>Configure a ação para enviar WhatsApp (Twilio, ChatAPI, etc.)</li>
              <li>Teste a integração usando o botão "Enviar Teste"</li>
            </ol>
            
            <h4 className="font-medium mb-2 mt-4">Dados enviados no webhook:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li><code>action</code>: Tipo de ação (send_whatsapp)</li>
              <li><code>to</code>: Número do destinatário</li>
              <li><code>message</code>: Mensagem a ser enviada</li>
              <li><code>type</code>: Tipo da notificação</li>
              <li><code>timestamp</code>: Data e hora do envio</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsAppNotifications;
