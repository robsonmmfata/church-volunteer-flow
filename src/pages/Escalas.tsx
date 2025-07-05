
import { useState } from "react";
import { Link } from "react-router-dom";
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
import { Plus, Calendar, Users, Clock } from "lucide-react";

const Escalas = () => {
  // Mock data - Em produção, viria de uma API
  const escalas = [
    {
      id: 1,
      data: "2024-01-07",
      culto: "Domingo 10h",
      lider: "João Silva",
      voluntarios: ["Ana Santos", "Carlos Oliveira", "Maria Silva", "Pedro Costa", "Lucia Oliveira"],
      status: "Completa"
    },
    {
      id: 2,
      data: "2024-01-07",
      culto: "Domingo 19h30",
      lider: "Ana Santos",
      voluntarios: ["João Silva", "Carlos Oliveira", "Maria Silva", "Pedro Costa"],
      status: "Incompleta"
    },
    {
      id: 3,
      data: "2024-01-10",
      culto: "Quarta 20h (Culto da Fé)",
      lider: "Carlos Oliveira",
      voluntarios: ["Ana Santos", "Maria Silva", "Pedro Costa", "Lucia Oliveira", "João Silva"],
      status: "Completa"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completa":
        return "default";
      case "Incompleta":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Escalas</h1>
            <p className="text-gray-600">Gerencie as escalas por culto e data</p>
          </div>
          <Link to="/escalas/nova">
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Nova Escala</span>
            </Button>
          </Link>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Escalas</p>
                  <p className="text-2xl font-bold">{escalas.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completas</p>
                  <p className="text-2xl font-bold text-green-600">
                    {escalas.filter(e => e.status === "Completa").length}
                  </p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Incompletas</p>
                  <p className="text-2xl font-bold text-red-600">
                    {escalas.filter(e => e.status === "Incompleta").length}
                  </p>
                </div>
                <Users className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Esta Semana</p>
                  <p className="text-2xl font-bold">4</p>
                </div>
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Próximas Escalas */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Próximas Escalas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {escalas.slice(0, 3).map((escala) => (
                <div key={escala.id} className="border rounded-lg p-4 bg-white">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{escala.culto}</h3>
                    <Badge variant={getStatusColor(escala.status)}>
                      {escala.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {formatDate(escala.data)}
                  </p>
                  <div className="mb-3">
                    <p className="text-sm font-medium text-blue-600">
                      Líder: {escala.lider}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Voluntários ({escala.voluntarios.length}/5):
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {escala.voluntarios.slice(0, 3).map((voluntario, index) => (
                        <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {voluntario}
                        </span>
                      ))}
                      {escala.voluntarios.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{escala.voluntarios.length - 3} mais
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Todas as Escalas */}
        <Card>
          <CardHeader>
            <CardTitle>Todas as Escalas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Culto</TableHead>
                    <TableHead>Líder</TableHead>
                    <TableHead>Voluntários</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {escalas.map((escala) => (
                    <TableRow key={escala.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {new Date(escala.data).toLocaleDateString('pt-BR')}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(escala.data).toLocaleDateString('pt-BR', { weekday: 'long' })}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{escala.culto}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-blue-600 font-medium">{escala.lider}</span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">
                            {escala.voluntarios.length}/5 voluntários
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {escala.voluntarios.slice(0, 2).map((voluntario, index) => (
                              <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {voluntario}
                              </span>
                            ))}
                            {escala.voluntarios.length > 2 && (
                              <span className="text-xs text-gray-500">
                                +{escala.voluntarios.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(escala.status)}>
                          {escala.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                          <Button variant="outline" size="sm">
                            Ver Detalhes
                          </Button>
                        </div>
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

export default Escalas;
