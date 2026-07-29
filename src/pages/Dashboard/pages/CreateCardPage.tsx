import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

const defaultCards = [
  { id: 1, name: "نادي اللياقة النخبة", title: "تدرب وادخر", description: "استمتع بمرافقنا الفاخرة واحصل على مكافآت حصرية!", totalStages: 5 },];

export function CreateCardPage() {
  const { t, i18n } = useTranslation();
  const { isRTL } = useDirection();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const editId = new URLSearchParams(window.location.search).get("edit");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [rewardType, setRewardType] = useState("coupon");
  const [pointsRequired, setPointsRequired] = useState(4);

  const [rewardName, setRewardName] = useState("");

  useEffect(() => {
    if (editId) {
      const existing = JSON.parse(localStorage.getItem("dashboard_cards") || "[]");
      const found = existing.find((c: any) => c.id.toString() === editId || c.id === Number(editId))
        || defaultCards.find((c) => c.id.toString() === editId || c.id === Number(editId));
      if (found) {
        setName(found.name || "");
        setDescription(found.description || "");
        setPointsRequired(found.totalStages || 4);
        setRewardName(found.title || "");
      }
      return;
    }
    const stored = localStorage.getItem("selected_template");
    if (stored) {
      try {
        const tmpl = JSON.parse(stored);
        setName(tmpl.name || "");
        setDescription(tmpl.description || "");
        setPointsRequired(tmpl.totalStages || tmpl.stampsUntilReward || 4);
        setRewardName(tmpl.title || "");
      } catch {}
    }
  }, [editId]);

  const rewardTypes = [
    { value: "coupon", label: t("dashboardPages.cards.rewardTypeCoupon") },
    { value: "stamps", label: t("dashboardPages.cards.rewardTypeStamps") },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const existing = JSON.parse(localStorage.getItem("dashboard_cards") || "[]");
    const stored = localStorage.getItem("selected_template");
    let template: any = {};
    if (stored) {
      try { template = JSON.parse(stored); } catch {}
      localStorage.removeItem("selected_template");
    }

    if (editId) {
      const defaultCard = defaultCards.find((c) => c.id.toString() === editId || c.id === Number(editId));
      const idx = existing.findIndex((c: any) => c.id.toString() === editId || c.id === Number(editId));
      if (idx !== -1) {
        existing[idx] = {
          ...existing[idx],
          name: name || existing[idx].name,
          title: rewardName || existing[idx].title,
          description: description || existing[idx].description,
          totalStages: pointsRequired,
        };
      } else if (defaultCard) {
        existing.push({
          ...defaultCard,
          name: name || defaultCard.name,
          title: rewardName || defaultCard.title,
          description: description || defaultCard.description,
          totalStages: pointsRequired,
          cardId: `${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}`,
          issueDate: new Date().toISOString(),
          expiryDate: new Date(Date.now() + 365 * 86400000).toISOString(),
          bgColor: defaultCard.bgColor || "#7c88c4",
          bgOpacity: defaultCard.bgOpacity ?? 0.9,
          bgImage: defaultCard.bgImage || "",
          textColor: defaultCard.textColor || "#ffffff",
          status: "نشط",
          currentStage: 1,
        });
      }
      if (idx !== -1 || defaultCard) {
        localStorage.setItem("dashboard_cards", JSON.stringify(existing));
        navigate('/dashboard/cards');
        return;
      }
    }

    const newCard = {
      id: Date.now(),
      name: name || template.name || "بطاقة جديدة",
      title: rewardName || template.title || "",
      description: description || template.description || "",
      cardId: `${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}`,
      issueDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 365 * 86400000).toISOString(),
      bgColor: template.bgColor || "#7c88c4",
      bgOpacity: template.bgOpacity ?? 0.9,
      bgImage: template.bgImage || "",
      textColor: template.textColor || "#ffffff",
      status: "نشط",
      currentStage: 1,
      totalStages: pointsRequired,
    };
    existing.push(newCard);
    localStorage.setItem("dashboard_cards", JSON.stringify(existing));
    navigate('/dashboard/cards');
  };

  return (
    <div className="min-h-full bg-[#fafbff]">
      <div className="px-4 md:px-10 pt-10 pb-4 max-w-2xl mx-auto">
      <button onClick={() => navigate('/dashboard/cards')} className="flex items-center gap-1.5 text-[#5f6678] hover:text-[#111111] mb-2 transition-colors text-xs font-medium">
        {isRTL ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
        {t("common.back") || "رجوع"}
      </button>

      <h1 className="text-lg font-bold text-[#111111] mb-3">
        {editId ? (t("common.edit") || "تعديل") : (t("dashboardPages.cards.createProgram") || "إنشاء برنامج")}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-2.5">
        <div>
          <label className="block text-xs font-medium text-[#111111] mb-1">
            {t("dashboardPages.cards.name") || "الاسم"}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("dashboardPages.cards.namePlaceholder") || "مثل مقهى فيت"}
            className="w-full px-3 py-1.5 rounded-2xl border border-[#dde1ee] focus:border-[#7c88c4] focus:ring-2 focus:ring-[#7c88c4]/20 outline-none transition-all text-sm text-[#111111]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#111111] mb-1">
            {t("dashboardPages.cards.description") || "الوصف"}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("dashboardPages.cards.descriptionPlaceholder") || "مثل قهوة مجانية أو غسيل سيارة مجاني أو خصم 15% أو قسيمة بقيمة 10$"}
            rows={2}
            className="w-full px-3 py-1.5 rounded-2xl border border-[#dde1ee] focus:border-[#7c88c4] focus:ring-2 focus:ring-[#7c88c4]/20 outline-none transition-all text-sm resize-none text-[#111111]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#111111] mb-1">
            {t("dashboardPages.cards.rewardType") || "نوع المكافأة"}
          </label>
          <select
            value={rewardType}
            onChange={(e) => setRewardType(e.target.value)}
            className="w-full px-3 py-1.5 rounded-2xl border border-[#dde1ee] focus:border-[#7c88c4] focus:ring-2 focus:ring-[#7c88c4]/20 outline-none transition-all text-sm bg-white text-[#111111]"
          >
            {rewardTypes.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#111111] mb-1">
            {t("dashboardPages.cards.pointsRequired") || "النقاط التي يجب جمعها للحصول على المكافأة"}
          </label>
          <input
            type="number"
            value={pointsRequired}
            onChange={(e) => setPointsRequired(Number(e.target.value))}
            min={1}
            className="w-full px-3 py-1.5 rounded-2xl border border-[#dde1ee] focus:border-[#7c88c4] focus:ring-2 focus:ring-[#7c88c4]/20 outline-none transition-all text-sm text-[#111111]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#111111] mb-1">
            {t("dashboardPages.cards.rewardName") || "اسم المكافأة"}
          </label>
          <input
            type="text"
            value={rewardName}
            onChange={(e) => setRewardName(e.target.value)}
            placeholder={t("dashboardPages.cards.descriptionPlaceholder") || "مثل قهوة مجانية أو غسيل سيارة مجاني أو خصم 15% أو قسيمة بقيمة 10$"}
            className="w-full px-3 py-1.5 rounded-2xl border border-[#dde1ee] focus:border-[#7c88c4] focus:ring-2 focus:ring-[#7c88c4]/20 outline-none transition-all text-sm text-[#111111]"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 rounded-2xl bg-[#7c88c4] text-white font-semibold text-sm hover:bg-[#5a68b0] transition-colors"
        >
          {editId ? (t("common.save") || "حفظ") : (t("common.next") || "التالي")}
        </button>
      </form>
      </div>
    </div>
  );
}
