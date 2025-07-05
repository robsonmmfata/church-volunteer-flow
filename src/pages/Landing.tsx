
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Heart, ArrowRight, CheckCircle } from "lucide-react";

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
            <span className="text-xl font-bold text-gray-900">
              Voluntários Igreja
            </span>
          </div>
          <Link to="/admin">
            <Button variant="outline">
              Área Administrativa
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Seja um <span className="text-blue-600">Voluntário</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Faça parte da nossa equipe de voluntários e ajude a transformar vidas através do serviço ao próximo
          </p>
          <Link to="/voluntario/cadastro">
            <Button size="lg" className="text-lg px-8 py-4">
              Quero me Voluntariar
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

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
          <Link to="/voluntario/cadastro">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
              Cadastrar-se Agora
              <CheckCircle className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p>&copy; 2024 Voluntários Igreja. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
