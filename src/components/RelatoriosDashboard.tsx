
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RelatoriosService } from "@/services/relatoriosService";
import { 
  Download, 
  Users, 
  Calendar, 
  TrendingUp, 
  PieChart,
  BarChart3
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  escalas: any[];
  voluntarios: any[];
  substituicoes: any[];
}

const RelatoriosDashboard = ({ escalas, voluntarios, substituicoes }: Props) => {
  const [relatoriosService] = useState(() => new RelatoriosService(escalas, voluntarios, substituicoes));
  const [metricas, setMetricas] = useState<any>({});
  const [metricasVoluntarios, setMetricasVoluntarios] = useState<any[]>([]);
  const [distribuicaoGenero, setDistribuicaoGenero] = useState<any>({});
  const [frequenciaDias, setFrequenciaDias] = useState<any>({});

  useEffect(() => {
    carregarDados();
  }, [escalas, voluntarios, substituicoes]);

  const carregarDados = () => {
    const metricas = relatoriosService.calcularMetricasGerais();
    const metricasVol = relatoriosService.calcularMetricasPorVoluntario();
    const distribuicao = relatoriosService.calcularDistribuicaoPorGenero();
    const frequencia = relatoriosService.calcularFrequenciaPorDia();

    setMetricas(metricas);
    setMetricasVoluntarios(metricasVol);
    setDistribuicaoGenero(distribuicao);
    setFrequenciaDias(frequencia);
  };

  const handleExportarCSV = () => {
    const csvContent = relatoriosService.exportarRelatorioCSV(metricasVoluntarios);
    const filename = `relatorio-voluntarios-${new Date().toISOString().split('T')[0]}.csv`;
    relatoriosService.baixarRelatorio(filename, csvContent);
    
    toast.success("Relatório exportado com sucesso!");
  };

  const handleGerarRelatorioMensal = () => {
    const relatorio = relatoriosService.gerarRelatorioMensal(new Date().getMonth(), new Date().getFullYear());
    console.log('Relatório mensal:', relatorio);
    
    toast.success("Relatório mensal gerado!");
  };

  return (
    <div className="space-y-6">
      {/* Métricas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Voluntários</p>
                <p className="text-2xl font-bold">{metricas.totalVoluntarios}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Escalas Este Mês</p>
                <p className="text-2xl font-bold">{metricas.escalasEsteMes}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Presença</p>
                <p className="text-2xl font-bold text-green-600">{metricas.taxaPresencaGeral}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Substituições</p>
                <p className="text-2xl font-bold text-yellow-600">{metricas.substituicoesPendentes}</p>
              </div>
              <PieChart className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribuição por Gênero */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Gênero</CardTitle>
          <CardDescription>Proporção de voluntários por gênero</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{distribuicaoGenero.homens}</p>
              <p className="text-sm text-gray-600">Homens ({distribuicaoGenero.percentualHomens}%)</p>
            </div>
            <div className="text-center p-4 bg-pink-50 rounded-lg">
              <p className="text-2xl font-bold text-pink-600">{distribuicaoGenero.mulheres}</p>
              <p className="text-sm text-gray-600">Mulheres ({distribuicaoGenero.percentualMulheres}%)</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-600">{distribuicaoGenero.total}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Voluntários */}
      <Card>
        <CardHeader>
          <CardTitle>Desempenho dos Voluntários</CardTitle>
          <CardDescription>Métricas individuais dos voluntários</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {metricasVoluntarios.slice(0, 10).map((voluntario) => (
              <div key={voluntario.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{voluntario.nome}</p>
                  <p className="text-sm text-gray-600">
                    {voluntario.totalEscalas} escalas • {voluntario.faltas} faltas
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={voluntario.taxaPresenca >= 90 ? 'default' : 'destructive'}>
                    {voluntario.taxaPresenca}% presença
                  </Badge>
                  <Badge variant="outline">
                    {voluntario.substituicoes} subst.
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Frequência por Dia */}
      <Card>
        <CardHeader>
          <CardTitle>Frequência por Dia da Semana</CardTitle>
          <CardDescription>Número de escalas por dia</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(frequenciaDias).map(([dia, quantidade]) => (
              <div key={dia} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-700">{quantidade as number}</p>
                <p className="text-sm text-gray-600 capitalize">{dia}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ações de Relatório */}
      <Card>
        <CardHeader>
          <CardTitle>Exportar Relatórios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Button onClick={handleExportarCSV} className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Exportar CSV</span>
            </Button>
            
            <Button variant="outline" onClick={handleGerarRelatorioMensal} className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Relatório Mensal</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RelatoriosDashboard;
