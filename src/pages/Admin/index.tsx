import { Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "./components/AdminSidebar";
import { AdminHeader } from "./components/AdminHeader";
import { AdminContent } from "./components/AdminContent";
import { ManagementPage } from "./pages/ManagementPage";
import { ReportsAnalyticsPage } from "./pages/ReportsAnalyticsPage";
import { StoreDetailsPage } from "./pages/StoreDetailsPage";
import { PlansPage } from "./pages/PlansPage";
import { SystemLogsPage } from "./pages/SystemLogsPage";
import { AdminSettingsPage } from "./pages/AdminSettingsPage";
import { useDirection } from "@/hooks/useDirection";
import { useTheme } from "@/hooks/useTheme";
import { useEffect } from "react";

export default function Admin() {
  const { isRTL, language } = useDirection();
  const { applyTheme } = useTheme();

  useEffect(() => {
    applyTheme('admin');
  }, [applyTheme]);

  return (
    <div 
      dir={isRTL ? "rtl" : "ltr"} 
      lang={language} 
      className={`${isRTL ? 'font-arabic' : 'font-sans'} flex h-screen bg-gradient-to-br from-background to-muted/30`}
    >
      <SidebarProvider defaultOpen={true}>
        <AdminSidebar />
        <div className="flex flex-col w-full h-screen overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            <Routes>
              <Route path="/" element={<AdminContent />} />
              <Route path="/management" element={<ManagementPage />} />
              <Route path="/reports-analytics" element={<ReportsAnalyticsPage />} />
              <Route path="/stores/:id" element={<StoreDetailsPage />} />
              <Route path="/plans" element={<PlansPage />} />
              <Route path="/system-logs" element={<SystemLogsPage />} />
              <Route path="/settings" element={<AdminSettingsPage />} />
            </Routes>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
