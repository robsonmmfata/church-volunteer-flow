import { useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const VerificarEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const email = params.get("email");

    if (!token || !email) return;

    const map = JSON.parse(localStorage.getItem("verificationTokens") || "{}");
    const expected = map[email as string];

    if (expected && expected === token) {
      // marcar usuário como verificado
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const idx = users.findIndex((u: any) => u.email === email);
      if (idx !== -1) {
        users[idx].verified = true;
        localStorage.setItem("users", JSON.stringify(users));
      }
      delete map[email as string];
      localStorage.setItem("verificationTokens", JSON.stringify(map));

      toast.success("E-mail verificado com sucesso! Você já pode fazer login.");
      setTimeout(() => navigate("/login"), 800);
    } else {
      toast.error("Link inválido ou expirado.");
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Verificação de E-mail</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">Estamos processando seu link de verificação...</p>
          <Link to="/login">
            <Button className="w-full">Ir para o Login</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificarEmail;
