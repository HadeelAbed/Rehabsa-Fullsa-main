import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Search, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

export function AdminHeader() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();

  return (
    <header className={`sticky top-0 z-40 flex h-12 items-center gap-2 border-b border-border bg-card/95 backdrop-blur-md shadow-sm px-3 ${isRTL ? 'font-arabic' : 'font-sans'} flex-shrink-0`} dir={isRTL ? "rtl" : "ltr"}>
      <SidebarTrigger className={isRTL ? "-ml-1" : "-mr-1"} />
      
      <div className={`flex flex-1 items-center gap-2 px-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className="relative flex-1 max-w-xs">
          <Search className={`absolute top-2 ${isRTL ? 'left-2' : 'right-2'} h-3.5 w-3.5 text-muted-foreground`} />
          <Input
            placeholder={t("admin.header.searchPlaceholder")}
            className={`h-7 text-xs ${isRTL ? 'pl-7 pr-3 text-right' : 'pr-7 pl-3 text-left'}`}
            dir={isRTL ? "rtl" : "ltr"}
          />
        </div>
      </div>
      
      <div className={`flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
        <LanguageSwitcher />
        
        <Button variant="ghost" size="icon" className="relative h-7 w-7">
          <Bell className="h-3.5 w-3.5" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-7 w-7 rounded-full">
              <Avatar className="h-7 w-7">
                <AvatarImage src="/avatars/admin.png" alt={t("admin.header.adminAlt")} />
                <AvatarFallback>
                  <User className="h-3.5 w-3.5" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-44 min-w-0" align={isRTL ? "start" : "end"} forceMount>
            <DropdownMenuLabel className="font-normal py-1.5 px-2">
              <div className="flex flex-col space-y-0.5">
                <p className={`text-xs font-medium leading-tight ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t("admin.header.adminName")}
                </p>
                <p className={`text-[10px] leading-tight text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t("admin.header.adminEmail")}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className={`${isRTL ? "text-right" : "text-left"} text-xs py-1.5 px-2`}>
              {t("admin.header.profile")}
            </DropdownMenuItem>
            <DropdownMenuItem className={`${isRTL ? "text-right" : "text-left"} text-xs py-1.5 px-2`}>
              {t("admin.header.settings")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className={`text-red-600 ${isRTL ? 'text-right' : 'text-left'} text-xs py-1.5 px-2`}>
              {t("admin.header.logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
