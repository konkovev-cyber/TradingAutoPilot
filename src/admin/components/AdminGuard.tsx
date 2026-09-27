import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/admin/hooks/useAuth";
import { ShieldAlert } from "lucide-react";

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-lg">Загрузка...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert size={32} className="text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Доступ запрещен</h1>
          <p className="text-gray-400 mb-8">
            У вашей учетной записи нет прав администратора. Обратитесь к владельцу сайта, чтобы получить доступ.
          </p>
          <Link to="/" className="text-brand-blue font-semibold hover:underline">На главную</Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
