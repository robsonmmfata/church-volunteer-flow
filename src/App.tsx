
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
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
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Landing page pública */}
          <Route path="/" element={<Landing />} />
          
          {/* Área do voluntário */}
          <Route path="/voluntario/cadastro" element={<VoluntarioCadastro />} />
          <Route path="/voluntario/dashboard" element={<VoluntarioDashboard />} />
          
          {/* Área administrativa */}
          <Route path="/admin" element={<AdminLayout><Index /></AdminLayout>} />
          <Route path="/admin/voluntarios" element={<AdminLayout><Voluntarios /></AdminLayout>} />
          <Route path="/admin/voluntarios/novo" element={<AdminLayout><NovoVoluntario /></AdminLayout>} />
          <Route path="/admin/escalas" element={<AdminLayout><Escalas /></AdminLayout>} />
          <Route path="/admin/escalas/nova" element={<AdminLayout><NovaEscala /></AdminLayout>} />
          <Route path="/admin/substituicoes" element={<AdminLayout><Substituicoes /></AdminLayout>} />
          <Route path="/admin/configuracoes" element={<AdminLayout><Configuracoes /></AdminLayout>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
