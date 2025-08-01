
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Heart, ArrowRight, CheckCircle, LogIn, UserPlus, User, Crown, Shield } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <Users className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold text-gray-900">Sistema de Voluntários</span>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => window.location.href = '/login'}>
              <LogIn className="h-4 w-4 mr-2" />
              Entrar
            </Button>
            <Button onClick={() => window.location.href = '/voluntario/cadastro'}>
              <UserPlus className="h-4 w-4 mr-2" />
              Quero me Voluntariar
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Faça Parte da Nossa
          <span className="text-blue-600 block">Equipe de Voluntários</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Junte-se a nós e faça a diferença na vida das pessoas. 
          Sua participação é essencial para o crescimento da nossa comunidade.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="text-lg px-8 py-3" onClick={() => window.location.href = '/voluntario/cadastro'}>
            <Heart className="h-5 w-5 mr-2" />
            Quero me Voluntariar
          </Button>
          
          <Button size="lg" variant="outline" className="text-lg px-8 py-3" onClick={() => window.location.href = '/login'}>
            <LogIn className="h-5 w-5 mr-2" />
            Já tenho Cadastro
          </Button>
        </div>
      </div>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Por que ser voluntário?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <CardTitle>Impacto Real</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Faça a diferença na vida das pessoas e contribua para o crescimento da nossa comunidade
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <CardTitle>Comunidade</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Conecte-se com pessoas que compartilham os mesmos valores e propósitos
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Calendar className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <CardTitle>Flexibilidade</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Escolha os horários que melhor se adequam à sua disponibilidade
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tipos de Acesso */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Diferentes Níveis de Acesso
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <User className="h-8 w-8" />
            </div>
            <CardHeader>
              <CardTitle>Voluntário</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Consulte suas escalas, informe disponibilidade e gerencie substituições.
              </p>
              <Button variant="outline" className="w-full" onClick={() => window.location.href = '/login'}>
                Acesso Voluntário
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <div className="bg-green-100 text-green-600 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Crown className="h-8 w-8" />
            </div>
            <CardHeader>
              <CardTitle>Líder</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Gerencie sua equipe, aprove substituições e organize escalas.
              </p>
              <Button variant="outline" className="w-full" onClick={() => window.location.href = '/login'}>
                Acesso Líder
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <div className="bg-purple-100 text-purple-600 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Shield className="h-8 w-8" />
            </div>
            <CardHeader>
              <CardTitle>Administrador</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Controle total do sistema, cadastre voluntários e configure regras.
              </p>
              <Button variant="outline" className="w-full" onClick={() => window.location.href = '/login'}>
                Acesso Admin
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* How it works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Como funciona?
          </h2>
          
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 text-blue-600 rounded-full p-2 flex-shrink-0">
                <span className="font-bold text-lg">1</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Cadastre-se</h3>
                <p className="text-gray-600">
                  Preencha o formulário com seus dados e preferências de horário
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 text-blue-600 rounded-full p-2 flex-shrink-0">
                <span className="font-bold text-lg">2</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Aprovação</h3>
                <p className="text-gray-600">
                  Nossa equipe entrará em contato para confirmar seu cadastro
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 text-blue-600 rounded-full p-2 flex-shrink-0">
                <span className="font-bold text-lg">3</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Participe</h3>
                <p className="text-gray-600">
                  Acesse seu painel pessoal e gerencie sua disponibilidade
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Pronto para começar?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a nós e faça parte desta família de voluntários
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-4" onClick={() => window.location.href = '/voluntario/cadastro'}>
            Cadastrar-se Agora
            <CheckCircle className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p>&copy; 2025 Voluntários Igreja. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
