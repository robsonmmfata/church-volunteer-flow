
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Voluntarios from "./pages/Voluntarios";
import NovoVoluntario from "./pages/NovoVoluntario";
import Escalas from "./pages/Escalas";
import NovaEscala from "./pages/NovaEscala";
import Substituicoes from "./pages/Substituicoes";
import Configuracoes from "./pages/Configuracoes";
import VoluntarioCadastro from "./pages/VoluntarioCadastro";
import VoluntarioDashboard from "./pages/VoluntarioDashboard";
import LiderDashboard from "./pages/LiderDashboard";
import PerfilUsuario from "./pages/PerfilUsuario";
import DisponibilidadeVoluntario from "./pages/DisponibilidadeVoluntario";
import SolicitarSubstituicao from "./pages/SolicitarSubstituicao";
import { Navigation } from "./components/Navigation";

const queryClient = new QueryClient();

// Layout para área administrativa
const AdminLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Navigation />
    {children}
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Páginas públicas */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/voluntario/cadastro" element={<VoluntarioCadastro />} />
            
            {/* Área do voluntário - protegida */}
            <Route 
              path="/voluntario/dashboard" 
              element={
                <ProtectedRoute allowedUserTypes={['voluntario']}>
                  <VoluntarioDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/voluntario/perfil" 
              element={
                <ProtectedRoute allowedUserTypes={['voluntario']}>
                  <PerfilUsuario />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/voluntario/disponibilidade" 
              element={
                <ProtectedRoute allowedUserTypes={['voluntario']}>
                  <DisponibilidadeVoluntario />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/voluntario/solicitar-substituicao" 
              element={
                <ProtectedRoute allowedUserTypes={['voluntario']}>
                  <SolicitarSubstituicao />
                </ProtectedRoute>
              } 
            />
            
            {/* Área do líder - protegida */}
            <Route 
              path="/lider/dashboard" 
              element={
                <ProtectedRoute allowedUserTypes={['lider']}>
                  <LiderDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/lider/perfil" 
              element={
                <ProtectedRoute allowedUserTypes={['lider']}>
                  <PerfilUsuario />
                </ProtectedRoute>
              } 
            />
            
            {/* Área administrativa - protegida */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedUserTypes={['administrador']}>
                  <AdminLayout><Index /></AdminLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/perfil" 
              element={
                <ProtectedRoute allowedUserTypes={['administrador']}>
                  <PerfilUsuario />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/voluntarios" 
              element={
                <ProtectedRoute allowedUserTypes={['administrador']}>
                  <AdminLayout><Voluntarios /></AdminLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/voluntarios/novo" 
              element={
                <ProtectedRoute allowedUserTypes={['administrador']}>
                  <AdminLayout><NovoVoluntario /></AdminLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/escalas" 
              element={
                <ProtectedRoute allowedUserTypes={['administrador', 'lider']}>
                  <AdminLayout><Escalas /></AdminLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/escalas/nova" 
              element={
                <ProtectedRoute allowedUserTypes={['administrador', 'lider']}>
                  <AdminLayout><NovaEscala /></AdminLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/substituicoes" 
              element={
                <ProtectedRoute allowedUserTypes={['administrador', 'lider']}>
                  <AdminLayout><Substituicoes /></AdminLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/configuracoes" 
              element={
                <ProtectedRoute allowedUserTypes={['administrador']}>
                  <AdminLayout><Configuracoes /></AdminLayout>
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
