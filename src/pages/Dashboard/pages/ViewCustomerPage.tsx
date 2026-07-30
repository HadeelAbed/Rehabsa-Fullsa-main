import React, { useMemo, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronRight, ChevronLeft, Plus, Send, Gift, Smartphone, Trash2, Bell, Key } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CustomerRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  birthDate: string | null;
  lastVisitDate: string;
  registrationDate: string;
}

const fallbackCustomers: CustomerRecord[] = [
  { id: "1", fullName: "هديل", email: "hadeel@example.com", phone: "5059595050", birthDate: null, lastVisitDate: "10/22/2025 4:55:43 PM", registrationDate: "10/22/2025 4:55:43 PM" },
  { id: "2", fullName: "مداوي القحطاني", email: "medawi@example.com", phone: "580005528", birthDate: null, lastVisitDate: "10/22/2025 4:54:40 PM", registrationDate: "10/22/2025 4:53:52 PM" },
  { id: "3", fullName: "سعيد", email: "saeed@example.com", phone: "551047087", birthDate: null, lastVisitDate: "10/22/2025 2:23:08 PM", registrationDate: "10/22/2025 2:22:39 PM" },
  { id: "4", fullName: "ابو حاتم", email: "abohatim@example.com", phone: "569941511", birthDate: null, lastVisitDate: "10/22/2025 12:27:07 PM", registrationDate: "10/22/2025 12:25:06 PM" },
  { id: "5", fullName: "فهد", email: "fahad@example.com", phone: "566889900", birthDate: null, lastVisitDate: "10/21/2025", registrationDate: "10/20/2025" },
  { id: "6", fullName: "سارة", email: "sara@example.com", phone: "505050505", birthDate: "1995-03-15", lastVisitDate: "10/25/2025", registrationDate: "10/18/2025" },
  { id: "7", fullName: "نورة", email: "noura@example.com", phone: "544332211", birthDate: "2000-07-22", lastVisitDate: "10/26/2025", registrationDate: "10/15/2025" },
  { id: "8", fullName: "خالد", email: "khaled@example.com", phone: "577661122", birthDate: null, lastVisitDate: "10/19/2025", registrationDate: "10/10/2025" },
];

interface DashboardCard {
  id: number;
  name: string;
  title: string;
  description: string;
  cardId: string;
  bgColor: string;
  bgOpacity: number;
  bgImage: string;
  textColor: string;
  status: string;
  currentStage: number;
  totalStages: number;
  stampsPerGrant?: number;
}

const fallbackCard: DashboardCard = {
  id: 0, name: "بطاقة ولاء", title: "برنامج المكافآت", description: "اجمع النقاط واستبدلها",
  cardId: "000-000-000-000", bgColor: "#7c88c4", bgOpacity: 0.9, bgImage: "",
  textColor: "#ffffff", status: "نشط", currentStage: 1, totalStages: 8, stampsPerGrant: 1,
};

const hexToRgb = (hex: string) => {
  const clean = hex.replace("#", "");
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(clean);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : { r: 124, g: 136, b: 196 };
};

const GrantIcon = Gift;
const RedeemIcon = Gift;
const BellIcon = Bell;

const cardClass =
  "border border-[#e5e7eb] rounded-xl bg-white shadow-sm" +
  " transition-all duration-200 hover:shadow-md";

function readPointsMap(): Record<string, Record<string, number>> {
  try {
    const raw = localStorage.getItem("customer_points");
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed === "object" && !Array.isArray(parsed)) {
      const firstVal = Object.values(parsed)[0];
      if (typeof firstVal === "number") {
        const cardMap = JSON.parse(localStorage.getItem("customer_card") || "{}");
        const migrated: Record<string, Record<string, number>> = {};
        for (const [cid, pts] of Object.entries(parsed)) {
          const cardId = cardMap[cid] || "000-000-000-000";
          if (!migrated[cardId]) migrated[cardId] = {};
          migrated[cardId][cid] = pts as number;
        }
        localStorage.setItem("customer_points", JSON.stringify(migrated));
        return migrated;
      }
    }
    return parsed;
  } catch { return {}; }
}

