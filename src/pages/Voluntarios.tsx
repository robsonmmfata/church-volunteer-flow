
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Plus, Search, UserCheck, Phone, Mail } from "lucide-react";

const Voluntarios = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - Em produção, viria de uma API
  const voluntarios = [
    {
      id: 1,
      nome: "João Silva",
      sexo: "Masculino",
      celular: "(11) 99999-1111",
      email: "joao@email.com",
      conjuge: "Maria Silva",
      celularConjuge: "(11) 99999-2222",
      lider: true
    },
    {
      id: 2,
      nome: "Ana Santos",
      sexo: "Feminino",
      celular: "(11) 99999-3333",
      email: "ana@email.com",
      conjuge: "",
      celularConjuge: "",
      lider: false
    },
    {
      id: 3,
      nome: "Carlos Oliveira",
      sexo: "Masculino",
      celular: "(11) 99999-4444",
      email: "carlos@email.com",
      conjuge: "Lucia Oliveira",
      celularConjuge: "(11) 99999-5555",
      lider: true
    },
  ];

  const filteredVoluntarios = voluntarios.filter(voluntario =>
    voluntario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voluntario.celular.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Voluntários</h1>
            <p className="text-gray-600">Gerencie o cadastro de voluntários</p>
          </div>
          <Link to="/voluntarios/novo">
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Novo Voluntário</span>
            </Button>
          </Link>
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
                  placeholder="Buscar por nome ou celular..."
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
                  <p className="text-2xl font-bold">{voluntarios.length}</p>
                </div>
                <UserCheck className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Líderes</p>
                  <p className="text-2xl font-bold">
                    {voluntarios.filter(v => v.lider).length}
                  </p>
                </div>
                <UserCheck className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Casados</p>
                  <p className="text-2xl font-bold">
                    {voluntarios.filter(v => v.conjuge).length}
                  </p>
                </div>
                <UserCheck className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Voluntários */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Voluntários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Cônjuge</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVoluntarios.map((voluntario) => (
                    <TableRow key={voluntario.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{voluntario.nome}</p>
                          <p className="text-sm text-gray-500">{voluntario.sexo}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{voluntario.celular}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{voluntario.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {voluntario.conjuge ? (
                          <div>
                            <p className="text-sm font-medium">{voluntario.conjuge}</p>
                            <p className="text-sm text-gray-500">{voluntario.celularConjuge}</p>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {voluntario.lider ? (
                          <Badge variant="default">Líder</Badge>
                        ) : (
                          <Badge variant="secondary">Voluntário</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
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

export default Voluntarios;
