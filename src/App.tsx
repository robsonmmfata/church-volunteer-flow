
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Voluntarios from "./pages/Voluntarios";
import NovoVoluntario from "./pages/NovoVoluntario";
import Escalas from "./pages/Escalas";
import NovaEscala from "./pages/NovaEscala";
import Substituicoes from "./pages/Substituicoes";
import Configuracoes from "./pages/Configuracoes";
import { Navigation } from "./components/Navigation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/voluntarios" element={<Voluntarios />} />
          <Route path="/voluntarios/novo" element={<NovoVoluntario />} />
          <Route path="/escalas" element={<Escalas />} />
          <Route path="/escalas/nova" element={<NovaEscala />} />
          <Route path="/substituicoes" element={<Substituicoes />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
