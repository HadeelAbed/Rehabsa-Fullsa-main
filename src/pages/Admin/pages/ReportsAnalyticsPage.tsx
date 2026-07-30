import React from "react";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { Receipt, BarChart3 } from "lucide-react";
import { ReportsPage } from "./ReportsPage";
import { AnalyticsPage } from "./AnalyticsPage";

const tabs = [
  { key: "reports", icon: Receipt },
  { key: "analytics", icon: BarChart3 },
];

export function ReportsAnalyticsPage() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const [activeTab, setActiveTab] = React.useState("reports");

  return (
    <div className="flex flex-col h-full bg-[#fafbff]" dir={isRTL ? "rtl" : "ltr"}>
      <div className={`sticky top-0 z-10 bg-white border-b border-[#e5e7eb] px-3 flex items-center gap-0.5 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? "border-[#7c88c4] text-[#7c88c4]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {t(`admin.sidebar.${tab.key}`)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "reports" && <ReportsPage />}
        {activeTab === "analytics" && <AnalyticsPage />}
      </div>
    </div>
  );
}
