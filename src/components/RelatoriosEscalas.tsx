
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Calendar, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { useEscalas } from '@/contexts/EscalasContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const RelatoriosEscalas = () => {
  const { escalas } = useEscalas();

  // Estatísticas das escalas
  const totalEscalas = escalas.length;
  const escalasCompletas = escalas.filter(e => e.status === 'Completa').length;
  const escalasAtivas = escalas.filter(e => e.status === 'Ativa').length;
  const totalVoluntariosEscalados = escalas.reduce((total, escala) => 
    total + escala.voluntarios.length, 0
  );
  const totalConfirmados = escalas.reduce((total, escala) => 
    total + escala.voluntarios.filter(v => v.confirmado).length, 0
  );

  // Dados para gráficos
  const dadosStatusEscalas = [
    { name: 'Ativas', value: escalasAtivas, color: '#3b82f6' },
    { name: 'Completas', value: escalasCompletas, color: '#10b981' },
    { name: 'Incompletas', value: totalEscalas - escalasAtivas - escalasCompletas, color: '#ef4444' }
  ];

  const dadosVoluntariosPorEscala = escalas.map(escala => ({
    nome: `${escala.tipo} - ${format(new Date(escala.data), 'dd/MM', { locale: ptBR })}`,
    total: escala.voluntarios.length,
    confirmados: escala.voluntarios.filter(v => v.confirmado).length
  }));

  const exportarRelatorio = () => {
    const dados = escalas.map(escala => [
      format(new Date(escala.data), 'dd/MM/yyyy', { locale: ptBR }),
      escala.culto,
      escala.tipo,
      escala.lider,
      escala.voluntarios.length,
      escala.voluntarios.filter(v => v.confirmado).length,
      escala.local || 'Não especificado',
      escala.status
    ]);

    const cabecalho = [
      'Data',
      'Culto',
      'Tipo',
      'Líder',
      'Total Voluntários',
      'Confirmados',
      'Local',
      'Status'
    ];

    const csv = [cabecalho, ...dados]
      .map(linha => linha.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_escalas_${format(new Date(), 'dd-MM-yyyy')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Resumo Executivo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Escalas</p>
                <p className="text-3xl font-bold">{totalEscalas}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Escalas Ativas</p>
                <p className="text-3xl font-bold text-blue-600">{escalasAtivas}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Voluntários Escalados</p>
                <p className="text-3xl font-bold text-green-600">{totalVoluntariosEscalados}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Confirmação</p>
                <p className="text-3xl font-bold text-purple-600">
                  {totalVoluntariosEscalados > 0 ? Math.round((totalConfirmados / totalVoluntariosEscalados) * 100) : 0}%
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status das Escalas */}
        <Card>
          <CardHeader>
            <CardTitle>Status das Escalas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dadosStatusEscalas}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {dadosStatusEscalas.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Voluntários por Escala */}
        <Card>
          <CardHeader>
            <CardTitle>Voluntários por Escala</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosVoluntariosPorEscala}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="nome" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Bar dataKey="total" fill="#3b82f6" name="Total" />
                <Bar dataKey="confirmados" fill="#10b981" name="Confirmados" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detalhamento das Escalas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Detalhamento das Escalas</CardTitle>
          <Button onClick={exportarRelatorio} className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Exportar CSV</span>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-2 text-left">Data</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Culto</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Tipo</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Líder</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Voluntários</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Confirmados</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {escalas.map((escala) => (
                  <tr key={escala.id} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2">
                      {format(new Date(escala.data), 'dd/MM/yyyy', { locale: ptBR })}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">{escala.culto}</td>
                    <td className="border border-gray-200 px-4 py-2">{escala.tipo}</td>
                    <td className="border border-gray-200 px-4 py-2">{escala.lider}</td>
                    <td className="border border-gray-200 px-4 py-2">{escala.voluntarios.length}</td>
                    <td className="border border-gray-200 px-4 py-2">
                      {escala.voluntarios.filter(v => v.confirmado).length}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        escala.status === 'Ativa' ? 'bg-blue-100 text-blue-800' :
                        escala.status === 'Completa' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {escala.status}
                      </span>
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

export default RelatoriosEscalas;
