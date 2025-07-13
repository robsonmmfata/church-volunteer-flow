
interface MetricasVoluntario {
  id: number;
  nome: string;
  totalEscalas: number;
  faltas: number;
  substituicoes: number;
  taxaPresenca: number;
  ultimaParticipacao: string;
}

interface RelatorioMensal {
  mes: string;
  totalEscalas: number;
  totalVoluntarios: number;
  totalSubstituicoes: number;
  taxaPresencaGeral: number;
  voluntarioMaisAtivo: string;
  voluntarioMenosAtivo: string;
}

export class RelatoriosService {
  private escalas: any[] = [];
  private voluntarios: any[] = [];
  private substituicoes: any[] = [];

  constructor(escalas: any[], voluntarios: any[], substituicoes: any[]) {
    this.escalas = escalas;
    this.voluntarios = voluntarios;
    this.substituicoes = substituicoes;
  }

  calcularMetricasGerais() {
    const totalVoluntarios = this.voluntarios.filter(v => v.status === 'ativo').length;
    const escalasEsteMes = this.escalas.filter(e => 
      new Date(e.data).getMonth() === new Date().getMonth()
    ).length;
    const substituicoesPendentes = this.substituicoes.filter(s => s.status === 'pendente').length;
    const taxaPresencaGeral = this.calcularTaxaPresencaGeral();

    return {
      totalVoluntarios,
      escalasEsteMes,
      substituicoesPendentes,
      taxaPresencaGeral: Math.round(taxaPresencaGeral)
    };
  }

  calcularMetricasPorVoluntario(): MetricasVoluntario[] {
    return this.voluntarios.map(voluntario => {
      const escalasVoluntario = this.escalas.filter(e =>
        e.voluntarios.some((v: any) => v.id === voluntario.id)
      );

      const faltasVoluntario = escalasVoluntario.filter(e =>
        e.presencas && !e.presencas[voluntario.id]
      ).length;

      const substituicoesVoluntario = this.substituicoes.filter(s =>
        s.voluntarioOriginalId === voluntario.id || s.voluntarioSubstitutoId === voluntario.id
      ).length;

      const taxaPresenca = escalasVoluntario.length > 0 
        ? ((escalasVoluntario.length - faltasVoluntario) / escalasVoluntario.length) * 100
        : 100;

      const ultimaEscala = escalasVoluntario.sort((a, b) => 
        new Date(b.data).getTime() - new Date(a.data).getTime()
      )[0];

      return {
        id: voluntario.id,
        nome: voluntario.nome,
        totalEscalas: escalasVoluntario.length,
        faltas: faltasVoluntario,
        substituicoes: substituicoesVoluntario,
        taxaPresenca: Math.round(taxaPresenca),
        ultimaParticipacao: ultimaEscala ? ultimaEscala.data : 'Nunca'
      };
    });
  }

  gerarRelatorioMensal(mes: number, ano: number): RelatorioMensal {
    const escalasDoMes = this.escalas.filter(e => {
      const dataEscala = new Date(e.data);
      return dataEscala.getMonth() === mes && dataEscala.getFullYear() === ano;
    });

    const substituicoesDoMes = this.substituicoes.filter(s => {
      const dataSubstituicao = new Date(s.data);
      return dataSubstituicao.getMonth() === mes && dataSubstituicao.getFullYear() === ano;
    });

    const metricas = this.calcularMetricasPorVoluntario();
    const voluntarioMaisAtivo = metricas.reduce((prev, current) => 
      current.totalEscalas > prev.totalEscalas ? current : prev
    );
    const voluntarioMenosAtivo = metricas.reduce((prev, current) => 
      current.totalEscalas < prev.totalEscalas ? current : prev
    );

    return {
      mes: new Date(ano, mes).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
      totalEscalas: escalasDoMes.length,
      totalVoluntarios: this.voluntarios.filter(v => v.status === 'ativo').length,
      totalSubstituicoes: substituicoesDoMes.length,
      taxaPresencaGeral: this.calcularTaxaPresencaGeral(),
      voluntarioMaisAtivo: voluntarioMaisAtivo.nome,
      voluntarioMenosAtivo: voluntarioMenosAtivo.nome
    };
  }

  calcularDistribuicaoPorGenero() {
    const homens = this.voluntarios.filter(v => v.sexo === 'masculino' && v.status === 'ativo');
    const mulheres = this.voluntarios.filter(v => v.sexo === 'feminino' && v.status === 'ativo');

    return {
      homens: homens.length,
      mulheres: mulheres.length,
      total: homens.length + mulheres.length,
      percentualHomens: Math.round((homens.length / (homens.length + mulheres.length)) * 100),
      percentualMulheres: Math.round((mulheres.length / (homens.length + mulheres.length)) * 100)
    };
  }

  calcularFrequenciaPorDia() {
    const frequencia: { [key: string]: number } = {
      'domingo': 0,
      'quarta': 0,
      'sexta': 0
    };

    this.escalas.forEach(escala => {
      const dia = escala.dia?.toLowerCase() || 'domingo';
      if (frequencia[dia] !== undefined) {
        frequencia[dia]++;
      }
    });

    return frequencia;
  }

  private calcularTaxaPresencaGeral(): number {
    if (this.escalas.length === 0) return 100;

    let totalEscalas = 0;
    let totalPresencas = 0;

    this.escalas.forEach(escala => {
      if (escala.voluntarios) {
        totalEscalas += escala.voluntarios.length;
        if (escala.presencas) {
          totalPresencas += Object.values(escala.presencas).filter(Boolean).length;
        } else {
          // Se não há registro de presença, assumir que compareceram
          totalPresencas += escala.voluntarios.length;
        }
      }
    });

    return totalEscalas > 0 ? (totalPresencas / totalEscalas) * 100 : 100;
  }

  exportarRelatorioCSV(metricas: MetricasVoluntario[]): string {
    const headers = ['Nome', 'Total Escalas', 'Faltas', 'Substituições', 'Taxa Presença (%)', 'Última Participação'];
    const csvContent = [
      headers.join(','),
      ...metricas.map(m => [
        m.nome,
        m.totalEscalas,
        m.faltas,
        m.substituicoes,
        m.taxaPresenca,
        m.ultimaParticipacao
      ].join(','))
    ].join('\n');

    return csvContent;
  }

  baixarRelatorio(filename: string, content: string) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
