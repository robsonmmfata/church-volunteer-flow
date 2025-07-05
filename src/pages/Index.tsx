
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Calendar, 
  RotateCcw, 
  Settings,
  CalendarDays,
  UserCheck
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Gestão de Voluntários - Igreja
          </h1>
          <p className="text-gray-600">
            Sistema completo para gerenciar escalas e voluntários
          </p>
        </header>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Escalas Ativas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                +2 desde última semana
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Voluntários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">
                8 líderes cadastrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximos Cultos</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                Com escala completa
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Substituições</CardTitle>
              <RotateCcw className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">
                Pendentes de aprovação
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-blue-600" />
                <CardTitle>Voluntários</CardTitle>
              </div>
              <CardDescription>
                Gerencie o cadastro de voluntários e líderes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/voluntarios">
                <Button className="w-full">Gerenciar Voluntários</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Calendar className="h-6 w-6 text-green-600" />
                <CardTitle>Escalas</CardTitle>
              </div>
              <CardDescription>
                Visualize e crie escalas por cultos e datas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/escalas">
                <Button className="w-full">Gerenciar Escalas</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <RotateCcw className="h-6 w-6 text-orange-600" />
                <CardTitle>Substituições</CardTitle>
              </div>
              <CardDescription>
                Acompanhe trocas e substituições de escala
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/substituicoes">
                <Button className="w-full">Ver Substituições</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Settings className="h-6 w-6 text-purple-600" />
                <CardTitle>Configurações</CardTitle>
              </div>
              <CardDescription>
                Ajuste limites e sincronize dados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/configuracoes">
                <Button className="w-full">Configurar Sistema</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
