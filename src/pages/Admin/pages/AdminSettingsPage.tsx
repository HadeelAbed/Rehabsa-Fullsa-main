import React from "react";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Settings,
  Save,
  User,
  Bell,
  Shield,
  Database,
  Mail,
  Eye,
  EyeOff,
  Globe,
} from "lucide-react";
import { toast } from "sonner";

export function AdminSettingsPage() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const [showPassword, setShowPassword] = React.useState(false);
  const [settings, setSettings] = React.useState({
    // General Settings
    siteName: "رحاب - نظام إدارة بطاقات الولاء",
    siteDescription: "منصة متقدمة لإدارة بطاقات الولاء الرقمية",
    defaultLanguage: "ar",
    timezone: "Asia/Riyadh",
    
    // Admin Settings
    adminName: "المسؤول الأعلى",
    adminEmail: "admin@rehabsa.com",
    adminPhone: "+966501234567",
    
    // Security Settings
    enableTwoFactor: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    
    // System Settings
    maintenanceMode: false,
    debugMode: false,
    autoBackup: true,
    backupFrequency: "daily",
    
    // Email Settings
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpUsername: "noreply@rehabsa.com",
    smtpPassword: "********",
    smtpSecure: true,
    
    // SMS Settings
    smsProvider: "twilio",
    smsApiKey: "********",
    smsApiSecret: "********",
  });

  const handleSaveSettings = () => {
    toast.success(t("admin.settings.saveSuccess"));
  };

  const handleResetSettings = () => {
    toast.success(t("admin.settings.resetSuccess"));
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className={`flex flex-col gap-3 p-3 h-full ${isRTL ? 'font-arabic' : 'font-sans'}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row' : 'flex-row'}`}>
        <h1 className={`text-base font-semibold flex items-center gap-1.5 ${isRTL ? 'text-left' : 'text-right'}`}>
          <Settings className="h-4 w-4" />
          {t("admin.settings.title")}
        </h1>
        <div className="flex items-center gap-1.5">
          <Button onClick={handleSaveSettings} className="h-7 text-xs px-2">
            <span>{t("admin.settings.save")}</span>
            <Save className="h-3 w-3" />
          </Button>
          <Button onClick={handleResetSettings} variant="outline" className="h-7 text-xs px-2">
            {t("admin.settings.reset")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* General Settings */}
        <Card>
          <CardHeader className="py-2 px-3">
            <CardTitle className={`flex items-center gap-1.5 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Globe className="h-4 w-4" />
              {t("admin.settings.generalSettings")}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 space-y-2">
            <div className="space-y-1">
              <Label className="text-[11px]">{t("admin.settings.siteName")}</Label>
              <Input id="siteName" value={settings.siteName} onChange={(e) => updateSetting("siteName", e.target.value)} className="h-7 text-xs" dir={isRTL ? "rtl" : "ltr"} />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px]">{t("admin.settings.siteDescription")}</Label>
              <Textarea id="siteDescription" value={settings.siteDescription} onChange={(e) => updateSetting("siteDescription", e.target.value)} className="text-xs" rows={2} dir={isRTL ? "rtl" : "ltr"} />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px]">{t("admin.settings.defaultLanguage")}</Label>
              <select id="defaultLanguage" value={settings.defaultLanguage} onChange={(e) => updateSetting("defaultLanguage", e.target.value)} className="w-full h-7 text-xs px-2 border border-gray-300 rounded-md">
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label className="text-[11px]">{t("admin.settings.timezone")}</Label>
              <select id="timezone" value={settings.timezone} onChange={(e) => updateSetting("timezone", e.target.value)} className="w-full h-7 text-xs px-2 border border-gray-300 rounded-md">
                <option value="Asia/Riyadh">الرياض (GMT+3)</option>
                <option value="Asia/Dubai">دبي (GMT+4)</option>
                <option value="UTC">UTC (GMT+0)</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Admin Settings */}
        <Card>
          <CardHeader className="py-2 px-3">
            <CardTitle className={`flex items-center gap-1.5 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
              <User className="h-4 w-4" />
              {t("admin.settings.adminSettings")}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 space-y-2">
            <div className="space-y-1">
              <Label className="text-[11px]">{t("admin.settings.adminName")}</Label>
              <Input id="adminName" value={settings.adminName} onChange={(e) => updateSetting("adminName", e.target.value)} className="h-7 text-xs" dir={isRTL ? "rtl" : "ltr"} />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px]">{t("admin.settings.adminEmail")}</Label>
              <Input id="adminEmail" type="email" value={settings.adminEmail} onChange={(e) => updateSetting("adminEmail", e.target.value)} className="h-7 text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px]">{t("admin.settings.adminPhone")}</Label>
              <Input id="adminPhone" value={settings.adminPhone} onChange={(e) => updateSetting("adminPhone", e.target.value)} className="h-7 text-xs" />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader className="py-2 px-3">
            <CardTitle className={`flex items-center gap-1.5 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Shield className="h-4 w-4" />
              {t("admin.settings.securitySettings")}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 space-y-2">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Label className="text-[11px]">{t("admin.settings.enableTwoFactor")}</Label>
              <Switch id="enableTwoFactor" checked={settings.enableTwoFactor} onCheckedChange={(checked) => updateSetting("enableTwoFactor", checked)} />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px]">{t("admin.settings.sessionTimeout")}</Label>
              <Input id="sessionTimeout" type="number" value={settings.sessionTimeout} onChange={(e) => updateSetting("sessionTimeout", parseInt(e.target.value))} className="h-7 text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px]">{t("admin.settings.maxLoginAttempts")}</Label>
              <Input id="maxLoginAttempts" type="number" value={settings.maxLoginAttempts} onChange={(e) => updateSetting("maxLoginAttempts", parseInt(e.target.value))} className="h-7 text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px]">{t("admin.settings.passwordMinLength")}</Label>
              <Input id="passwordMinLength" type="number" value={settings.passwordMinLength} onChange={(e) => updateSetting("passwordMinLength", parseInt(e.target.value))} className="h-7 text-xs" />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader className="py-2 px-3">
            <CardTitle className={`flex items-center gap-1.5 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Bell className="h-4 w-4" />
              {t("admin.settings.notificationSettings")}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 space-y-2">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Label className="text-[11px]">{t("admin.settings.emailNotifications")}</Label>
              <Switch id="emailNotifications" checked={settings.emailNotifications} onCheckedChange={(checked) => updateSetting("emailNotifications", checked)} />
            </div>
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Label className="text-[11px]">{t("admin.settings.smsNotifications")}</Label>
              <Switch id="smsNotifications" checked={settings.smsNotifications} onCheckedChange={(checked) => updateSetting("smsNotifications", checked)} />
            </div>
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Label className="text-[11px]">{t("admin.settings.pushNotifications")}</Label>
              <Switch id="pushNotifications" checked={settings.pushNotifications} onCheckedChange={(checked) => updateSetting("pushNotifications", checked)} />
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader className="py-2 px-3">
            <CardTitle className={`flex items-center gap-1.5 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Database className="h-4 w-4" />
              {t("admin.settings.systemSettings")}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 space-y-2">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Label className="text-[11px]">{t("admin.settings.maintenanceMode")}</Label>
              <Switch id="maintenanceMode" checked={settings.maintenanceMode} onCheckedChange={(checked) => updateSetting("maintenanceMode", checked)} />
            </div>
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Label className="text-[11px]">{t("admin.settings.debugMode")}</Label>
              <Switch id="debugMode" checked={settings.debugMode} onCheckedChange={(checked) => updateSetting("debugMode", checked)} />
            </div>
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Label className="text-[11px]">{t("admin.settings.autoBackup")}</Label>
              <Switch id="autoBackup" checked={settings.autoBackup} onCheckedChange={(checked) => updateSetting("autoBackup", checked)} />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px]">{t("admin.settings.backupFrequency")}</Label>
              <select id="backupFrequency" value={settings.backupFrequency} onChange={(e) => updateSetting("backupFrequency", e.target.value)} className="w-full h-7 text-xs px-2 border border-gray-300 rounded-md">
                <option value="hourly">{t("admin.settings.hourly")}</option>
                <option value="daily">{t("admin.settings.daily")}</option>
                <option value="weekly">{t("admin.settings.weekly")}</option>
                <option value="monthly">{t("admin.settings.monthly")}</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card>
          <CardHeader className="py-2 px-3">
            <CardTitle className={`flex items-center gap-1.5 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Mail className="h-4 w-4" />
              {t("admin.settings.emailSettings")}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 space-y-2">
            <div className="space-y-1">
              <Label className="text-[11px]">{t("admin.settings.smtpHost")}</Label>
              <Input id="smtpHost" value={settings.smtpHost} onChange={(e) => updateSetting("smtpHost", e.target.value)} className="h-7 text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px]">{t("admin.settings.smtpPort")}</Label>
              <Input id="smtpPort" type="number" value={settings.smtpPort} onChange={(e) => updateSetting("smtpPort", parseInt(e.target.value))} className="h-7 text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px]">{t("admin.settings.smtpUsername")}</Label>
              <Input id="smtpUsername" value={settings.smtpUsername} onChange={(e) => updateSetting("smtpUsername", e.target.value)} className="h-7 text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px]">{t("admin.settings.smtpPassword")}</Label>
              <div className="relative">
                <Input id="smtpPassword" type={showPassword ? "text" : "password"} value={settings.smtpPassword} onChange={(e) => updateSetting("smtpPassword", e.target.value)} className="h-7 text-xs pr-7" />
                <Button type="button" variant="ghost" size="sm" className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-0 h-full px-2 hover:bg-transparent`} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
              </div>
            </div>
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Label className="text-[11px]">{t("admin.settings.smtpSecure")}</Label>
              <Switch id="smtpSecure" checked={settings.smtpSecure} onCheckedChange={(checked) => updateSetting("smtpSecure", checked)} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
