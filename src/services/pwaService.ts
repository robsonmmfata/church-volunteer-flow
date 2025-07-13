
interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
}

export class PWAService {
  private registration: ServiceWorkerRegistration | null = null;

  async inicializarPWA(): Promise<boolean> {
    try {
      // Registrar service worker
      if ('serviceWorker' in navigator) {
        this.registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registrado:', this.registration);
      }

      // Solicitar permissão para notificações
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        console.log('Permissão para notificações:', permission);
      }

      return true;
    } catch (error) {
      console.error('Erro ao inicializar PWA:', error);
      return false;
    }
  }

  async enviarNotificacao(options: NotificationOptions): Promise<boolean> {
    try {
      if (!('Notification' in window)) {
        console.log('Notificações não suportadas');
        return false;
      }

      if (Notification.permission !== 'granted') {
        console.log('Permissão para notificações negada');
        return false;
      }

      new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/icon-192x192.png',
        badge: options.badge || '/icon-192x192.png',
        tag: options.tag,
        data: options.data
      });

      return true;
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      return false;
    }
  }

  async agendarNotificacao(options: NotificationOptions, delay: number): Promise<boolean> {
    try {
      setTimeout(() => {
        this.enviarNotificacao(options);
      }, delay);

      return true;
    } catch (error) {
      console.error('Erro ao agendar notificação:', error);
      return false;
    }
  }

  async notificarEscalaProxima(escala: any, minutosAntes: number = 60): Promise<boolean> {
    const dataEscala = new Date(escala.data);
    const agora = new Date();
    const tempoAteEscala = dataEscala.getTime() - agora.getTime();
    const tempoNotificacao = tempoAteEscala - (minutosAntes * 60 * 1000);

    if (tempoNotificacao > 0) {
      return this.agendarNotificacao({
        title: 'Lembrete de Escala',
        body: `Você tem uma escala em ${minutosAntes} minutos: ${escala.culto}`,
        tag: `escala-${escala.id}`,
        data: { escalaId: escala.id, tipo: 'lembrete' }
      }, tempoNotificacao);
    }

    return false;
  }

  async notificarSubstituicao(substituicao: any): Promise<boolean> {
    return this.enviarNotificacao({
      title: 'Nova Solicitação de Substituição',
      body: `${substituicao.solicitante} precisa de substituição para ${substituicao.culto}`,
      tag: `substituicao-${substituicao.id}`,
      data: { substituicaoId: substituicao.id, tipo: 'substituicao' }
    });
  }

  async notificarAprovacao(voluntario: string, escala: string): Promise<boolean> {
    return this.enviarNotificacao({
      title: 'Substituição Aprovada',
      body: `Sua substituição para ${escala} foi aprovada`,
      tag: 'aprovacao',
      data: { tipo: 'aprovacao' }
    });
  }

  verificarSuportePWA(): boolean {
    return 'serviceWorker' in navigator && 'Notification' in window;
  }

  async instalarPrompt(): Promise<boolean> {
    try {
      // @ts-ignore
      if (window.deferredPrompt) {
        // @ts-ignore
        window.deferredPrompt.prompt();
        // @ts-ignore
        const { outcome } = await window.deferredPrompt.userChoice;
        console.log('Resultado da instalação:', outcome);
        // @ts-ignore
        window.deferredPrompt = null;
        return outcome === 'accepted';
      }
      return false;
    } catch (error) {
      console.error('Erro ao mostrar prompt de instalação:', error);
      return false;
    }
  }
}

export const pwaService = new PWAService();
