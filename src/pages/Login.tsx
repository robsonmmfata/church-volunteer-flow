
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth, UserType } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Users, LogIn, UserPlus } from "lucide-react";

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    tipo: 'voluntario' as UserType
  });

  const [registerData, setRegisterData] = useState({
    nome: '',
    email: '',
    password: '',
    tipo: 'voluntario' as UserType,
    celular: ''
  });

  const { login, register, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await login(loginData.email, loginData.password, loginData.tipo);
    
    if (success) {
      toast({
        title: "Login realizado com sucesso!",
        description: "Redirecionando...",
      });
      
      // Redirecionar baseado no tipo de usuário
      switch (loginData.tipo) {
        case 'administrador':
          navigate('/admin');
          break;
        case 'lider':
          navigate('/lider/dashboard');
          break;
        case 'voluntario':
          navigate('/voluntario/dashboard');
          break;
      }
    } else {
      toast({
        title: "Erro no login",
        description: "Email, senha ou tipo de usuário incorretos.",
        variant: "destructive",
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await register(registerData);
    
    if (success) {
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Você já está logado.",
      });
      
      // Redirecionar baseado no tipo de usuário
      switch (registerData.tipo) {
        case 'administrador':
          navigate('/admin');
          break;
        case 'lider':
          navigate('/lider/dashboard');
          break;
        case 'voluntario':
          navigate('/voluntario/dashboard');
          break;
      }
    } else {
      toast({
        title: "Erro no cadastro",
        description: "Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-blue-600 text-white p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Users className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Sistema de Voluntários</h1>
          <p className="text-gray-600">Entre na sua conta ou crie uma nova</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Login
            </TabsTrigger>
            <TabsTrigger value="register" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Cadastro
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Fazer Login</CardTitle>
                <CardDescription>
                  Entre com suas credenciais para acessar o sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-tipo">Tipo de Usuário</Label>
                    <Select 
                      value={loginData.tipo} 
                      onValueChange={(value: UserType) => setLoginData({...loginData, tipo: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="voluntario">Voluntário</SelectItem>
                        <SelectItem value="lider">Líder</SelectItem>
                        <SelectItem value="administrador">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="login-password">Senha</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Entrando..." : "Entrar"}
                  </Button>
                </form>

                <div className="mt-4 text-sm text-gray-600">
                  <p><strong>Contas de teste:</strong></p>
                  <p>Admin: admin@igreja.com</p>
                  <p>Líder: joao@igreja.com</p>
                  <p>Voluntário: maria@igreja.com</p>
                  <p>Senha: 123456</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Criar Conta</CardTitle>
                <CardDescription>
                  Preencha os dados para criar sua conta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label htmlFor="register-tipo">Tipo de Usuário</Label>
                    <Select 
                      value={registerData.tipo} 
                      onValueChange={(value: UserType) => setRegisterData({...registerData, tipo: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="voluntario">Voluntário</SelectItem>
                        <SelectItem value="lider">Líder</SelectItem>
                        <SelectItem value="administrador">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="register-nome">Nome Completo</Label>
                    <Input
                      id="register-nome"
                      value={registerData.nome}
                      onChange={(e) => setRegisterData({...registerData, nome: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="register-celular">Celular (opcional)</Label>
                    <Input
                      id="register-celular"
                      value={registerData.celular}
                      onChange={(e) => setRegisterData({...registerData, celular: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="register-password">Senha</Label>
                    <Input
                      id="register-password"
                      type="password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Criando..." : "Criar Conta"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center">
          <Link to="/" className="text-blue-600 hover:underline">
            ← Voltar para o início
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
