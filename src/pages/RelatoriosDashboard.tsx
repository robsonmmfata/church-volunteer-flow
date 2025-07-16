
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3, Users, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { RelatoriosVoluntarios } from '@/components/RelatoriosVoluntarios';
import { RelatoriosEscalas } from '@/components/RelatoriosEscalas';

const RelatoriosDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <BarChart3 className="h-8 w-8 mr-3" />
              Central de Relatórios
            </h1>
            <p className="text-gray-600">Análises e estatísticas do sistema</p>
          </div>
        </div>

        {/* Tabs de Relatórios */}
        <Tabs defaultValue="voluntarios" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="voluntarios" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Relatório de Voluntários</span>
            </TabsTrigger>
            <TabsTrigger value="escalas" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Relatório de Escalas</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="voluntarios">
            <RelatoriosVoluntarios />
          </TabsContent>

          <TabsContent value="escalas">
            <RelatoriosEscalas />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RelatoriosDashboard;
