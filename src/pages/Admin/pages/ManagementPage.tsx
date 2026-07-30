import React from "react";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { Store, Users, CreditCard } from "lucide-react";
import { StoresPage } from "./StoresPage";
import { UsersPage } from "./UsersPage";
import { SubscriptionsPage } from "./SubscriptionsPage";

const tabs = [
  { key: "stores", icon: Store },
  { key: "users", icon: Users },
  { key: "subscriptions", icon: CreditCard },
];

export function ManagementPage() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const [activeTab, setActiveTab] = React.useState("stores");

  return (
    <div className="flex flex-col h-full bg-[#fafbff]" dir={isRTL ? "rtl" : "ltr"}>
      {/* Tabs */}
      <div className={`sticky top-0 z-10 bg-white border-b border-[#e5e7eb] px-4 flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? "border-[#7c88c4] text-[#7c88c4]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {t(`admin.sidebar.${tab.key}`)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "stores" && <StoresPage />}
        {activeTab === "users" && <UsersPage />}
        {activeTab === "subscriptions" && <SubscriptionsPage />}
      </div>
    </div>
  );
}
