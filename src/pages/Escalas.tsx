import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Calendar, Users, Clock, Edit, Trash2, Eye, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useEscalas } from "@/contexts/EscalasContext";
import { useAuth } from "@/contexts/AuthContext";

const Escalas = () => {
  const { escalas, deleteEscala, updateEscala } = useEscalas();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedEscala, setSelectedEscala] = useState<any>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEscala, setEditingEscala] = useState<any>(null);

  // Mock data para voluntários disponíveis
  const voluntariosDisponiveis = [
    "João Silva", "Ana Santos", "Carlos Oliveira", "Maria Silva", 
    "Pedro Costa", "Lucia Oliveira", "Ricardo Lima", "Julia Santos"
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativa":
        return "default";
      case "Incompleta":
        return "destructive";
      case "Completa":
        return "secondary";
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

  const handleEdit = (escala: any) => {
    setEditingEscala({ ...escala });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingEscala) return;
    
    const updatedData = {
      ...editingEscala,
      status: editingEscala.voluntarios.length === 5 ? "Ativa" : "Incompleta"
    };
    
    updateEscala(editingEscala.id, updatedData, user?.tipo || 'admin');
    setIsEditDialogOpen(false);
    setEditingEscala(null);
    toast.success("Escala editada com sucesso!");
  };

  const handleVoluntarioChange = (voluntario: string, checked: boolean) => {
    if (!editingEscala) return;
    
    if (checked && editingEscala.voluntarios.length >= 5) {
      toast.error("Máximo de 5 voluntários por escala");
      return;
    }

    const voluntarioNomes = editingEscala.voluntarios.map((v: any) => 
      typeof v === 'string' ? v : v.nome
    );

    setEditingEscala((prev: any) => ({
      ...prev,
      voluntarios: checked 
        ? [...voluntarioNomes, voluntario]
        : voluntarioNomes.filter((v: string) => v !== voluntario)
    }));
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta escala?")) {
      deleteEscala(id, user?.tipo || 'admin');
      toast.success("Escala excluída com sucesso!");
    }
  };

  const handleViewDetails = (escala: any) => {
    setSelectedEscala(escala);
    setIsDetailDialogOpen(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success("Logout realizado com sucesso");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Escalas</h1>
            <p className="text-gray-600">Gerencie as escalas por culto e data</p>
          </div>
          <div className="flex space-x-2">
            <Link to="/admin/escalas/nova">
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Nova Escala</span>
              </Button>
            </Link>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
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
                  <p className="text-sm font-medium text-gray-600">Ativas</p>
                  <p className="text-2xl font-bold text-green-600">
                    {escalas.filter(e => e.status === "Ativa").length}
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
                      {escala.voluntarios.slice(0, 3).map((voluntario, index: number) => (
                        <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {voluntario.nome}
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
                    <TableHead>Criado por</TableHead>
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
                            {escala.voluntarios.slice(0, 2).map((voluntario, index: number) => (
                              <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {voluntario.nome}
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
                        <Badge variant="outline">
                          {escala.criadoPor === 'admin' ? 'Admin' : 
                           escala.criadoPor === 'lider' ? 'Líder' : 'Sistema'}
                        </Badge>
                        {escala.modificadoPor && escala.modificadoPor !== escala.criadoPor && (
                          <div className="text-xs text-gray-500 mt-1">
                            Mod. por: {escala.modificadoPor}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEdit(escala)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDetails(escala)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver Detalhes
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete(escala.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Excluir
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

        {/* Dialog de Edição */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Escala</DialogTitle>
            </DialogHeader>
            {editingEscala && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Data</Label>
                    <Input
                      type="date"
                      value={editingEscala.data}
                      onChange={(e) => setEditingEscala((prev: any) => ({
                        ...prev,
                        data: e.target.value
                      }))}
                    />
                  </div>
                  <div>
                    <Label>Culto</Label>
                    <Input
                      value={editingEscala.culto}
                      onChange={(e) => setEditingEscala((prev: any) => ({
                        ...prev,
                        culto: e.target.value
                      }))}
                    />
                  </div>
                </div>

                <div>
                  <Label>Líder</Label>
                  <Input
                    value={editingEscala.lider}
                    onChange={(e) => setEditingEscala((prev: any) => ({
                      ...prev,
                      lider: e.target.value
                    }))}
                  />
                </div>

                <div>
                  <Label>Voluntários ({editingEscala.voluntarios.length}/5)</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2 max-h-48 overflow-y-auto">
                    {voluntariosDisponiveis.map((voluntario) => (
                      <div key={voluntario} className="flex items-center space-x-2">
                        <Checkbox
                          checked={editingEscala.voluntarios.some((v: any) => 
                            typeof v === 'string' ? v === voluntario : v.nome === voluntario
                          )}
                          onCheckedChange={(checked) => 
                            handleVoluntarioChange(voluntario, checked as boolean)
                          }
                        />
                        <Label className="text-sm">{voluntario}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button onClick={handleSaveEdit} className="flex-1">
                    Salvar Alterações
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Dialog de Detalhes */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Detalhes da Escala</DialogTitle>
            </DialogHeader>
            {selectedEscala && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">{selectedEscala.culto}</h4>
                  <p className="text-sm text-gray-600">
                    {formatDate(selectedEscala.data)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-blue-600">
                    Líder: {selectedEscala.lider}
                  </p>
                </div>

                <div>
                  <h5 className="font-medium mb-2">Voluntários escalados:</h5>
                  <div className="space-y-1">
                    {selectedEscala.voluntarios.map((voluntario: any, index: number) => (
                      <div key={index} className="text-sm bg-gray-100 px-3 py-2 rounded">
                        {typeof voluntario === 'string' ? voluntario : voluntario.nome}
                      </div>
                    ))}
                  </div>
                </div>

                <Badge variant={getStatusColor(selectedEscala.status)}>
                  {selectedEscala.status}
                </Badge>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Escalas;
