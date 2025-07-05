
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, XCircle, Clock, RotateCcw, User } from "lucide-react";
import { toast } from "sonner";

const Substituicoes = () => {
  const [loading, setLoading] = useState<string | null>(null);

  // Mock data - Em produção, viria de uma API
  const [substituicoes, setSubstituicoes] = useState([
    {
      id: 1,
      data: "2024-01-14",
      culto: "Domingo 10h",
      voluntarioOriginal: "João Silva",
      voluntarioSubstituto: "Pedro Costa",
      tipo: "Sugestão", // "Sugestão" ou "Solicitação"
      status: "Pendente", // "Pendente", "Aprovada", "Recusada"
      dataSolicitacao: "2024-01-12",
      observacao: "Não posso comparecer devido a compromisso familiar"
    },
    {
      id: 2,
      data: "2024-01-17",
      culto: "Quarta 20h (Culto da Fé)",
      voluntarioOriginal: "Ana Santos",
      voluntarioSubstituto: "",
      tipo: "Solicitação",
      status: "Pendente",
      dataSolicitacao: "2024-01-13",
      observacao: "Preciso viajar a trabalho"
    },
    {
      id: 3,
      data: "2024-01-10",
      culto: "Domingo 19h30",
      voluntarioOriginal: "Carlos Oliveira",
      voluntarioSubstituto: "Maria Silva",
      tipo: "Sugestão",
      status: "Aprovada",
      dataSolicitacao: "2024-01-08",
      observacao: ""
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aprovada":
        return "default";
      case "Recusada":
        return "destructive";
      case "Pendente":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Aprovada":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "Recusada":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "Pendente":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleApproval = async (id: number, action: 'aprovar' | 'recusar') => {
    setLoading(`${action}-${id}`);
    
    try {
      // Simulação de chamada para webhook N8N
      const response = await fetch('/webhook/substituicao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          action,
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        setSubstituicoes(prev => 
          prev.map(sub => 
            sub.id === id 
              ? { ...sub, status: action === 'aprovar' ? 'Aprovada' : 'Recusada' }
              : sub
          )
        );
        
        toast.success(
          action === 'aprovar' 
            ? "Substituição aprovada com sucesso!" 
            : "Substituição recusada com sucesso!"
        );
      } else {
        throw new Error('Erro na resposta da API');
      }
    } catch (error) {
      toast.error("Erro ao processar substituição. Tente novamente.");
    } finally {
      setLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const pendentes = substituicoes.filter(s => s.status === "Pendente");
  const aprovadas = substituicoes.filter(s => s.status === "Aprovada");
  const recusadas = substituicoes.filter(s => s.status === "Recusada");

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Substituições</h1>
          <p className="text-gray-600">Gerencie as solicitações de troca de escala</p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold">{substituicoes.length}</p>
                </div>
                <RotateCcw className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendentes</p>
                  <p className="text-2xl font-bold text-yellow-600">{pendentes.length}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aprovadas</p>
                  <p className="text-2xl font-bold text-green-600">{aprovadas.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Recusadas</p>
                  <p className="text-2xl font-bold text-red-600">{recusadas.length}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Substituições Pendentes */}
        {pendentes.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-yellow-600">Substituições Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendentes.map((substituicao) => (
                  <div key={substituicao.id} className="border rounded-lg p-4 bg-yellow-50">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <User className="h-4 w-4 text-gray-600" />
                          <span className="font-medium">{substituicao.voluntarioOriginal}</span>
                          <span className="text-gray-500">→</span>
                          <span className="font-medium text-blue-600">
                            {substituicao.voluntarioSubstituto || "Sem substituto sugerido"}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                          <div>
                            <strong>Data:</strong> {formatDate(substituicao.data)}
                          </div>
                          <div>
                            <strong>Culto:</strong> {substituicao.culto}
                          </div>
                          <div>
                            <strong>Tipo:</strong> {substituicao.tipo}
                          </div>
                        </div>
                        {substituicao.observacao && (
                          <div className="mt-2 text-sm text-gray-600">
                            <strong>Observação:</strong> {substituicao.observacao}
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleApproval(substituicao.id, 'aprovar')}
                          disabled={loading === `aprovar-${substituicao.id}`}
                          className="flex items-center space-x-1"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>
                            {loading === `aprovar-${substituicao.id}` ? "Aprovando..." : "Aprovar"}
                          </span>
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleApproval(substituicao.id, 'recusar')}
                          disabled={loading === `recusar-${substituicao.id}`}
                          className="flex items-center space-x-1"
                        >
                          <XCircle className="h-4 w-4" />
                          <span>
                            {loading === `recusar-${substituicao.id}` ? "Recusando..." : "Recusar"}
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Histórico Completo */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Substituições</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data Solicitação</TableHead>
                    <TableHead>Culto</TableHead>
                    <TableHead>Voluntário Original</TableHead>
                    <TableHead>Substituto</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Observação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {substituicoes.map((substituicao) => (
                    <TableRow key={substituicao.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {formatDate(substituicao.dataSolicitacao)}
                          </p>
                          <p className="text-sm text-gray-500">
                            Para: {formatDate(substituicao.data)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{substituicao.culto}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-red-600">{substituicao.voluntarioOriginal}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-blue-600">
                          {substituicao.voluntarioSubstituto || "Não definido"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{substituicao.tipo}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(substituicao.status)}
                          <Badge variant={getStatusColor(substituicao.status)}>
                            {substituicao.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {substituicao.observacao || "-"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Substituicoes;
