
export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface EmailData {
  to: string;
  cc?: string[];
  bcc?: string[];
  subject: string;
  html: string;
  text: string;
}

class EmailService {
  private apiUrl = '/api/email';

  async enviarEmail(emailData: EmailData): Promise<boolean> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      return response.ok;
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      return false;
    }
  }

  async enviarConfirmacaoEscala(voluntario: any, escala: any): Promise<boolean> {
    const template = this.criarTemplateConfirmacao(voluntario, escala);
    
    return this.enviarEmail({
      to: voluntario.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  async enviarLembrete(voluntarios: any[], escala: any): Promise<boolean[]> {
    const template = this.criarTemplateLembrete(escala);
    const promises = voluntarios.map(voluntario =>
      this.enviarEmail({
        to: voluntario.email,
        subject: template.subject,
        html: template.html.replace('{{nome}}', voluntario.nome),
        text: template.text.replace('{{nome}}', voluntario.nome),
      })
    );

    return Promise.all(promises);
  }

  async enviarAprovacaoSubstituicao(voluntario: any, substituicao: any): Promise<boolean> {
    const template = this.criarTemplateAprovacao(voluntario, substituicao);
    
    return this.enviarEmail({
      to: voluntario.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  async enviarRejeicaoSubstituicao(voluntario: any, substituicao: any): Promise<boolean> {
    const template = this.criarTemplateRejeicao(voluntario, substituicao);
    
    return this.enviarEmail({
      to: voluntario.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  private criarTemplateConfirmacao(voluntario: any, escala: any): EmailTemplate {
    return {
      subject: `Confirmação de Escala - ${escala.culto}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Confirmação de Escala</h2>
          <p>Olá <strong>${voluntario.nome}</strong>,</p>
          <p>Você foi escalado para o seguinte culto:</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Data:</strong> ${new Date(escala.data).toLocaleDateString('pt-BR')}</p>
            <p><strong>Culto:</strong> ${escala.culto}</p>
            <p><strong>Função:</strong> ${voluntario.funcao || 'Voluntário'}</p>
          </div>
          <p>Por favor, confirme sua presença através do sistema ou entre em contato conosco.</p>
          <p>Que Deus te abençoe!</p>
        </div>
      `,
      text: `Olá ${voluntario.nome}, você foi escalado para ${escala.culto} no dia ${new Date(escala.data).toLocaleDateString('pt-BR')}. Por favor, confirme sua presença.`,
    };
  }

  private criarTemplateLembrete(escala: any): EmailTemplate {
    return {
      subject: `Lembrete: Escala ${escala.culto}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">Lembrete de Escala</h2>
          <p>Olá <strong>{{nome}}</strong>,</p>
          <p>Este é um lembrete da sua escala:</p>
          <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
            <p><strong>Data:</strong> ${new Date(escala.data).toLocaleDateString('pt-BR')}</p>
            <p><strong>Culto:</strong> ${escala.culto}</p>
            <p><strong>Horário:</strong> Chegue 30 minutos antes</p>
          </div>
          <p>Não esqueça de confirmar sua presença no sistema!</p>
          <p>Esperamos você!</p>
        </div>
      `,
      text: `Lembrete: {{nome}}, você tem escala no ${escala.culto} dia ${new Date(escala.data).toLocaleDateString('pt-BR')}.`,
    };
  }

  private criarTemplateAprovacao(voluntario: any, substituicao: any): EmailTemplate {
    return {
      subject: 'Substituição Aprovada',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Substituição Aprovada</h2>
          <p>Olá <strong>${voluntario.nome}</strong>,</p>
          <p>Sua solicitação de substituição foi <strong style="color: #16a34a;">APROVADA</strong>:</p>
          <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Data:</strong> ${new Date(substituicao.data).toLocaleDateString('pt-BR')}</p>
            <p><strong>Culto:</strong> ${substituicao.culto}</p>
          </div>
          <p>Você está liberado dessa escala.</p>
          <p>Obrigado por avisar com antecedência!</p>
        </div>
      `,
      text: `${voluntario.nome}, sua substituição para ${substituicao.culto} foi aprovada.`,
    };
  }

  private criarTemplateRejeicao(voluntario: any, substituicao: any): EmailTemplate {
    return {
      subject: 'Substituição Rejeitada',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Substituição Rejeitada</h2>
          <p>Olá <strong>${voluntario.nome}</strong>,</p>
          <p>Infelizmente, sua solicitação de substituição foi <strong style="color: #dc2626;">REJEITADA</strong>:</p>
          <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Data:</strong> ${new Date(substituicao.data).toLocaleDateString('pt-BR')}</p>
            <p><strong>Culto:</strong> ${substituicao.culto}</p>
          </div>
          <p>Por favor, mantenha sua escala original ou entre em contato para mais informações.</p>
          <p>Obrigado pela compreensão!</p>
        </div>
      `,
      text: `${voluntario.nome}, sua substituição para ${substituicao.culto} foi rejeitada. Mantenha sua escala original.`,
    };
  }
}

export const emailService = new EmailService();
