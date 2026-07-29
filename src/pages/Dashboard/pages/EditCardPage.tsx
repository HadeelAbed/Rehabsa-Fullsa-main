import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import {
  Upload, X, Edit3, Palette, Link2, MapPin, CheckCircle, User, Gift, QrCode,
} from "lucide-react";

const tabs = [
  { key: "details", label: "التفاصيل", icon: Edit3 },
  { key: "design", label: "تصميم", icon: Palette },
  { key: "links", label: "الروابط", icon: Link2 },
  { key: "locations", label: "المواقع", icon: MapPin },
];

export function EditCardPage() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const [activeTab, setActiveTab] = useState("details");
  const [showActionBar, setShowActionBar] = useState(true);

  return (
    <div className="px-4 md:px-8 pt-4 pb-2 bg-[#fafbff] min-h-screen">
      {/* 2. Action Bar */}
      {showActionBar && (
        <div className="flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded-2xl px-5 py-3 mb-4">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-bold text-xs transition-colors">
              <Upload className="w-3.5 h-3.5" />
              رفع التحديثات
            </button>
            <div>
              <p className="text-xs font-bold text-gray-800">رفع التحديثات</p>
              <p className="text-[10px] text-gray-500">اضغط على هذا الزر لنشر التغييرات على جميع البطاقات</p>
            </div>
          </div>
          <button onClick={() => setShowActionBar(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 3. Main Content */}
      <div className="flex gap-0 justify-center">

        {/* Left: Preview */}
        <div className="border border-[#e5e7eb] rounded-2xl bg-white shadow-sm p-2 flex flex-col items-center justify-center w-fit self-start">
          <div className="relative flex flex-col items-center" dir="ltr">
            <div className="overflow-hidden relative w-[180px]">
              <img alt="" src="/dashboard/ios.svg" className="w-full h-full object-contain" />
              <div className="w-[85%] h-[61%] absolute top-0 translate-y-[105%] right-[50%] translate-x-[50%] rounded-[5px] overflow-hidden bg-white">
                <div className="h-full flex flex-col">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-2 text-white">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center">
                        <User className="w-3 h-3" />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold">هديل</p>
                        <p className="text-[7px] opacity-80">عميل مميز</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 p-2 flex flex-col items-center justify-center bg-gray-50">
                    <Gift className="w-4 h-4 text-purple-600 mb-0.5" />
                    <p className="text-[8px] font-bold text-gray-800">منتج مجاني</p>
                    <div className="mt-1 bg-white p-1 rounded">
                      <QrCode className="w-7 h-7 text-gray-700" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[9px] text-gray-400 mt-1.5">preview</p>
          </div>
        </div>

        {/* Right: Form */}
        <div className="border border-[#e5e7eb] rounded-2xl bg-white shadow-sm self-stretch w-[340px]">
          {/* Tabs */}
          <div className="flex border-b border-[#e5e7eb] px-3 gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-[10px] font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? "border-[#7c88c4] text-[#7c88c4]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form Fields */}
          <div className="p-4 space-y-2.5">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">الاسم</label>
              <input
                type="text"
                defaultValue="هديل"
                className="w-full px-3 py-2 rounded-2xl border border-[#dde1ee] focus:border-[#7c88c4] focus:ring-2 focus:ring-[#7c88c4]/20 outline-none transition-all text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">الوصف</label>
              <textarea
                rows={1}
                defaultValue="هديل"
                className="w-full px-3 py-2 rounded-2xl border border-[#dde1ee] focus:border-[#7c88c4] focus:ring-2 focus:ring-[#7c88c4]/20 outline-none transition-all text-xs resize-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">اسم المكافأة</label>
              <input
                type="text"
                defaultValue="منتج مجاني"
                className="w-full px-3 py-2 rounded-2xl border border-[#dde1ee] focus:border-[#7c88c4] focus:ring-2 focus:ring-[#7c88c4]/20 outline-none transition-all text-xs"
              />
            </div>
            <button className="w-full py-2.5 rounded-2xl bg-[#7c88c4] text-white font-extrabold text-xs hover:bg-[#5a68b0] transition-colors flex items-center justify-center gap-1.5">
              التالي
              {isRTL ? <></> : <CheckCircle className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}