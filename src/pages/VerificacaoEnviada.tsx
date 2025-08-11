import { useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const VerificacaoEnviada = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const email = params.get("email") || "seu e-mail";

  const link = useMemo(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("lastVerificationLink") || "null");
      if (saved && saved.email === params.get("email")) return saved.link as string;
      // fallback: reconstruir com token atual
      const map = JSON.parse(localStorage.getItem("verificationTokens") || "{}");
      const token = map[params.get("email") as string];
      if (token) return `${window.location.origin}/verificar-email?token=${token}&email=${encodeURIComponent(params.get("email") as string)}`;
    } catch {}
    return "";
  }, [location.search]);

  const copy = async () => {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    // Feedback simples via alert para evitar dependências
    alert("Link de verificação copiado!");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Confirme seu e-mail</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Enviamos um link de confirmação para: <strong>{email}</strong></p>
          {link && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Se preferir, copie o link manualmente:</p>
              <div className="text-xs break-all p-2 rounded border bg-white">{link}</div>
              <Button onClick={copy} className="w-full">Copiar link</Button>
            </div>
          )}
          <Link to="/login" className="block">
            <Button variant="outline" className="w-full">Ir para o Login</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificacaoEnviada;
