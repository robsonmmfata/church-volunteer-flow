
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Edit, Eye, Users } from "lucide-react";
import { toast } from "sonner";
import { useEscalas } from "@/contexts/EscalasContext";
import { useAuth } from "@/contexts/AuthContext";

const LiderEscalas = () => {
  const { escalas, updateEscala } = useEscalas();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedEscala, setSelectedEscala] = useState<any>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEscala, setEditingEscala] = useState<any>(null);

  // Filtrar apenas escalas onde o usuário é líder
  const minhasEscalas = escalas.filter(escala => escala.lider === user?.nome);

  // Mock data para voluntários disponíveis
  const voluntariosDisponiveis = [
    "João Silva", "Ana Santos", "Carlos Oliveira", "Maria Silva", 
    "Pedro Costa", "Lucia Oliveira", "Ricardo Lima", "Julia Santos"
  ];

  const handleEdit = (escala: any) => {
    setEditingEscala({ ...escala });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingEscala) return;
    
    const updatedData = {
      ...editingEscala,
      status: editingEscala.voluntarios.length === 5 ? "agendada" : "Incompleta"
    };
    
    updateEscala(editingEscala.id, updatedData, 'lider');
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

  const handleViewDetails = (escala: any) => {
    setSelectedEscala(escala);
    setIsDetailDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/lider/dashboard")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Minhas Escalas</h1>
            <p className="text-gray-600">Gerencie as escalas onde você é líder</p>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold">{minhasEscalas.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Agendadas</p>
                  <p className="text-2xl font-bold text-green-600">
                    {minhasEscalas.filter(e => e.status === "agendada").length}
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
                    {minhasEscalas.filter(e => e.status === "Incompleta").length}
                  </p>
                </div>
                <Users className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Escalas */}
        <Card>
          <CardHeader>
            <CardTitle>Escalas onde você é líder</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Culto</TableHead>
                    <TableHead>Voluntários</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {minhasEscalas.map((escala) => (
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
                        <div>
                          <p className="text-sm font-medium">
                            {escala.voluntarios.length}/5 voluntários
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {escala.voluntarios.slice(0, 2).map((voluntario: any, index: number) => (
                              <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {typeof voluntario === 'string' ? voluntario : voluntario.nome}
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
                        <Badge variant={escala.status === "agendada" ? "default" : "destructive"}>
                          {escala.status}
                        </Badge>
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
                            Detalhes
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {minhasEscalas.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Você não é líder de nenhuma escala no momento.</p>
                </div>
              )}
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
                    {new Date(selectedEscala.data).toLocaleDateString('pt-BR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
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

                <Badge variant={selectedEscala.status === "agendada" ? "default" : "destructive"}>
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

export default LiderEscalas;
