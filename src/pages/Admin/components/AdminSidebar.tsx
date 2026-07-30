import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { useTheme } from "@/hooks/useTheme";
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Building2,
  Settings,
  BarChart3,
  Shield,
  LogOut,
  FileText,
} from "lucide-react";

export function AdminSidebar() {
  const location = useLocation();
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const { getLogo } = useTheme();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const getMenuItems = () => [
    {
      title: t("admin.sidebar.dashboard"),
      icon: LayoutDashboard,
      url: "/admin",
    },
    {
      title: t("admin.sidebar.management"),
      icon: Building2,
      url: "/admin/management",
    },
    {
      title: t("admin.sidebar.plans"),
      icon: Shield,
      url: "/admin/plans",
    },
    {
      title: t("admin.sidebar.reportsAnalytics"),
      icon: BarChart3,
      url: "/admin/reports-analytics",
    },
    {
      title: t("admin.sidebar.systemLogs"),
      icon: FileText,
      url: "/admin/system-logs",
    },
    {
      title: t("admin.sidebar.settings"),
      icon: Settings,
      url: "/admin/settings",
    },
  ];

  const menuItems = getMenuItems();

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      window.location.href = "/admin/login";
    }, 500);
  };

  return (
    <Sidebar 
      className={`${isRTL ? 'font-arabic' : 'font-sans'}`}
      collapsible="icon"
      side={isRTL ? "right" : "left"}
    >
      <SidebarHeader className="p-2 border-b">
        <div className="flex items-center justify-center">
          <div className="relative">
            <img 
              src={getLogo('admin')} 
              alt="Logo" 
              className="h-10 w-auto"
            />
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-1.5">
        <SidebarGroup>
          <SidebarGroupLabel className={`text-[10px] font-medium text-muted-foreground px-2 py-1.5 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t("admin.sidebar.mainMenu")}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-md transition-all duration-300 hover:bg-muted/50 hover:shadow-sm text-muted-foreground hover:text-foreground ${isRTL ? "flex-row-reverse justify-end" : "flex-row justify-start"}`}
                  >
                    <Link
                      to={item.url}
                      className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse justify-end" : "flex-row justify-start"}`}
                    >
                      {isRTL ? (
                        <>
                          <span className={`text-xs font-medium group-data-[collapsible=icon]:hidden text-right`}>
                            {item.title}
                          </span>
                          <item.icon className="w-4 h-4 flex-shrink-0" />
                        </>
                      ) : (
                        <>
                          <item.icon className="w-4 h-4 flex-shrink-0" />
                          <span className={`text-xs font-medium group-data-[collapsible=icon]:hidden text-left`}>
                            {item.title}
                          </span>
                        </>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarSeparator />
      
      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-md transition-all duration-200 ${
                isLoggingOut 
                  ? 'text-red-500 bg-red-100 cursor-not-allowed opacity-75' 
                  : 'text-red-600 hover:text-red-700 hover:bg-red-50'
              } ${isRTL ? 'flex-row-reverse justify-end' : 'flex-row justify-start'}`}
            >
              {isRTL ? (
                <>
                  <span className={`text-xs font-medium group-data-[collapsible=icon]:hidden text-right`}>
                    {isLoggingOut ? t("admin.sidebar.loggingOut") : t("admin.sidebar.logout")}
                  </span>
                  <LogOut className={`w-4 h-4 flex-shrink-0 ${isLoggingOut ? 'animate-spin' : ''}`} />
                </>
              ) : (
                <>
                  <LogOut className={`w-4 h-4 flex-shrink-0 ${isLoggingOut ? 'animate-spin' : ''}`} />
                  <span className={`text-xs font-medium group-data-[collapsible=icon]:hidden text-left`}>
                    {isLoggingOut ? t("admin.sidebar.loggingOut") : t("admin.sidebar.logout")}
                  </span>
                </>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
