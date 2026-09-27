import { Routes, Route, Navigate } from "react-router-dom";
import AdminGuard from "@/admin/components/AdminGuard";
import AdminLayout from "@/admin/components/AdminLayout";
import AdminDashboard from "@/admin/pages/AdminDashboard";
import AdminSections from "@/admin/pages/AdminSections";
import AdminBots from "@/admin/pages/AdminBots";
import AdminLeads from "@/admin/pages/AdminLeads";
import AdminSettings from "@/admin/pages/AdminSettings";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminGuard><AdminLayout /></AdminGuard>}>
        <Route index element={<Navigate to="/admin" replace />} />
        <Route path="" element={<AdminDashboard />} />
        <Route path="sections" element={<AdminSections />} />
        <Route path="bots" element={<AdminBots />} />
        <Route path="leads" element={<AdminLeads />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}
