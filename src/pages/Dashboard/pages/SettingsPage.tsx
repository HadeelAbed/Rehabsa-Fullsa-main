import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { toast } from "sonner";
import { FileText, Mail, Phone, CheckCircle, MailOpen, Lock, Settings as SettingsIcon, ChevronDown, Medal, Building2, Crown, Check, Star, Clock, Gem } from "lucide-react";

const plans = [
  {
    id: "silver",
    nameAr: "الباقة الفضية 🥈",
    nameEn: "Silver Plan 🥈",
    icon: Medal,
    price: "829",
    subPrice: "(~69 ر.س / شهر)",
    descAr: "مناسبة للمشاريع الصغيرة وبدء التشغيل",
    descEn: "Suitable for small projects and startups",
    active: true,
    popular: true,
    features: [
      "عدد المواقع في الخريطة: ١",
      "عدد التصاميم للبطاقة: ١",
      "إشعارات مجانية ولا محدودة",
      "مستخدمون فرعيون",
      "تعديل تصميم البطاقة",
    ],
  },
  {
    id: "gold",
    nameAr: "الباقة الذهبية 🥇",
    nameEn: "Gold Plan 🥇",
    icon: Building2,
    price: "2,249",
    subPrice: "",
    descAr: "ميزات متقدمة لنمو نشاطك",
    descEn: "Advanced features for business growth",
    active: false,
    popular: false,
    features: [
      "عدد المواقع في الخريطة: ٣",
      "عدد التصاميم للبطاقة: ٣",
      "إشعارات مجانية ولا محدودة",
      "مستخدمون فرعيون: ١٠",
      "تعديل تصميم البطاقة",
    ],
  },
  {
    id: "platinum",
    nameAr: "الباقة البلاتينية 💎",
    nameEn: "Platinum Plan 💎",
    icon: Gem,
    price: "3,149",
    subPrice: "",
    descAr: "أقصى طاقة ومرونة للفروع المتعددة",
    descEn: "Maximum power and flexibility for multiple branches",
    active: false,
    popular: false,
    features: [
      "عدد المواقع في الخريطة: ١٠",
      "عدد التصاميم للبطاقة: ١٠",
      "إشعارات مجانية ولا محدودة",
      "مستخدمون فرعيون: ٥٠",
      "تعديل تصميم البطاقة",
      "تسجيل عملاء بدون تكرار",
      "تحميل/تصدير بيانات العملاء",
    ],
  },
];

