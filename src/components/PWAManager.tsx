
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { pwaService } from "@/services/pwaService";
import { emailService } from "@/services/emailService";
import { 
  Smartphone, 
  Bell, 
  Download, 
  Mail, 
  Send,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";

const PWAManager = () => {
  const [isPWASupported, setIsPWASupported] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [emailConfig, setEmailConfig] = useState({
    lembretes: true,
    confirmacoes: true,
    aprovacoes: true
  });

  useEffect(() => {
    inicializarPWA();
    verificarPermissoes();
  }, []);

  const inicializarPWA = async () => {
    const suportado = pwaService.verificarSuportePWA();
    setIsPWASupported(suportado);

    if (suportado) {
      await pwaService.inicializarPWA();
    }

    // Verificar se pode instalar
    // @ts-ignore
    setCanInstall(!!window.deferredPrompt);
  };

  const verificarPermissoes = () => {
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  };

  const handleInstalarApp = async () => {
    const instalado = await pwaService.instalarPrompt();
    if (instalado) {
      toast.success("App instalado com sucesso!");
      setCanInstall(false);
    } else {
      toast.error("Não foi possível instalar o app");
    }
  };

  const handleToggleNotifications = async () => {
    if (!notificationsEnabled) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        toast.success("Notificações ativadas!");
      } else {
        toast.error("Permissão para notificações negada");
      }
    } else {
      setNotificationsEnabled(false);
      toast.info("Notificações desativadas");
    }
  };

  const handleTestarNotificacao = async () => {
    const sucesso = await pwaService.enviarNotificacao({
      title: "Teste de Notificação",
      body: "Se você está vendo isso, as notificações estão funcionando!"
    });

    if (sucesso) {
      toast.success("Notificação de teste enviada!");
    } else {
      toast.error("Erro ao enviar notificação de teste");
    }
  };

  const handleTestarEmail = async () => {
    const sucesso = await emailService.enviarEmail({
      to: "teste@exemplo.com",
      subject: "Teste do Sistema de E-mail",
      html: "<p>Este é um e-mail de teste do sistema de escalas.</p>",
      text: "Este é um e-mail de teste do sistema de escalas."
    });

    if (sucesso) {
      toast.success("E-mail de teste enviado!");
    } else {
      toast.error("Erro ao enviar e-mail de teste");
    }
  };

  const handleConfigEmail = (tipo: string, valor: boolean) => {
    setEmailConfig(prev => ({
      ...prev,
      [tipo]: valor
    }));
    toast.success(`Configuração de ${tipo} atualizada!`);
  };

  return (
    <div className="space-y-6">
      {/* Status PWA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Smartphone className="h-5 w-5" />
            <span>Progressive Web App (PWA)</span>
          </CardTitle>
          <CardDescription>
            Funcionalidades mobile e offline
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Suporte PWA</p>
              <p className="text-sm text-gray-600">
                {isPWASupported ? "Totalmente suportado" : "Não suportado"}
              </p>
            </div>
            <Badge variant={isPWASupported ? "default" : "destructive"}>
              {isPWASupported ? <CheckCircle className="h-3 w-3 mr-1" /> : null}
              {isPWASupported ? "Ativo" : "Inativo"}
            </Badge>
          </div>

          {canInstall && (
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium">Instalar App</p>
                <p className="text-sm text-gray-600">
                  Instale o app no seu dispositivo para acesso rápido
                </p>
              </div>
              <Button onClick={handleInstalarApp} className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Instalar</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notificações Push */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notificações Push</span>
          </CardTitle>
          <CardDescription>
            Receba lembretes e avisos importantes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Ativar Notificações</p>
              <p className="text-sm text-gray-600">
                Lembretes de escalas e substituições
              </p>
            </div>
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={handleToggleNotifications}
            />
          </div>

          {notificationsEnabled && (
            <Button 
              variant="outline" 
              onClick={handleTestarNotificacao}
              className="flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>Testar Notificação</span>
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Sistema de E-mail */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Sistema de E-mail</span>
          </CardTitle>
          <CardDescription>
            Configurações de notificações por e-mail
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Lembretes de Escala</p>
                <p className="text-sm text-gray-600">
                  Enviar lembretes 24h antes da escala
                </p>
              </div>
              <Switch
                checked={emailConfig.lembretes}
                onCheckedChange={(checked) => handleConfigEmail('lembretes', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Confirmações</p>
                <p className="text-sm text-gray-600">
                  Enviar confirmação quando escalado
                </p>
              </div>
              <Switch
                checked={emailConfig.confirmacoes}
                onCheckedChange={(checked) => handleConfigEmail('confirmacoes', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Aprovações/Rejeições</p>
                <p className="text-sm text-gray-600">
                  Notificar sobre substituições
                </p>
              </div>
              <Switch
                checked={emailConfig.aprovacoes}
                onCheckedChange={(checked) => handleConfigEmail('aprovacoes', checked)}
              />
            </div>
          </div>

          <Button 
            variant="outline" 
            onClick={handleTestarEmail}
            className="flex items-center space-x-2"
          >
            <Send className="h-4 w-4" />
            <span>Testar E-mail</span>
          </Button>
        </CardContent>
      </Card>

      {/* Funcionalidades Offline */}
      <Card>
        <CardHeader>
          <CardTitle>Funcionalidades Offline</CardTitle>
          <CardDescription>
            O que funciona sem internet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="font-medium text-green-800">✓ Visualizar escalas</p>
              <p className="text-sm text-green-600">Escalas já carregadas</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="font-medium text-green-800">✓ Ver perfil</p>
              <p className="text-sm text-green-600">Dados pessoais</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="font-medium text-yellow-800">~ Criar substituições</p>
              <p className="text-sm text-yellow-600">Salvo localmente</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <p className="font-medium text-red-800">✗ Notificações</p>
              <p className="text-sm text-red-600">Requer conexão</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PWAManager;
