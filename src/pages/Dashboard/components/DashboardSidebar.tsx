import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { useTheme } from "@/hooks/useTheme";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  CreditCard,
  Bell,
  Users,
  UserCheck,
  ScrollText,
  Settings,
} from "lucide-react";
import { SubscriptionSidebarCard } from "./SubscriptionSidebarCard";

export function DashboardSidebar() {
  const location = useLocation();
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const { getLogo } = useTheme();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const getMenuItems = () => [
    {
      title: t("dashboard.sidebar.cards"),
      icon: CreditCard,
      url: "/dashboard/cards",
    },
    {
      title: t("dashboard.sidebar.dashboard"),
      icon: LayoutDashboard,
      url: "/dashboard",
    },
    {
      title: t("dashboard.sidebar.notifications"),
      icon: Bell,
      url: "/dashboard/notifications",
    },
    {
      title: t("dashboard.sidebar.customers"),
      icon: Users,
      url: "/dashboard/customers",
    },
    {
      title: t("dashboard.sidebar.managers"),
      icon: UserCheck,
      url: "/dashboard/managers",
    },
    {
      title: t("dashboard.sidebar.logs"),
      icon: ScrollText,
      url: "/dashboard/logs",
    },
    {
      title: t("dashboard.sidebar.settings"),
      icon: Settings,
      url: "/dashboard/settings",
    },
  ];

  const menuItems = getMenuItems();

  return (
    <Sidebar 
      className={`${isRTL ? 'font-arabic' : 'font-sans'}`}
      collapsible="icon"
      side={isRTL ? "right" : "left"}
    >
      <SidebarHeader className="p-3">
        <div className="flex items-center justify-center">
          <div className="relative">
            {isCollapsed ? (
              <img src={getLogo('dashboard')} alt="Logo" className="h-7 w-7 object-contain" />
            ) : (
              <img src={getLogo('dashboard')} alt="Logo" className="h-12 w-auto" />
            )}
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        <SidebarMenu className="space-y-1">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                asChild 
                isActive={location.pathname === item.url}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-300 hover:bg-muted/50 hover:shadow-sm text-muted-foreground hover:text-foreground ${isRTL ? 'flex-row-reverse justify-end' : 'flex-row justify-start'}`}
              >
                <Link 
                  to={item.url} 
                  className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse justify-end' : 'flex-row justify-start'}`}
                >
                  {isRTL ? (
                    <>
                      <span className={`text-sm font-medium group-data-[collapsible=icon]:hidden text-right`}>
                        {item.title}
                      </span>
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                    </>
                  ) : (
                    <>
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span className={`text-sm font-medium group-data-[collapsible=icon]:hidden text-left`}>
                        {item.title}
                      </span>
                    </>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SubscriptionSidebarCard />
      </SidebarContent>
    </Sidebar>
  );
}
