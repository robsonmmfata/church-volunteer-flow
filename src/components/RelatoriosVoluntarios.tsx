
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEscalas } from '@/contexts/EscalasContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Users, Calendar, TrendingUp, Award } from 'lucide-react';

export const RelatoriosVoluntarios = () => {
  const { escalas, voluntarios } = useEscalas();

  const calcularEstatisticas = () => {
    const stats = voluntarios.map(voluntario => {
      const escalasDoVoluntario = escalas.filter(escala => 
        escala.voluntarios.some(v => v.id === voluntario.id)
      );

      const presencas = escalasDoVoluntario.filter(escala => {
        const vol = escala.voluntarios.find(v => v.id === voluntario.id);
        return vol?.confirmado;
      }).length;

      const ausencias = escalasDoVoluntario.length - presencas;
      const percentualPresenca = escalasDoVoluntario.length > 0 
        ? Math.round((presencas / escalasDoVoluntario.length) * 100) 
        : 0;

      return {
        id: voluntario.id,
        nome: voluntario.nome,
        tipo: voluntario.tipo,
        totalEscalas: escalasDoVoluntario.length,
        presencas,
        ausencias,
        percentualPresenca,
        telefone: voluntario.telefone
      };
    });

    return stats.sort((a, b) => b.totalEscalas - a.totalEscalas);
  };

  const estatisticas = calcularEstatisticas();

  const dadosGrafico = estatisticas.slice(0, 10).map(stat => ({
    nome: stat.nome.split(' ')[0],
    escalas: stat.totalEscalas,
    presencas: stat.presencas,
    percentual: stat.percentualPresenca
  }));

  const dadosPizza = [
    { name: 'Voluntários Ativos', value: estatisticas.filter(s => s.totalEscalas > 0).length },
    { name: 'Voluntários Inativos', value: estatisticas.filter(s => s.totalEscalas === 0).length }
  ];

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

  const exportarRelatorio = () => {
    const csv = [
      'Nome,Tipo,Total Escalas,Presenças,Ausências,% Presença,Telefone',
      ...estatisticas.map(stat => 
        `${stat.nome},${stat.tipo},${stat.totalEscalas},${stat.presencas},${stat.ausencias},${stat.percentualPresenca}%,${stat.telefone || ''}`
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-voluntarios-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Relatório de Voluntários</h2>
          <p className="text-gray-600">Análise de participação e desempenho</p>
        </div>
        <Button onClick={exportarRelatorio} className="flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Exportar CSV</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Total Voluntários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{voluntarios.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Voluntários Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {estatisticas.filter(s => s.totalEscalas > 0).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Média Escalas/Voluntário
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(estatisticas.reduce((acc, s) => acc + s.totalEscalas, 0) / voluntarios.length)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Award className="h-4 w-4 mr-2" />
              % Presença Média
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(estatisticas.reduce((acc, s) => acc + s.percentualPresenca, 0) / voluntarios.length)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Voluntários - Participação em Escalas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosGrafico}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nome" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="escalas" fill="#8884d8" name="Total Escalas" />
                <Bar dataKey="presencas" fill="#82ca9d" name="Presenças" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Voluntários</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dadosPizza}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dadosPizza.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhamento por Voluntário</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Nome</th>
                  <th className="text-left p-2">Tipo</th>
                  <th className="text-center p-2">Total Escalas</th>
                  <th className="text-center p-2">Presenças</th>
                  <th className="text-center p-2">Ausências</th>
                  <th className="text-center p-2">% Presença</th>
                  <th className="text-center p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {estatisticas.map((stat) => (
                  <tr key={stat.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{stat.nome}</td>
                    <td className="p-2">
                      <Badge variant={stat.tipo === 'lider' ? 'default' : 'secondary'}>
                        {stat.tipo}
                      </Badge>
                    </td>
                    <td className="p-2 text-center">{stat.totalEscalas}</td>
                    <td className="p-2 text-center text-green-600">{stat.presencas}</td>
                    <td className="p-2 text-center text-red-600">{stat.ausencias}</td>
                    <td className="p-2 text-center">
                      <Badge 
                        variant={stat.percentualPresenca >= 80 ? 'default' : 
                                stat.percentualPresenca >= 60 ? 'secondary' : 'destructive'}
                      >
                        {stat.percentualPresenca}%
                      </Badge>
                    </td>
                    <td className="p-2 text-center">
                      {stat.totalEscalas > 0 ? (
                        <Badge variant="default">Ativo</Badge>
                      ) : (
                        <Badge variant="secondary">Inativo</Badge>
                      )}
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
