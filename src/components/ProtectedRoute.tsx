
import { useAuth, UserType } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedUserTypes: UserType[];
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedUserTypes, 
  redirectTo = "/login" 
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!allowedUserTypes.includes(user.tipo)) {
    // Redirecionar para dashboard apropriado baseado no tipo do usuário
    switch (user.tipo) {
      case 'administrador':
        return <Navigate to="/admin" replace />;
      case 'lider':
        return <Navigate to="/lider/dashboard" replace />;
      case 'voluntario':
        return <Navigate to="/voluntario/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
};