export function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { isRTL } = useDirection();
  const [activeTab, setActiveTab] = useState<"account" | "subscription">("account");
  const isAr = i18n.language === "ar";
  const storeName = (() => {
    try { return JSON.parse(localStorage.getItem("dashboard_user") || "{}").name || "متجري"; } catch { return "متجري"; }
  })();

  const [newEmail, setNewEmail] = useState("example@domain.com");
  const [emailPassword, setEmailPassword] = useState("");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [rewardType, setRewardType] = useState("coupon");
  const [couponValue, setCouponValue] = useState("25");
  const [currency, setCurrency] = useState("SAR");
  const [rewardsPassword, setRewardsPassword] = useState("");

  const handleSaveEmail = () => {
    if (!emailPassword) { toast.error(t("dashboardPages.settings.fillPassword")); return; }
    toast.success(t("dashboardPages.settings.emailSaved"));
    setEmailPassword("");
  };

  const handleSavePassword = () => {
    if (!currentPw) { toast.error(t("dashboardPages.settings.fillCurrentPassword")); return; }
    if (!newPw) { toast.error(t("dashboardPages.settings.fillNewPassword")); return; }
    if (newPw !== confirmPw) { toast.error(t("dashboardPages.settings.passwordMismatch")); return; }
    toast.success(t("dashboardPages.settings.passwordSaved"));
    setCurrentPw(""); setNewPw(""); setConfirmPw("");
  };

  const handleSaveRewards = () => {
    if (!rewardsPassword) { toast.error(t("dashboardPages.settings.fillPassword")); return; }
    toast.success(t("dashboardPages.settings.rewardsSaved"));
    setRewardsPassword("");
  };

  return (
    <div className="min-h-screen bg-[#f2f3f8] p-3 md:p-4" dir={isRTL ? "rtl" : "ltr"}>
      {/* Tabs - width matches active content */}
      {activeTab === "account" ? (
        <div className="max-w-3xl mx-auto mb-4">
          <div className="grid grid-cols-2 gap-0 border border-[#d4d9ef] rounded-xl overflow-hidden bg-white shadow-[0_4px_24px_rgba(124,136,196,.08)]">
            <button onClick={() => setActiveTab("account")} className={`flex items-center justify-center gap-2 py-2.5 text-xs font-medium transition-all ${activeTab === "account" ? "bg-[#7c88c4] text-white shadow-sm" : "bg-white text-gray-600 hover:bg-gray-50"}`}>
              <SettingsIcon className="w-3.5 h-3.5" />
              {t("dashboardPages.settings.account")}
            </button>
            <button onClick={() => setActiveTab("subscription")} className={`flex items-center justify-center gap-2 py-2.5 text-xs font-medium transition-all ${activeTab === "subscription" ? "bg-[#7c88c4] text-white shadow-sm" : "bg-white text-gray-600 hover:bg-gray-50"} ${isRTL ? "border-r border-[#d4d9ef]" : "border-l border-[#d4d9ef]"}`}>
              <Star className="w-3.5 h-3.5" />
              {t("dashboardPages.settings.subscription")}
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto mb-4">
          <div className="grid grid-cols-2 gap-0 border border-[#d4d9ef] rounded-xl overflow-hidden bg-white shadow-[0_4px_24px_rgba(124,136,196,.08)]">
            <button onClick={() => setActiveTab("account")} className={`flex items-center justify-center gap-2 py-2.5 text-xs font-medium transition-all ${activeTab === "account" ? "bg-[#7c88c4] text-white shadow-sm" : "bg-white text-gray-600 hover:bg-gray-50"}`}>
              <SettingsIcon className="w-3.5 h-3.5" />
              {t("dashboardPages.settings.account")}
            </button>
            <button onClick={() => setActiveTab("subscription")} className={`flex items-center justify-center gap-2 py-2.5 text-xs font-medium transition-all ${activeTab === "subscription" ? "bg-[#7c88c4] text-white shadow-sm" : "bg-white text-gray-600 hover:bg-gray-50"} ${isRTL ? "border-r border-[#d4d9ef]" : "border-l border-[#d4d9ef]"}`}>
              <Star className="w-3.5 h-3.5" />
              {t("dashboardPages.settings.subscription")}
            </button>
          </div>
        </div>
      )}

      {activeTab === "account" && (
        <div className="max-w-3xl mx-auto space-y-3">
          <Card className="border border-[#d4d9ef] rounded-xl bg-white shadow-[0_4px_24px_rgba(124,136,196,.12)]">
            <div className="px-3 py-2 border-b border-[#d4d9ef]/60 flex items-center justify-between">
              <h2 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <FileText className="w-3 h-3 text-[#7c88c4]" />
                {t("dashboardPages.settings.facilityInfo")}
              </h2>
            </div>
            <CardContent className="p-2.5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
                <div className="bg-[#f2f3f8] rounded-xl p-2 space-y-1">
                  <FileText className="w-3 h-3 text-gray-400" />
                  <p className="text-[10px] text-gray-400">—</p>
                </div>
                <div className="bg-[#f2f3f8] rounded-xl p-2 space-y-1">
                  <Mail className="w-3 h-3 text-gray-400" />
                  <p className="text-[10px] text-gray-600 truncate">...deelug@gmail.com</p>
                </div>
                <div className="bg-[#f2f3f8] rounded-xl p-2 space-y-1">
                  <Phone className="w-3 h-3 text-gray-400" />
                  <p className="text-[10px] text-gray-600">0573191919</p>
                </div>
                <div className="bg-[#f2f3f8] rounded-xl p-2 space-y-1">
                  <CheckCircle className="w-3 h-3 text-gray-400" />
                  <p className="text-[10px] text-gray-600">{t("dashboardPages.settings.notActive")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-[#d4d9ef] rounded-xl bg-white shadow-[0_4px_24px_rgba(124,136,196,.12)]">
            <div className="px-3 py-2 border-b border-[#d4d9ef]/60 flex items-center justify-between">
              <h2 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <MailOpen className="w-3 h-3 text-[#7c88c4]" />
                {t("dashboardPages.settings.changeEmail")}
              </h2>
            </div>
            <CardContent className="p-2.5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 mb-2">
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium text-gray-700">{t("dashboardPages.settings.newEmail")}</Label>
                  <Input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="border-[#d4d9ef] rounded-lg text-xs h-7" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium text-gray-700">{t("dashboardPages.settings.confirmPasswordLabel")}</Label>
                  <Input type="password" value={emailPassword} onChange={(e) => setEmailPassword(e.target.value)} className="border-[#d4d9ef] rounded-lg text-xs h-7" />
                </div>
              </div>
              <div className="flex justify-start">
                <Button onClick={handleSaveEmail} className="bg-[#7c88c4] hover:bg-[#6a76b0] text-white rounded-lg px-3 text-[10px] font-medium h-7">
                  {t("dashboardPages.settings.saveEmail")}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-[#d4d9ef] rounded-xl bg-white shadow-[0_4px_24px_rgba(124,136,196,.12)]">
            <div className="px-3 py-2 border-b border-[#d4d9ef]/60 flex items-center justify-between">
              <h2 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-[#7c88c4]" />
                {t("dashboardPages.settings.changePassword")}
              </h2>
            </div>
            <CardContent className="p-2.5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5 mb-2">
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium text-gray-700">{t("dashboardPages.settings.currentPassword")}</Label>
                  <Input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} className="border-[#d4d9ef] rounded-lg text-xs h-7" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium text-gray-700">{t("dashboardPages.settings.newPassword")}</Label>
                  <Input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} className="border-[#d4d9ef] rounded-lg text-xs h-7" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium text-gray-700">{t("dashboardPages.settings.confirmPassword")}</Label>
                  <Input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} className="border-[#d4d9ef] rounded-lg text-xs h-7" />
                </div>
              </div>
              <div className="flex justify-start">
                <Button onClick={handleSavePassword} className="bg-[#7c88c4] hover:bg-[#6a76b0] text-white rounded-lg px-3 text-[10px] font-medium h-7">
                  {t("dashboardPages.settings.savePassword")}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-[#d4d9ef] rounded-xl bg-white shadow-[0_4px_24px_rgba(124,136,196,.12)]">
            <div className="px-3 py-2 border-b border-[#d4d9ef]/60 flex items-center justify-between">
              <h2 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <SettingsIcon className="w-3 h-3 text-[#7c88c4]" />
                {t("dashboardPages.settings.rewardsSettings")}
              </h2>
            </div>
            <CardContent className="p-2.5">
              <div className="space-y-1.5 mb-2">
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium text-gray-700">{t("dashboardPages.settings.rewardType")}</Label>
                  <div className="relative">
                    <select
                      value={rewardType}
                      onChange={(e) => setRewardType(e.target.value)}
                      className="w-full px-2.5 py-1 rounded-lg border border-[#d4d9ef] bg-white text-xs text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#7c88c4]/30"
                    >
                      <option value="coupon">{t("dashboardPages.settings.couponExample")}</option>
                      <option value="stamp">{t("dashboardPages.settings.stampCardExample")}</option>
                    </select>
                    <ChevronDown className={`absolute ${isRTL ? 'left-2.5' : 'right-2.5'} top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none`} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-medium text-gray-700">{t("dashboardPages.settings.couponValue")}</Label>
                    <Input type="number" value={couponValue} onChange={(e) => setCouponValue(e.target.value)} className="border-[#d4d9ef] rounded-lg text-xs h-7" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-medium text-gray-700">{t("dashboardPages.settings.currency")}</Label>
                    <div className="relative">
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full px-2.5 py-1 rounded-lg border border-[#d4d9ef] bg-white text-xs text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#7c88c4]/30"
                      >
                        <option value="SAR">SAR</option>
                        <option value="USD">USD</option>
                        <option value="AED">AED</option>
                      </select>
                      <ChevronDown className={`absolute ${isRTL ? 'left-2.5' : 'right-2.5'} top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none`} />
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium text-gray-700">{t("dashboardPages.settings.confirmPasswordLabel")}</Label>
                  <Input type="password" value={rewardsPassword} onChange={(e) => setRewardsPassword(e.target.value)} className="border-[#d4d9ef] rounded-lg text-xs h-7" />
                </div>
              </div>
              <div className="flex justify-start">
                <Button onClick={handleSaveRewards} className="bg-[#7c88c4] hover:bg-[#6a76b0] text-white rounded-lg px-3 text-[10px] font-medium h-7">
                  {t("dashboardPages.settings.saveRewards")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "subscription" && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Crown className="w-4 h-4 text-green-600" />
              <div className="flex items-center gap-2">
                <span className="text-green-800 font-medium text-xs">{t("dashboardPages.settings.currentPlan")} Free Trial</span>
                <span className="text-green-600 text-[10px]">{t("dashboardPages.settings.expiresOn")} 2026/8/12</span>
              </div>
            </div>
            <Clock className="w-3.5 h-3.5 text-green-500" />
          </div>

          <div className="text-center">
            <h1 className="text-lg font-bold text-gray-900">{t("dashboardPages.settings.ourPlans")}</h1>
            <p className="text-gray-500 mt-1 text-xs">{t("dashboardPages.settings.planDescription")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {plans.map((plan) => {
              const Icon = plan.icon;
              return (
                <Card key={plan.id} className={`relative border rounded-xl bg-white shadow-[0_4px_24px_rgba(124,136,196,.12)] transition-all duration-300 flex flex-col cursor-pointer group max-w-sm mx-auto w-full ${
                  plan.active
                    ? "border-[#7c88c4] ring-2 ring-[#7c88c4]/20 scale-[1.02] hover:ring-[#7c88c4]/30 hover:shadow-xl hover:-translate-y-0.5"
                    : "border-[#d4d9ef] hover:border-[#7c88c4] hover:shadow-xl hover:-translate-y-0.5"
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-2.5 right-4 bg-gradient-to-l from-yellow-500 to-amber-500 text-white text-[10px] font-bold px-3 py-0.5 rounded-full shadow-md z-10 flex items-center gap-1">
                      <Crown className="w-2.5 h-2.5" />
                      {t("dashboardPages.settings.mostChosen")}
                    </div>
                  )}
                  <CardContent className="p-3.5 flex flex-col flex-1">
                    <div className="rounded-lg -mt-0.5 -mx-0.5 p-2.5 mb-2.5 bg-white text-gray-800 group-hover:bg-[#f8f9ff] transition-colors duration-300">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#f2f3f8] group-hover:bg-[#7c88c4]/10 transition-colors duration-300">
                          <Icon className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#7c88c4] transition-colors duration-300" />
                        </div>
                        <h3 className="text-xs font-bold text-gray-800">{isAr ? plan.nameAr : plan.nameEn}</h3>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-base font-extrabold text-gray-900">{plan.price}</span>
                        <span className="text-gray-500 text-[10px]">{t("dashboardPages.settings.sarYearly")}</span>
                      </div>
                      {plan.subPrice && <span className="text-[10px] text-gray-400">{plan.subPrice}</span>}
                      <p className="text-xs mt-1 text-gray-400">{isAr ? plan.descAr : plan.descEn}</p>
                    </div>

                    <ul className="space-y-1.5 mb-3 flex-1 pt-0.5">
                      {plan.features.map((feat, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-xs text-gray-700">
                          <span className="flex-shrink-0 w-3.5 h-3.5 rounded-full flex items-center justify-center bg-green-100">
                            <Check className="w-2 h-2 text-green-500" />
                          </span>
                          {feat}
                        </li>
                      ))}
                    </ul>

                    <div className="flex justify-center">
                      <Button
                        onClick={() => {
                          const planName = isAr ? plan.nameAr : plan.nameEn;
                          const text = `${storeName}\n• ${planName}`;
                          window.open(`https://api.whatsapp.com/send/?phone=966500000000&text=${encodeURIComponent(text)}&type=phone_number&app_absent=0`, "_blank");
                        }}
                        className={`rounded-lg py-2.5 px-4 text-xs font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                          plan.active
                            ? "bg-gradient-to-l from-[#7c88c4] to-blue-600 hover:from-[#6a76b0] hover:to-blue-700 text-white shadow-md hover:shadow-lg"
                            : "bg-white text-[#7c88c4] border-2 border-[#7c88c4] hover:bg-[#7c88c4] hover:text-white hover:shadow-md"
                        }`}
                      >
                        {t("dashboardPages.settings.subscribeNow")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
