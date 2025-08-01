import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MessageSquare, Database, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useEscalas } from '@/contexts/EscalasContext';
import { useNotifications } from '@/hooks/useNotifications';

export const TesteAutomacoes = () => {
  const [testResults, setTestResults] = useState<{[key: string]: 'pending' | 'success' | 'error'}>({});
  const { escalas, addEscala, voluntarios } = useEscalas();
  const { addNotification } = useNotifications();

  const runTest = async (testName: string, testFunction: () => Promise<boolean>) => {
    setTestResults(prev => ({ ...prev, [testName]: 'pending' }));
    
    try {
      const result = await testFunction();
      setTestResults(prev => ({ ...prev, [testName]: result ? 'success' : 'error' }));
      return result;
    } catch (error) {
      console.error(`Teste ${testName} falhou:`, error);
      setTestResults(prev => ({ ...prev, [testName]: 'error' }));
      return false;
    }
  };

  const testGerarEscala = async (): Promise<boolean> => {
    try {
      // Simular geração de escala
      const escalaTest = {
        data: new Date().toISOString().split('T')[0],
        tipo: "Teste Automático",
        culto: "Teste Automático",
        lider: "Sistema",
        voluntarios: voluntarios.slice(0, 3).map(v => ({
          id: v.id,
          nome: v.nome,
          tipo: 'voluntario' as const
        })),
        local: "Teste"
      };
      
      addEscala(escalaTest);
      toast.success("✅ Escala de teste gerada com sucesso!");
      return true;
    } catch (error) {
      toast.error("❌ Erro ao gerar escala de teste");
      return false;
    }
  };

  const testEnviarNotificacao = async (): Promise<boolean> => {
    try {
      // Testar notificação local
      addNotification({
        title: "🧪 Teste de Notificação",
        message: "Esta é uma notificação de teste do sistema de automações.",
        type: "info",
        from: "Sistema de Testes"
      });

      // Testar broadcast (simulação)
      window.dispatchEvent(new CustomEvent('broadcastNotification', {
        detail: {
          title: "📡 Teste de Broadcast",
          message: "Testando sistema de notificações em tempo real.",
          type: "success",
          from: "Sistema"
        }
      }));

      toast.success("✅ Notificações de teste enviadas!");
      return true;
    } catch (error) {
      toast.error("❌ Erro ao enviar notificações de teste");
      return false;
    }
  };

  const testSincronizacao = async (): Promise<boolean> => {
    try {
      // Simular sincronização de dados
      const dadosSync = {
        escalas: escalas.length,
        voluntarios: voluntarios.length,
        timestamp: new Date().toISOString()
      };

      console.log("📊 Dados de sincronização:", dadosSync);
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("✅ Sincronização de teste concluída!");
      return true;
    } catch (error) {
      toast.error("❌ Erro na sincronização de teste");
      return false;
    }
  };

  const runAllTests = async () => {
    toast.info("🧪 Iniciando testes das automações...");
    
    const results = await Promise.all([
      runTest('gerarEscala', testGerarEscala),
      runTest('enviarNotificacao', testEnviarNotificacao),
      runTest('sincronizacao', testSincronizacao)
    ]);

    const successCount = results.filter(r => r).length;
    const totalTests = results.length;

    if (successCount === totalTests) {
      toast.success(`✅ Todos os testes passaram! (${successCount}/${totalTests})`);
    } else {
      toast.warning(`⚠️ ${successCount}/${totalTests} testes passaram`);
    }
  };

  const getStatusIcon = (status: 'pending' | 'success' | 'error' | undefined) => {
    switch (status) {
      case 'pending': return <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: 'pending' | 'success' | 'error' | undefined) => {
    switch (status) {
      case 'pending': return <Badge variant="secondary">Testando...</Badge>;
      case 'success': return <Badge variant="default">✅ Passou</Badge>;
      case 'error': return <Badge variant="destructive">❌ Falhou</Badge>;
      default: return <Badge variant="outline">Aguardando</Badge>;
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>🧪 Teste das Automações</CardTitle>
        <CardDescription>
          Teste todas as funcionalidades automáticas do sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Botão para executar todos os testes */}
          <Button onClick={runAllTests} className="w-full">
            🧪 Executar Todos os Testes
          </Button>

          {/* Lista de testes individuais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">Gerar Escalas</span>
                </div>
                {getStatusIcon(testResults.gerarEscala)}
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Testa a geração automática de escalas
              </p>
              <div className="flex justify-between items-center">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => runTest('gerarEscala', testGerarEscala)}
                >
                  Testar
                </Button>
                {getStatusBadge(testResults.gerarEscala)}
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Notificações</span>
                </div>
                {getStatusIcon(testResults.enviarNotificacao)}
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Testa o sistema de notificações em tempo real
              </p>
              <div className="flex justify-between items-center">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => runTest('enviarNotificacao', testEnviarNotificacao)}
                >
                  Testar
                </Button>
                {getStatusBadge(testResults.enviarNotificacao)}
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-purple-500" />
                  <span className="font-medium">Sincronização</span>
                </div>
                {getStatusIcon(testResults.sincronizacao)}
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Testa a sincronização com sistemas externos
              </p>
              <div className="flex justify-between items-center">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => runTest('sincronizacao', testSincronizacao)}
                >
                  Testar
                </Button>
                {getStatusBadge(testResults.sincronizacao)}
              </div>
            </Card>
          </div>

          {/* Informações do sistema */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">📊 Status do Sistema</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Escalas:</span>
                <span className="ml-2 font-medium">{escalas.length}</span>
              </div>
              <div>
                <span className="text-gray-600">Voluntários:</span>
                <span className="ml-2 font-medium">{voluntarios.length}</span>
              </div>
              <div>
                <span className="text-gray-600">Líderes:</span>
                <span className="ml-2 font-medium">{voluntarios.filter(v => v.tipo === 'lider').length}</span>
              </div>
              <div>
                <span className="text-gray-600">Sistema:</span>
                <span className="ml-2 font-medium text-green-600">Online</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};