
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Users, Crown, UserCheck, UserX } from 'lucide-react';
import { useEscalas } from '@/contexts/EscalasContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const RelatoriosVoluntarios = () => {
  const { voluntarios, escalas } = useEscalas();

  // Estatísticas dos voluntários
  const totalVoluntarios = voluntarios.length;
  const totalLideres = voluntarios.filter(v => v.tipo === 'lider').length;
  const totalVoluntariosComuns = totalVoluntarios - totalLideres;

  // Calcular participação dos voluntários
  const participacaoVoluntarios = voluntarios.map(voluntario => {
    const participacoes = escalas.filter(escala => 
      escala.voluntarios.some(v => v.id === voluntario.id)
    ).length;
    
    const confirmacoes = escalas.filter(escala => 
      escala.voluntarios.some(v => v.id === voluntario.id && v.confirmado)
    ).length;

    return {
      ...voluntario,
      participacoes,
      confirmacoes,
      taxaConfirmacao: participacoes > 0 ? Math.round((confirmacoes / participacoes) * 100) : 0
    };
  });

  // Dados para gráficos
  const dadosTipoVoluntarios = [
    { name: 'Voluntários', value: totalVoluntariosComuns, color: '#3b82f6' },
    { name: 'Líderes', value: totalLideres, color: '#10b981' }
  ];

  const dadosParticipacao = participacaoVoluntarios
    .sort((a, b) => b.participacoes - a.participacoes)
    .slice(0, 10);

  const exportarRelatorio = () => {
    const dados = participacaoVoluntarios.map(voluntario => [
      voluntario.nome,
      voluntario.tipo,
      voluntario.telefone || 'Não informado',
      voluntario.participacoes,
      voluntario.confirmacoes,
      `${voluntario.taxaConfirmacao}%`
    ]);

    const cabecalho = [
      'Nome',
      'Tipo',
      'Telefone',
      'Participações',
      'Confirmações',
      'Taxa Confirmação'
    ];

    const csv = [cabecalho, ...dados]
      .map(linha => linha.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_voluntarios_${format(new Date(), 'dd-MM-yyyy')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Resumo Executivo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Voluntários</p>
                <p className="text-3xl font-bold">{totalVoluntarios}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Líderes</p>
                <p className="text-3xl font-bold text-green-600">{totalLideres}</p>
              </div>
              <Crown className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Voluntários Comuns</p>
                <p className="text-3xl font-bold text-purple-600">{totalVoluntariosComuns}</p>
              </div>
              <UserCheck className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição por Tipo */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dadosTipoVoluntarios}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {dadosTipoVoluntarios.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top 10 Participações */}
        <Card>
          <CardHeader>
            <CardTitle>Top 10 - Mais Participativos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosParticipacao}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="nome" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Bar dataKey="participacoes" fill="#3b82f6" name="Participações" />
                <Bar dataKey="confirmacoes" fill="#10b981" name="Confirmações" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detalhamento dos Voluntários */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Detalhamento dos Voluntários</CardTitle>
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
                  <th className="border border-gray-200 px-4 py-2 text-left">Nome</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Tipo</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Telefone</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Participações</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Confirmações</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Taxa Confirmação</th>
                </tr>
              </thead>
              <tbody>
                {participacaoVoluntarios.map((voluntario) => (
                  <tr key={voluntario.id} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2">{voluntario.nome}</td>
                    <td className="border border-gray-200 px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        voluntario.tipo === 'lider' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {voluntario.tipo === 'lider' ? 'Líder' : 'Voluntário'}
                      </span>
                    </td>
                    <td className="border border-gray-200 px-4 py-2">{voluntario.telefone || 'Não informado'}</td>
                    <td className="border border-gray-200 px-4 py-2">{voluntario.participacoes}</td>
                    <td className="border border-gray-200 px-4 py-2">{voluntario.confirmacoes}</td>
                    <td className="border border-gray-200 px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        voluntario.taxaConfirmacao >= 80 ? 'bg-green-100 text-green-800' :
                        voluntario.taxaConfirmacao >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {voluntario.taxaConfirmacao}%
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

export default RelatoriosVoluntarios;
