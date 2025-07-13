
interface Voluntario {
  id: number;
  nome: string;
  sexo: 'masculino' | 'feminino';
  disponibilidade: string[];
  ultimaEscala?: string;
  contadorEscalas: number;
}

interface ConfiguracaoEscala {
  totalVoluntarios: number;
  minimoHomens: number;
  minimoMulheres: number;
  diasSemana: string[];
}

export class EscalaGenerator {
  private voluntarios: Voluntario[] = [];
  private configuracao: ConfiguracaoEscala;

  constructor(voluntarios: Voluntario[], configuracao: ConfiguracaoEscala) {
    this.voluntarios = voluntarios;
    this.configuracao = configuracao;
  }

  gerarEscalaAutomatica(dataInicio: Date, numeroSemanas: number = 4) {
    const escalas = [];
    const voluntariosDisponiveis = [...this.voluntarios];

    for (let semana = 0; semana < numeroSemanas; semana++) {
      for (const dia of this.configuracao.diasSemana) {
        const dataEscala = this.calcularDataPorDia(dataInicio, semana, dia);
        const escala = this.criarEscalaPorDia(voluntariosDisponiveis, dia, dataEscala);
        
        if (escala) {
          escalas.push(escala);
          this.atualizarHistoricoVoluntarios(escala.voluntarios);
        }
      }
    }

    return escalas;
  }

  private criarEscalaPorDia(voluntarios: Voluntario[], dia: string, data: Date) {
    // Filtrar voluntários disponíveis para o dia
    const disponiveisNoDia = voluntarios.filter(v => 
      v.disponibilidade.includes(dia) && 
      !this.verificarSobrecarga(v)
    );

    if (disponiveisNoDia.length < this.configuracao.totalVoluntarios) {
      console.warn(`Voluntários insuficientes para ${dia}`);
      return null;
    }

    // Separar por gênero
    const homens = disponiveisNoDia.filter(v => v.sexo === 'masculino');
    const mulheres = disponiveisNoDia.filter(v => v.sexo === 'feminino');

    // Ordernar por menor número de escalas
    homens.sort((a, b) => a.contadorEscalas - b.contadorEscalas);
    mulheres.sort((a, b) => a.contadorEscalas - b.contadorEscalas);

    const voluntariosSelecionados = [];

    // Selecionar mínimo de homens
    voluntariosSelecionados.push(...homens.slice(0, this.configuracao.minimoHomens));
    
    // Selecionar mínimo de mulheres
    voluntariosSelecionados.push(...mulheres.slice(0, this.configuracao.minimoMulheres));

    // Completar com os demais
    const restantes = this.configuracao.totalVoluntarios - voluntariosSelecionados.length;
    const outrosDisponiveis = disponiveisNoDia
      .filter(v => !voluntariosSelecionados.includes(v))
      .sort((a, b) => a.contadorEscalas - b.contadorEscalas);

    voluntariosSelecionados.push(...outrosDisponiveis.slice(0, restantes));

    return {
      id: Date.now() + Math.random(),
      data: data.toISOString().split('T')[0],
      dia: dia,
      culto: this.definirCulto(dia),
      voluntarios: voluntariosSelecionados.map(v => ({
        id: v.id,
        nome: v.nome,
        funcao: this.definirFuncao()
      })),
      status: 'agendado'
    };
  }

  private verificarSobrecarga(voluntario: Voluntario): boolean {
    // Verificar se o voluntário não está sendo escalado demais
    const mediaEscalas = this.voluntarios.reduce((acc, v) => acc + v.contadorEscalas, 0) / this.voluntarios.length;
    return voluntario.contadorEscalas > mediaEscalas * 1.5;
  }

  private calcularDataPorDia(dataInicio: Date, semana: number, dia: string): Date {
    const diasSemana = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
    const indiceDia = diasSemana.indexOf(dia.toLowerCase());
    const data = new Date(dataInicio);
    data.setDate(data.getDate() + (semana * 7) + indiceDia);
    return data;
  }

  private definirCulto(dia: string): string {
    const cultos: { [key: string]: string } = {
      'domingo': 'Domingo 10h',
      'quarta': 'Quarta 20h',
      'sexta': 'Sexta 20h'
    };
    return cultos[dia.toLowerCase()] || `${dia} - Culto`;
  }

  private definirFuncao(): string {
    const funcoes = ['Recepção', 'Som', 'Mídia', 'Limpeza', 'Segurança'];
    return funcoes[Math.floor(Math.random() * funcoes.length)];
  }

  private atualizarHistoricoVoluntarios(voluntarios: any[]) {
    voluntarios.forEach(vEscala => {
      const voluntario = this.voluntarios.find(v => v.id === vEscala.id);
      if (voluntario) {
        voluntario.contadorEscalas++;
        voluntario.ultimaEscala = new Date().toISOString();
      }
    });
  }
}
