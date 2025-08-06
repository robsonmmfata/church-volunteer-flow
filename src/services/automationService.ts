import { toast } from "sonner";

export class AutomationService {
  static instance: AutomationService;

  constructor() {
    if (AutomationService.instance) {
      return AutomationService.instance;
    }
    AutomationService.instance = this;
  }

  // Função para enviar notificações em tempo real para todos os usuários
  static broadcastNotification(notification: {
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    from?: string;
  }) {
    window.dispatchEvent(new CustomEvent('broadcastNotification', {
      detail: {
        ...notification,
        from: notification.from || "Sistema"
      }
    }));
  }

  // Função para enviar lembretes via WhatsApp
  static async enviarLembreteWhatsApp(voluntarios: any[], escala: any) {
    try {
      voluntarios.forEach(voluntario => {
        const mensagem = `Olá ${voluntario.nome}! Lembre-se que você está escalado para ${escala.tipo} no dia ${escala.data}. Confirme sua presença!`;
        const telefone = voluntario.telefone?.replace(/\D/g, '') || '';
        
        if (telefone) {
          const whatsappUrl = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
          // Em ambiente real, isso seria enviado via API
          console.log(`Lembrete enviado para ${voluntario.nome}: ${whatsappUrl}`);
        }
      });

      this.broadcastNotification({
        title: "📱 Lembretes Enviados",
        message: `Lembretes via WhatsApp enviados para ${voluntarios.length} voluntários.`,
        type: "success"
      });

      toast.success(`Lembretes enviados para ${voluntarios.length} voluntários!`);
      return true;
    } catch (error) {
      console.error("Erro ao enviar lembretes:", error);
      toast.error("Erro ao enviar lembretes via WhatsApp");
      return false;
    }
  }

  // Função para sincronizar dados com Google Sheets
  static async sincronizarGoogleSheets(dados: any) {
    try {
      const payload = {
        escalas: dados.escalas || [],
        voluntarios: dados.voluntarios || [],
        timestamp: new Date().toISOString(),
        action: "sync"
      };

      // Simular envio para webhook do Google Sheets
      console.log("Sincronizando com Google Sheets:", payload);
      
      // Em ambiente real, seria:
      // await fetch(webhookUrl, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload)
      // });

      this.broadcastNotification({
        title: "📊 Sincronização Concluída",
        message: "Dados sincronizados com Google Sheets com sucesso.",
        type: "success"
      });

      toast.success("Sincronização com Google Sheets concluída!");
      return true;
    } catch (error) {
      console.error("Erro na sincronização:", error);
      toast.error("Erro ao sincronizar com Google Sheets");
      return false;
    }
  }

  // Função para notificar sobre novas escalas
  static notificarNovaEscala(escala: any) {
    this.broadcastNotification({
      title: "📅 Nova Escala Criada",
      message: `Escala para ${escala.tipo} do dia ${escala.data} foi criada.`,
      type: "info"
    });
  }

  // Função para notificar sobre atualizações de escala
  static notificarAtualizacaoEscala(escala: any) {
    this.broadcastNotification({
      title: "✏️ Escala Atualizada",
      message: `Escala do dia ${escala.data} foi atualizada.`,
      type: "info"
    });
  }

  // Função para notificar sobre remoções
  static notificarRemocaoEscala(escala: any) {
    this.broadcastNotification({
      title: "🗑️ Escala Removida",
      message: `Escala do dia ${escala.data} foi removida.`,
      type: "warning"
    });
  }
}

export const automationService = new AutomationService();