export function ViewCustomerPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { isRTL } = useDirection();
  const allCards = useMemo(() => {
    try {
      const raw = localStorage.getItem("dashboard_cards");
      const saved: DashboardCard[] = raw ? JSON.parse(raw) : [];
      const defaultCards: DashboardCard[] = [
        { id: 1, name: "نادي اللياقة النخبة", title: "تدرب وادخر", description: "استمتع بمرافقنا الفاخرة واحصل على مكافآت حصرية!", cardId: "477-398-475-609", issueDate: new Date("2025-07-08").toISOString(), expiryDate: new Date("2027-08-30").toISOString(), bgColor: "#3498DB", bgOpacity: 0.87, bgImage: "", textColor: "#ffffff", status: "نشط", currentStage: 2, totalStages: 5 },

      ];
      const merged = [...defaultCards];
      for (const s of saved) {
        if (!merged.find(m => m.cardId === s.cardId)) {
          merged.push(s);
        }
      }
      return merged;
    } catch { return [fallbackCard]; }
  }, []);

  const initialIdx = useMemo(() => {
    const cardParam = searchParams.get("card");
    if (cardParam) {
      const found = allCards.findIndex(c => c.cardId === cardParam);
      if (found >= 0) return found;
    }
    const cardMap = JSON.parse(localStorage.getItem("customer_card") || "{}");
    const savedCard = cardMap[String(id)];
    if (savedCard) {
      const found = allCards.findIndex(c => c.cardId === savedCard);
      if (found >= 0) return found;
    }
    return 0;
  }, [searchParams, allCards, id]);

  const [selectedCardIdx, setSelectedCardIdx] = useState(initialIdx);
  const selectedCard = allCards[selectedCardIdx] || allCards[0];

  const selectedCardId = selectedCard.cardId;

  const defaultGrant = selectedCard.stampsPerGrant ?? 1;
  const [message, setMessage] = useState("");
  const [pointInput, setPointInput] = useState(defaultGrant);

  const getPoints = (cid: string | number, cid2?: string): number => {
    try {
      const map = readPointsMap();
      const cidKey = cid2 || selectedCardId;
      return (map[cidKey] && map[cidKey][String(cid)]) || 0;
    } catch { return 0; }
  };
  const [points, setPoints] = useState(() => getPoints(id!, selectedCard.cardId));

  const addPoints = (amount: number) => {
    try {
      const maxAllowed = totalPoints - currentPoints;
      if (amount > maxAllowed) {
        toast.error(isArabic ? `الحد الأقصى ${maxAllowed} نقطة` : `Max ${maxAllowed} points`);
        return;
      }
      const map = readPointsMap();
      if (!map[selectedCardId]) map[selectedCardId] = {};
      map[selectedCardId][String(customer.id)] = (map[selectedCardId][String(customer.id)] || 0) + amount;
      localStorage.setItem("customer_points", JSON.stringify(map));
      setPoints(map[selectedCardId][String(customer.id)]);

      let managerName = "—";
      try {
        const u = JSON.parse(localStorage.getItem("dashboard_user") || "{}");
        if (u.name) managerName = u.name;
      } catch { /* ignore */ }
      if (managerName === "—") {
        try {
          const mgrs = JSON.parse(localStorage.getItem("dashboard_managers") || "[]") as any[];
          if (mgrs.length > 0) {
            const first = mgrs[0];
            managerName = `${first.firstName || ""} ${first.lastName || ""}`.trim() || first.email || "—";
          }
        } catch { /* ignore */ }
      }

      const auditRaw = localStorage.getItem("audit_logs");
      const audit = auditRaw ? JSON.parse(auditRaw) : [];
      audit.unshift({
        id: Date.now(),
        managerName,
        createdAt: new Date().toLocaleString(isArabic ? "ar-SA" : "en-US", { hour12: true }),
        customerName: customer.fullName,
        event: isArabic ? `تم منح ${amount} ختم` : `Granted ${amount} stamp(s)`,
        cashbackStamps: amount,
      });
      localStorage.setItem("audit_logs", JSON.stringify(audit));

      toast.success(isArabic ? `تمت إضافة ${amount} نقطة` : `${amount} point(s) added`);
    } catch {
      toast.error(isArabic ? "فشلت الإضافة" : "Failed to add points");
    }
  };

  const deductPoints = (amount: number) => {
    try {
      if (currentPoints < amount) {
        toast.error(isArabic ? `الرصيد غير كافٍ (${currentPoints})` : `Insufficient balance (${currentPoints})`);
        return;
      }
      const map = readPointsMap();
      if (!map[selectedCardId]) map[selectedCardId] = {};
      map[selectedCardId][String(customer.id)] = Math.max(0, (map[selectedCardId][String(customer.id)] || 0) - amount);
      localStorage.setItem("customer_points", JSON.stringify(map));
      setPoints(map[selectedCardId][String(customer.id)]);

      let managerName = "—";
      try {
        const u = JSON.parse(localStorage.getItem("dashboard_user") || "{}");
        if (u.name) managerName = u.name;
      } catch { /* ignore */ }
      if (managerName === "—") {
        try {
          const mgrs = JSON.parse(localStorage.getItem("dashboard_managers") || "[]") as any[];
          if (mgrs.length > 0) {
            const first = mgrs[0];
            managerName = `${first.firstName || ""} ${first.lastName || ""}`.trim() || first.email || "—";
          }
        } catch { /* ignore */ }
      }

      const auditRaw = localStorage.getItem("audit_logs");
      const audit = auditRaw ? JSON.parse(auditRaw) : [];
      audit.unshift({
        id: Date.now(),
        managerName,
        createdAt: new Date().toLocaleString(isArabic ? "ar-SA" : "en-US", { hour12: true }),
        customerName: customer.fullName,
        event: isArabic ? `استبدل ${amount} ختم` : `Redeemed ${amount} stamp(s)`,
        cashbackStamps: amount,
      });
      localStorage.setItem("audit_logs", JSON.stringify(audit));

      toast.success(isArabic ? `تم استبدال ${amount} نقطة` : `${amount} point(s) redeemed`);
    } catch {
      toast.error(isArabic ? "فشل الاستبدال" : "Failed to redeem");
    }
  };

  const [customer, isFromStorage] = useMemo((): [CustomerRecord, boolean] => {
    try {
      const raw = localStorage.getItem("registered_customers");
      const list: CustomerRecord[] = raw ? JSON.parse(raw) : [];
      const found = list.find((c) => String(c.id) === String(id));
      if (found) return [found, true];
      const fb = fallbackCustomers.find((c) => String(c.id) === String(id));
      return [fb || fallbackCustomers[0], false];
    } catch {
      return [fallbackCustomers[0], false];
    }
  }, [id]);

  const rgb = useMemo(() => hexToRgb(selectedCard.bgColor), [selectedCard.bgColor]);
  const gradientStyle = useMemo(() =>
    selectedCard.bgImage?.trim()
      ? { backgroundImage: `linear-gradient(rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${selectedCard.bgOpacity}), rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${selectedCard.bgOpacity})), url("${selectedCard.bgImage}")` }
      : { backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${selectedCard.bgOpacity})` },
    [selectedCard.bgImage, selectedCard.bgOpacity, rgb]
  );

  const currentPoints = points;
  const totalPoints = selectedCard.totalStages;
  const memberId = `MEM-${String(customer.id).slice(0, 8).toUpperCase() || "00000000"}`;
  const qrValue = `${window.location.origin}/customer/register?card=${selectedCard.cardId}`;

  const isArabic = i18n.language === "ar";

  const transactions = useMemo(() => {
    try {
      const raw = localStorage.getItem("audit_logs");
      const logs: any[] = raw ? JSON.parse(raw) : [];
      return logs
        .filter((log: any) => log.customerName === customer.fullName)
        .slice(0, 10)
        .map((log: any) => ({
          date: log.createdAt,
          desc: log.event,
          type: log.cashbackStamps > 0 ? (isArabic ? "نقاط" : "Points") : (isArabic ? "إشعار" : "Notification"),
          points: log.cashbackStamps || 0,
          icon: log.cashbackStamps > 0 ? GrantIcon : BellIcon,
        }));
    } catch {
      return [];
    }
  }, [customer.fullName, isArabic]);

  return (
    <div className="px-3 md:px-6 py-3 bg-[#fafbff] min-h-screen" dir={isRTL ? "rtl" : "ltr"}>

      {/* ===== Card 1: Customer Profile Header ===== */}
      <Card className={`${cardClass} mb-3`}>
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate("/dashboard/customers")} className="text-[#5f6678] rounded-lg p-0 h-7 w-7">
              {isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
            <div className="flex flex-col items-center gap-1.5">
              <Avatar className="h-14 w-14 ring-2 ring-[#e5e7eb] ring-offset-1 ring-offset-[#fafbff]">
                <AvatarFallback className="bg-[#7c88c4] text-white font-bold text-sm">
                  {customer.fullName.split(" ").map(s => s[0]).join("").slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h1 className="text-base font-bold text-[#111111]">{customer.fullName}</h1>
                <p className="text-xs text-[#5f6678]" dir="ltr">{customer.phone}</p>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <div className="border border-[#7c88c4]/20 bg-[#f7f9ff] text-[#7c88c4] text-[9px] font-semibold rounded-full px-2 py-0.5 leading-tight whitespace-nowrap">
                  {selectedCard.name}
                </div>
                <div className="border border-[#7c88c4]/20 bg-[#f7f9ff] text-[#7c88c4] text-[9px] font-semibold rounded-full px-2 py-0.5 leading-tight whitespace-nowrap">
                  {currentPoints} {isArabic ? "نقاط" : "Points"}
                </div>
                <div className="border border-[#e5e7eb] bg-[#f7f9ff] text-[#5f6678] text-[9px] font-semibold rounded-full px-2 py-0.5 leading-tight whitespace-nowrap">
                  0 {isArabic ? "مكافآت" : "Rewards"}
                </div>
                <Badge variant="outline" className="border-red-200 text-red-500 bg-red-50 text-[9px] font-semibold rounded-full px-2 py-0.5 leading-tight whitespace-nowrap">
                  {isArabic ? "غير فعال" : "Inactive"}
                </Badge>
              </div>
            </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-lg text-[#5f6678] hover:text-red-500 hover:bg-red-50">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{isArabic ? "تأكيد الحذف" : "Confirm Delete"}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {isFromStorage
                        ? (isArabic ? "هل أنت متأكد من حذف هذا العميل؟ لا يمكن التراجع عن هذا الإجراء." : "Are you sure you want to delete this customer? This action cannot be undone.")
                        : (isArabic ? "هذا عميل تجريبي ولا يمكن حذفه من التخزين الفعلي." : "This is a sample customer and cannot be deleted from storage.")}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{isArabic ? "إلغاء" : "Cancel"}</AlertDialogCancel>
                    {isFromStorage && (
                      <AlertDialogAction
                        onClick={() => {
                          try {
                            const raw = localStorage.getItem("registered_customers");
                            const list = raw ? JSON.parse(raw) : [];
                            const updated = list.filter((c: CustomerRecord) => String(c.id) !== String(customer.id));
                            localStorage.setItem("registered_customers", JSON.stringify(updated));
                            const pMap = readPointsMap();
                            for (const cid of Object.keys(pMap)) {
                              delete pMap[cid][String(customer.id)];
                            }
                            localStorage.setItem("customer_points", JSON.stringify(pMap));
                            toast.success(isArabic ? "تم حذف العميل" : "Customer deleted");
                            navigate("/dashboard/customers");
                          } catch {
                            toast.error(isArabic ? "فشل الحذف" : "Delete failed");
                          }
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        {isArabic ? "حذف" : "Delete"}
                      </AlertDialogAction>
                    )}
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* ===== Card 2: Loyalty Pass Control Panel ===== */}
      <Card className={`${cardClass} mb-3`}>
        <CardContent className="p-3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">

            {/* ============ Left Column: Controls (RTL) ============ */}
            <div className="space-y-3 self-center" dir="rtl">
              {/* Progress & Metrics Bar */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#111111]">{currentPoints} / {totalPoints}</span>
                  <span className="text-[10px] text-[#5f6678]">{isArabic ? "النقاط" : "Points"}</span>
                </div>
                <div className="w-full h-1.5 bg-[#f7f9ff] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#7c88c4] rounded-full transition-all duration-300"
                    style={{ width: `${(currentPoints / Math.max(totalPoints, 1)) * 100}%` }}
                  />
                </div>
              </div>

              {/* Point Input & Add Action Row */}
              <div className="flex items-center gap-1.5">
                <Button
                  onClick={() => addPoints(pointInput)}
                  className="flex-1 bg-[#7c88c4] hover:bg-[#6a76b0] text-white rounded-lg h-9 text-xs font-bold flex items-center justify-center gap-1"
                >
                  <Plus className="h-4 w-4" /> {isArabic ? "إضافة نقطة" : "Add Point"}
                </Button>
                <input
                  type="number"
                  value={pointInput}
                  onChange={(e) => setPointInput(Math.max(1, Math.min(totalPoints, Number(e.target.value) || 1)))}
                  min={1}
                  max={totalPoints}
                  className="w-14 h-9 border border-[#e5e7eb] rounded-lg text-center text-xs font-bold text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#7c88c4]/30"
                />
                <Button
                  onClick={() => deductPoints(pointInput)}
                  className="flex-1 bg-rose-500 hover:bg-rose-600 text-white rounded-lg h-9 text-xs font-bold flex items-center justify-center gap-1"
                >
                  <Gift className="h-4 w-4" /> {isArabic ? "استبدال" : "Redeem"}
                </Button>
              </div>

              {/* Gift / Status Button */}
              <Button className="w-full bg-[#A0E7E5] hover:bg-[#92D2BF] text-gray-700 rounded-lg h-9 text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200">
                <Gift className="h-4 w-4" /> {isArabic ? "لا توجد هدايا" : "No Gifts"}
              </Button>

              {/* Digital Wallet Buttons */}
              <div className="space-y-2">
                <button className="w-full bg-black hover:bg-gray-900 text-white rounded-lg h-8 text-[10px] font-bold flex items-center justify-center gap-2 transition-all duration-200 shadow-sm">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                  <span className="tracking-tight">{isArabic ? "Apple Wallet" : "Add to Apple Wallet"}</span>
                </button>
                <button className="w-full bg-white border border-[#e5e7eb] text-[#111111] rounded-lg h-8 text-[10px] font-bold flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all duration-200">
                  <svg className="h-3.5 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <span>G Pay</span>
                  <span className="text-[#5f6678] mx-0.5">|</span>
                  <span>{isArabic ? "حفظ في الهاتف" : "Save to phone"}</span>
                </button>
              </div>
            </div>

            {/* ============ Right Column: Phone preview ============ */}
            <div className="flex justify-center items-center" dir="ltr">
              <div className="relative flex flex-col items-center w-full max-w-[150px]">
                <div className="flex items-center gap-1 mb-1 text-[9px] font-bold text-[#7c88c4] bg-[#f7f9ff] px-2 py-0.5 rounded-full">
                  <span className="w-1 h-1 rounded-full bg-emerald-500" />
                  {selectedCard.status}
                </div>
                <div className="overflow-hidden relative w-[130px] sm:w-[150px] my-1">
                  <img alt="Phone" src="/dashboard/ios.svg" className="w-full h-full object-contain" />
                  <div
                    className="w-[82%] h-[65%] absolute top-[18%] right-[50%] translate-x-[50%] rounded-lg shadow-[0px_2px_8px_rgba(0,0,0,0.15)] overflow-hidden bg-fixed bg-center bg-cover bg-no-repeat"
                    style={{ ...gradientStyle, color: selectedCard.textColor }}
                    dir="rtl"
                  >
                    <div className="h-full flex flex-col p-1">
                      <div className="flex flex-col items-center justify-center mb-0.5">
                        <div className="text-center mb-0.5">
                          <div className="text-[6px] font-medium leading-tight">
                            <span className="tracking-tight">{selectedCard.name}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-center">
                          <span className="text-[5px] font-semibold opacity-90">{isArabic ? "النقاط" : "Points"}: {currentPoints}/{totalPoints}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-0.5 mb-0.5 pb-0.5 border-b border-white/20">
                        {Array.from({ length: totalPoints }, (_, i) => {
                          const stageNumber = i + 1;
                          const isCompleted = stageNumber < currentPoints;
                          const isCurrent = stageNumber === currentPoints;
                          return (
                            <div key={i} className="relative flex items-center justify-center">
                              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                                className={`transition-all duration-300 ${
                                  isCompleted
                                    ? "text-yellow-500"
                                    : isCurrent
                                    ? "text-yellow-500 scale-125 animate-pulse"
                                    : "text-yellow-500/30"
                                }`}
                              >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor" />
                              </svg>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex-grow min-w-0 overflow-hidden text-center mb-0.5">
                        <h3 className="text-[6px] font-extralight line-clamp-1 leading-tight">{selectedCard.title}</h3>
                        <div className="line-clamp-2 font-light text-[5px] leading-tight">{selectedCard.description}</div>
                      </div>
                      <div className="flex items-center justify-center mb-0.5">
                        <div className="rounded w-[50px] h-[50px] flex place-content-center items-center shadow-sm bg-white">
                          <QRCodeCanvas value={qrValue} size={36} bgColor="#ffffff" fgColor="#000000" level="M" />
                        </div>
                      </div>
                      <div className="flex self-end mt-auto pt-0.5 border-t border-white/20">
                        <div className="flex-grow text-right">
                          <div className="text-[3px] font-extralight opacity-80">{isArabic ? "رقم العضوية" : "Card ID"}</div>
                          <div className="text-[5px] font-light truncate">{selectedCard.cardId || memberId}</div>
                        </div>
                        <div className="flex-none text-left">
                          <div className="text-[3px] font-extralight opacity-80">{isArabic ? "العميل" : "Member"}</div>
                          <div className="text-[5px] font-light truncate">{memberId.slice(0, 10)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* ===== Card 3: Send Notification ===== */}
      <Card className={`${cardClass} mb-3`}>
        <CardContent className="p-3">
          <h2 className="text-sm font-bold text-[#111111] mb-3 flex items-center gap-1.5">
            <Smartphone className="h-4 w-4 text-[#7c88c4]" />
            {isArabic ? "إرسال إشعار" : "Send Notification"}
          </h2>
          <div className="space-y-2.5">
            <Textarea
              placeholder={isArabic ? "رسالتك..." : "Your message..."}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="border-[#e5e7eb] rounded-lg bg-white text-xs text-[#111111] min-h-[80px] resize-none"
            />
            <Button
              onClick={() => {
                if (!message.trim()) {
                  toast.error(isArabic ? "يرجى كتابة رسالة" : "Please write a message");
                  return;
                }
                toast.success(isArabic ? "تم إرسال الإشعار" : "Notification sent");
                setMessage("");
              }}
              className="w-full bg-[#b0b8da] hover:bg-[#7c88c4] text-white rounded-lg h-9 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Send className="h-4 w-4" /> {isArabic ? "إرسال الرسالة" : "Send Message"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ===== Card 4: Last Transactions ===== */}
      <Card className={`${cardClass}`}>
        <CardContent className="p-3">
          <h2 className="text-sm font-bold text-[#111111] mb-2 flex items-center gap-1.5">
            {isArabic ? "آخر المعاملات" : "Last Transactions"}
          </h2>
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#e5e7eb]">
                <TableHead className="text-[10px] text-[#5f6678] font-semibold py-2 px-2">{isArabic ? "التاريخ" : "Date"}</TableHead>
                <TableHead className="text-[10px] text-[#5f6678] font-semibold py-2 px-2">{isArabic ? "العميل" : "Customer"}</TableHead>
                <TableHead className="text-[10px] text-[#5f6678] font-semibold py-2 px-2">{isArabic ? "الوصف" : "Description"}</TableHead>
                <TableHead className="text-[10px] text-[#5f6678] font-semibold py-2 px-2">{isArabic ? "النوع" : "Type"}</TableHead>
                <TableHead className="text-[10px] text-[#5f6678] font-semibold py-2 px-2 text-center">{isArabic ? "النقاط" : "Points"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-[#5f6678] text-xs py-5">{isArabic ? "لا توجد معاملات" : "No transactions"}</TableCell>
                </TableRow>
              ) : transactions.map((tx, i) => {
                const Icon = tx.icon;
                return (
                  <TableRow key={i} className="border-b border-[#e5e7eb] last:border-0">
                    <TableCell className="text-xs py-2.5 px-2 text-[#5f6678] whitespace-nowrap">{tx.date}</TableCell>
                    <TableCell className="text-xs py-2.5 px-2">
                      <button className="text-[#7c88c4] hover:underline font-semibold">{isArabic ? "تفاصيل العميل" : "Details"}</button>
                    </TableCell>
                    <TableCell className="text-xs py-2.5 px-2 text-[#5f6678]">{tx.desc}</TableCell>
                    <TableCell className="text-xs py-2.5 px-2">
                      <div className="flex items-center gap-1.5">
                        <Icon className="h-3.5 w-3.5 text-[#5f6678]" />
                        <span className="text-[#111111] text-xs">{tx.type}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs py-2.5 px-2 text-center">
                      <span className={`font-bold ${tx.points > 0 ? "text-green-500" : "text-[#111111]"}`}>
                        {tx.points > 0 ? `+${tx.points}` : tx.points}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
}
