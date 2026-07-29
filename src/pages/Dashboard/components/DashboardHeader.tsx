import React, { useMemo } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Bell, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function DashboardHeader() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const notificationCount = useMemo(() => {
    try {
      const raw = localStorage.getItem("notification_history");
      const history = raw ? JSON.parse(raw) : [];
      return Array.isArray(history) ? history.length : 0;
    } catch {
      return 0;
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className={`sticky top-0 z-40 flex h-16 items-center gap-2 border-b border-border bg-card/95 backdrop-blur-md shadow-md px-4 ${isRTL ? 'font-arabic' : 'font-sans'} flex-shrink-0`} dir={isRTL ? "rtl" : "ltr"}>
      <SidebarTrigger className={isRTL ? "-ml-1" : "-mr-1"} />
      
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          onClick={() => navigate("/dashboard/notifications")}
          title={t("dashboard.header.notifications") || "الإشعارات"}
        >
          <Bell className="h-4 w-4" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 ltr:-left-1 rtl:-right-1 h-5 w-5 rounded-full bg-red-500 text-[10px] text-primary-foreground flex items-center justify-center font-bold">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-[#7c88c4] text-white">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align={isRTL ? "start" : "end"} forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className={`text-sm font-medium leading-none ${isRTL ? 'text-right' : 'text-left'}`}>
                  {user?.name || t("dashboard.header.userAlt")}
                </p>
                <p className={`text-xs leading-none text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                  {user?.email || ""}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className={isRTL ? "text-right" : "text-left"}
              onClick={() => navigate("/dashboard/settings")}
            >
              {t("dashboard.header.profile")}
            </DropdownMenuItem>
            <DropdownMenuItem 
              className={isRTL ? "text-right" : "text-left"}
              onClick={() => navigate("/dashboard/settings")}
            >
              {t("dashboard.header.settings")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className={`text-red-600 ${isRTL ? 'text-right' : 'text-left'}`}
              onClick={handleLogout}
            >
              {t("dashboard.header.logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
