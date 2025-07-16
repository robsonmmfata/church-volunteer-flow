
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEscalas } from '@/contexts/EscalasContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Download, Calendar, Users, Clock, TrendingUp } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const RelatoriosEscalas = () => {
  const { escalas } = useEscalas();

  // Calcular estatísticas das escalas
  const calcularEstatisticas = () => {
    const agora = new Date();
    const escalasPassadas = escalas.filter(e => new Date(e.data) < agora);
    const escalasRealizadas = escalasPassadas.filter(e => e.status === 'realizada');
    const escalasCanceladas = escalasPassadas.filter(e => e.status === 'cancelada');

    const totalVoluntariosEscalados = escalas.reduce((acc, e) => acc + e.voluntarios.length, 0);
    const totalConfirmacoes = escalas.reduce((acc, e) => 
      acc + e.voluntarios.filter(v => v.confirmado).length, 0
    );

    return {
      totalEscalas: escalas.length,
      escalasRealizadas: escalasRealizadas.length,
      escalasCanceladas: escalasCanceladas.length,
      taxaRealizacao: escalasPassadas.length > 0 ? 
        Math.round((escalasRealizadas.length / escalasPassadas.length) * 100) : 0,
      mediaVoluntariosPorEscala: Math.round(totalVoluntariosEscalados / escalas.length),
      taxaConfirmacao: totalVoluntariosEscalados > 0 ? 
        Math.round((totalConfirmacoes / totalVoluntariosEscalados) * 100) : 0
    };
  };

  const estatisticas = calcularEstatisticas();

  // Dados para gráfico mensal
  const ultimosSeisMeses = eachMonthOfInterval({
    start: subMonths(new Date(), 5),
    end: new Date()
  });

  const dadosMensais = ultimosSeisMeses.map(mes => {
    const inicioMes = startOfMonth(mes);
    const fimMes = endOfMonth(mes);
    
    const escalasDoMes = escalas.filter(escala => {
      const dataEscala = new Date(escala.data);
      return dataEscala >= inicioMes && dataEscala <= fimMes;
    });

    const realizadas = escalasDoMes.filter(e => e.status === 'realizada').length;
    const canceladas = escalasDoMes.filter(e => e.status === 'cancelada').length;

    return {
      mes: format(mes, 'MMM/yy', { locale: ptBR }),
      escalas: escalasDoMes.length,
      realizadas,
      canceladas,
      voluntarios: escalasDoMes.reduce((acc, e) => acc + e.voluntarios.length, 0)
    };
  });

  // Dados por tipo de culto
  const dadosPorTipo = escalas.reduce((acc, escala) => {
    const tipo = escala.tipo;
    if (!acc[tipo]) {
      acc[tipo] = { tipo, total: 0, realizadas: 0, voluntarios: 0 };
    }
    acc[tipo].total++;
    if (escala.status === 'realizada') acc[tipo].realizadas++;
    acc[tipo].voluntarios += escala.voluntarios.length;
    return acc;
  }, {} as Record<string, any>);

  const dadosGraficoTipo = Object.values(dadosPorTipo);

  const exportarRelatorio = () => {
    const csv = [
      'Data,Tipo,Status,Líder,Total Voluntários,Confirmados,Local',
      ...escalas.map(escala => 
        `${format(new Date(escala.data), 'dd/MM/yyyy')},${escala.tipo},${escala.status},${escala.lider},${escala.voluntarios.length},${escala.voluntarios.filter(v => v.confirmado).length},${escala.local || ''}`
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-escalas-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Relatório de Escalas</h2>
          <p className="text-gray-600">Análise de performance e estatísticas</p>
        </div>
        <Button onClick={exportarRelatorio} className="flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Exportar CSV</span>
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Total de Escalas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.totalEscalas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Taxa de Realização
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {estatisticas.taxaRealizacao}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Média Voluntários/Escala
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {estatisticas.mediaVoluntariosPorEscala}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Taxa de Confirmação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {estatisticas.taxaConfirmacao}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Evolução Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dadosMensais}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="escalas" stroke="#8884d8" name="Total Escalas" />
                <Line type="monotone" dataKey="realizadas" stroke="#82ca9d" name="Realizadas" />
                <Line type="monotone" dataKey="voluntarios" stroke="#ffc658" name="Voluntários" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Escalas por Tipo de Culto</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosGraficoTipo}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tipo" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#8884d8" name="Total" />
                <Bar dataKey="realizadas" fill="#82ca9d" name="Realizadas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Escalas Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Escalas Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Data</th>
                  <th className="text-left p-2">Tipo</th>
                  <th className="text-left p-2">Líder</th>
                  <th className="text-center p-2">Voluntários</th>
                  <th className="text-center p-2">Confirmados</th>
                  <th className="text-center p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {escalas.slice(0, 10).map((escala) => (
                  <tr key={escala.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      {format(new Date(escala.data), 'dd/MM/yyyy', { locale: ptBR })}
                    </td>
                    <td className="p-2">{escala.tipo}</td>
                    <td className="p-2">{escala.lider}</td>
                    <td className="p-2 text-center">{escala.voluntarios.length}</td>
                    <td className="p-2 text-center text-green-600">
                      {escala.voluntarios.filter(v => v.confirmado).length}
                    </td>
                    <td className="p-2 text-center">
                      <Badge 
                        variant={
                          escala.status === 'realizada' ? 'default' :
                          escala.status === 'cancelada' ? 'destructive' : 'secondary'
                        }
                      >
                        {escala.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
