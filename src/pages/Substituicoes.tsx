
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Clock, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Substituicoes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  // Estado real para substituições
  const [substituicoes, setSubstituicoes] = useState([
    {
      id: 1,
      data: "2024-01-21",
      culto: "Domingo 10h",
      voluntarioOriginal: "Maria Santos",
      voluntarioSubstituto: "João Silva",
      motivo: "Viagem de trabalho",
      status: "pendente",
      datasolicitacao: "2024-01-15"
    },
    {
      id: 2,
      data: "2024-01-24",
      culto: "Quarta 20h",
      voluntarioOriginal: "Pedro Lima",
      voluntarioSubstituto: "Ana Costa",
      motivo: "Compromisso médico",
      status: "aprovado",
      datasolicitacao: "2024-01-14"
    },
    {
      id: 3,
      data: "2024-01-28",
      culto: "Domingo 19h30",
      voluntarioOriginal: "Carlos Oliveira",
      voluntarioSubstituto: "Lucia Mendes",
      motivo: "Emergência familiar",
      status: "rejeitado",
      datasolicitacao: "2024-01-16"
    }
  ]);

  const filteredSubstituicoes = substituicoes.filter(sub =>
    sub.voluntarioOriginal.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.voluntarioSubstituto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.culto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAprovar = (id: number) => {
    const substituicaoAprovada = substituicoes.find(s => s.id === id);
    
    setSubstituicoes(prev => 
      prev.map(sub => 
        sub.id === id 
          ? { ...sub, status: "aprovado" }
          : sub
      )
    );
    toast({
      title: "Substituição aprovada",
      description: "Substituição aprovada com sucesso!",
    });
    
    // Enviar notificação em tempo real
    window.dispatchEvent(new CustomEvent('broadcastNotification', {
      detail: {
        title: "✅ Substituição Aprovada",
        message: `Substituição de ${substituicaoAprovada?.voluntarioOriginal} foi aprovada.`,
        type: "success",
        from: "Sistema"
      }
    }));
  };

  const handleRejeitar = (id: number) => {
    const substituicaoRejeitada = substituicoes.find(s => s.id === id);
    
    setSubstituicoes(prev => 
      prev.map(sub => 
        sub.id === id 
          ? { ...sub, status: "rejeitado" }
          : sub
      )
    );
    toast({
      title: "Substituição rejeitada",
      description: "Substituição rejeitada",
      variant: "destructive"
    });
    
    // Enviar notificação em tempo real
    window.dispatchEvent(new CustomEvent('broadcastNotification', {
      detail: {
        title: "❌ Substituição Rejeitada",
        message: `Substituição de ${substituicaoRejeitada?.voluntarioOriginal} foi rejeitada.`,
        type: "warning",
        from: "Sistema"
      }
    }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pendente</Badge>;
      case 'aprovado':
        return <Badge variant="default"><CheckCircle className="h-3 w-3 mr-1" />Aprovado</Badge>;
      case 'rejeitado':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejeitado</Badge>;
      default:
        return <Badge variant="secondary">-</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Substituições</h1>
          <p className="text-gray-600">Gerencie as solicitações de substituição</p>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por voluntário ou culto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold">{substituicoes.length}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendentes</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {substituicoes.filter(s => s.status === 'pendente').length}
                  </p>
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
                  <p className="text-2xl font-bold text-green-600">
                    {substituicoes.filter(s => s.status === 'aprovado').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Substituições */}
        <Card>
          <CardHeader>
            <CardTitle>Solicitações de Substituição</CardTitle>
            <CardDescription>
              Todas as solicitações de substituição do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data do Culto</TableHead>
                    <TableHead>Voluntário Original</TableHead>
                    <TableHead>Substituto</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubstituicoes.map((substituicao) => (
                    <TableRow key={substituicao.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{substituicao.culto}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(substituicao.data).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{substituicao.voluntarioOriginal}</p>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{substituicao.voluntarioSubstituto}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{substituicao.motivo}</p>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(substituicao.status)}
                      </TableCell>
                      <TableCell>
                        {substituicao.status === 'pendente' && (
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleAprovar(substituicao.id)}
                            >
                              Aprovar
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleRejeitar(substituicao.id)}
                            >
                              Rejeitar
                            </Button>
                          </div>
                        )}
                        {substituicao.status !== 'pendente' && (
                          <span className="text-gray-400">-</span>
                        )}
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
