import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Users, BellRing, Send, Clock, CalendarDays, UserCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { toast } from "sonner";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface Location {
  id: number;
  name: string;
  description: string;
  date: string;
  coordinates: string;
  address?: string;
}

const getLocationsFromStorage = (): Location[] => {
  try {
    const saved = localStorage.getItem("dashboard_locations");
    if (saved) return JSON.parse(saved);
  } catch {}
  return [
    { id: 1, name: "مغسلة وتلميع تذكار", description: "مغسلة تذكار تكفيك المشوار", date: "Fri Oct 10 2025", coordinates: "18.23325445786974 - 42.7489816467735" },
  ];
};

interface Notification {
  id: number;
  date: string;
  message: string;
  recipients: number;
  target?: string;
}

const defaultHistory: Notification[] = [
  { id: 1, date: "2025-11-03 06:48:08 PM", message: "لا يفوتك العرض\n\nتلميع داخلي وخارجي بـ 299 ريال فقط", recipients: 154 },
  { id: 2, date: "2025-10-23 12:52:57 PM", message: "لا تفوت عرض الخميس غسيل سيارتك بـ ١٩ ريال", recipients: 110 },
  { id: 3, date: "2025-10-22 11:10:56 AM", message: "لا تفوت العرض غسيل سيارتك بـ ١٩ ريال فقط اليوم وغدا الخميس .", recipients: 101 },
  { id: 4, date: "2025-10-21 08:05:42 PM", message: "لا تفوت العرض غسيلك بـ ١٩ ريال فقط غدا الاربعاء والخميس .", recipients: 99 },
  { id: 5, date: "2025-10-21 05:22:15 PM", message: "احصل على غسيل داخلي وخارجي فقط بـ 19 ريال غدا الاربعاء والخميس", recipients: 95 },
  { id: 6, date: "2025-10-12 05:23:13 PM", message: "ارحب يبو حسييين", recipients: 3 },
  { id: 7, date: "2025-10-11 12:01:02 AM", message: "لا تفوت العرض غسل سيارتك ب ١٩ ريال فقط\n\nمن الساعه ٩ صباحا إلى الساعه ٣", recipients: 2 },
  { id: 8, date: "2025-10-10 11:59:12 PM", message: "صباح الخير عميلنا\n\nلا تفوتك عروض التلميع\n\nخصم ٥٠٪؜ لمدة اسبوع", recipients: 2 },
  { id: 9, date: "2025-10-10 08:40:18 PM", message: "اهلا عبدالله ناصر تشرفنا في اي وقت", recipients: 2 },
  { id: 10, date: "2025-10-10 05:17:51 PM", message: "Hi", recipients: 1 },
];

const cardClass = "border border-[#e5e7eb] rounded-2xl bg-white shadow-sm";

export function NotificationsPage() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const [locations, setLocations] = useState<Location[]>(getLocationsFromStorage());
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");
  const [targetType, setTargetType] = useState<"all" | "selected">("all");
  const [message, setMessage] = useState("");
  const [birthdayTomorrow, setBirthdayTomorrow] = useState(false);
  const [yesterdayVisitors, setYesterdayVisitors] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [historyList, setHistoryList] = useState<Notification[]>(defaultHistory);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("registered_customers") || "[]");
      setCustomers(saved);
    } catch {}
    try {
      const saved = JSON.parse(localStorage.getItem("notification_history") || "[]");
      if (saved.length) setHistoryList(saved);
    } catch {}
  }, []);

  const recipientCount = useMemo(() => targetType === "all" ? customers.length : (() => {
    const now = new Date();
    const tomorrow = new Date(now); tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = `${tomorrow.getMonth() + 1}-${tomorrow.getDate()}`;
    const yesterday = new Date(now); yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDateStr = yesterday.toISOString().slice(0, 10);

    return customers.filter((c: any) => {
      let match = false;
      if (birthdayTomorrow && c.birthDate) {
        const bd = new Date(c.birthDate);
        if (`${bd.getMonth() + 1}-${bd.getDate()}` === tomorrowStr) match = true;
      }
      if (yesterdayVisitors && c.lastVisitDate) {
        if (c.lastVisitDate.slice(0, 10) === yesterdayDateStr) match = true;
      }
      return match;
    }).length;
  })(), [targetType, birthdayTomorrow, yesterdayVisitors, customers]);

  useEffect(() => {
    const loadLocations = () => {
      const loaded = getLocationsFromStorage();
      setLocations(loaded);
      setSelectedLocationId((prev) => !prev && loaded.length > 0 ? loaded[0].id.toString() : prev);
    };
    loadLocations();
    const h = () => loadLocations();
    window.addEventListener("storage", h);
    window.addEventListener("focus", h);
    return () => { window.removeEventListener("storage", h); window.removeEventListener("focus", h); };
  }, []);

  const selectedLocation = locations.find((loc) => loc.id.toString() === selectedLocationId);

  return (
    <div className="px-4 md:px-10 py-6 bg-[#fafbff] min-h-screen">
      <div className="mb-5">
        <h1 className="text-lg font-bold text-[#7c88c4]">{t("dashboardPages.notifications.title")}</h1>
        <p className="text-[#5f6678] text-xs mt-1">{t("dashboard.notifications.description")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 space-y-4">
          <Card className={cardClass}>
            <CardHeader className="py-3 px-5 border-b border-[#e5e7eb]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#f7f9ff]">
                  <Users className="w-3.5 h-3.5 text-[#7c88c4]" />
                </div>
                <span className="text-xs font-semibold text-[#7c88c4]">{t("dashboard.content.charts.targetAudience")}</span>
              </div>
            </CardHeader>
            <CardContent className="px-5 py-4 space-y-3">
              <div>
                <label className="text-[10px] font-medium text-[#5f6678] mb-1 block">{t("dashboardPages.notifications.selectLocation")}</label>
                <Select value={selectedLocationId} onValueChange={setSelectedLocationId} disabled={locations.length === 0}>
                  <SelectTrigger className="w-full rounded-2xl border-[#dde1ee] h-9 text-xs">
                    <SelectValue placeholder={locations.length === 0 ? t("dashboardPages.notifications.noLocationsAvailable") : t("dashboardPages.notifications.selectLocationPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id.toString()}>{location.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {locations.length === 0 && (
                  <p className="text-[10px] text-[#5f6678] mt-1.5">
                    {t("dashboardPages.notifications.noLocationsMessage")}{" "}
                    <Link to="/dashboard/locations" className="text-[#7c88c4] underline">{t("dashboardPages.notifications.locationsLink")}</Link>
                  </p>
                )}
              </div>

              <div>
                <label className="text-[10px] font-medium text-[#5f6678] mb-1.5 block">{t("dashboardPages.notifications.sendTo")}</label>
                <div className="flex gap-2">
                  <button
                    className={`flex-1 py-1.5 px-3 rounded-2xl text-[10px] font-bold transition-all ${targetType === "all" ? "bg-[#7c88c4] text-white shadow-sm" : "bg-white text-[#5f6678] border border-[#e5e7eb] hover:border-[#7c88c4]"}`}
                    onClick={() => setTargetType("all")}
                  >
                    {t("dashboardPages.notifications.allCustomers")}
                  </button>
                  <button
                    className={`flex-1 py-1.5 px-3 rounded-2xl text-[10px] font-bold transition-all ${targetType === "selected" ? "bg-[#7c88c4] text-white shadow-sm" : "bg-white text-[#5f6678] border border-[#e5e7eb] hover:border-[#7c88c4]"}`}
                    onClick={() => setTargetType("selected")}
                  >
                    {t("dashboardPages.notifications.selectedSegments")}
                  </button>
                </div>
              </div>

              {targetType === "selected" && (
                <div className="space-y-2 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-[#f7f9ff] transition-colors">
                    <input type="checkbox" checked={birthdayTomorrow} onChange={(e) => setBirthdayTomorrow(e.target.checked)} className="w-3.5 h-3.5 accent-[#7c88c4]" />
                    <CalendarDays className="w-3.5 h-3.5 text-[#7c88c4]" />
                    <span className="text-xs text-[#5f6678]">{t("dashboardPages.notifications.birthdayTomorrow")}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-[#f7f9ff] transition-colors">
                    <input type="checkbox" checked={yesterdayVisitors} onChange={(e) => setYesterdayVisitors(e.target.checked)} className="w-3.5 h-3.5 accent-[#7c88c4]" />
                    <UserCheck className="w-3.5 h-3.5 text-[#7c88c4]" />
                    <span className="text-xs text-[#5f6678]">{t("dashboardPages.notifications.yesterdayVisitors")}</span>
                  </label>
                </div>
              )}

              <div className="flex items-center gap-1.5 text-[10px] text-[#5f6678] bg-[#f7f9ff] px-3 py-2 rounded-2xl">
                <Users className="w-3 h-3" />
                <span><strong className="text-[#7c88c4]">{recipientCount}</strong> {t("dashboardPages.notifications.willReceive")}</span>
              </div>
            </CardContent>
          </Card>

          {/* Message Input */}
          <Card className={cardClass}>
            <CardHeader className="py-3 px-5 border-b border-[#e5e7eb]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#f7f9ff]">
                  <BellRing className="w-3.5 h-3.5 text-[#7c88c4]" />
                </div>
                <span className="text-xs font-semibold text-[#7c88c4]">{t("dashboardPages.notifications.message")}</span>
              </div>
            </CardHeader>
            <CardContent className="px-6 py-5 space-y-3">
              <textarea
                maxLength={100}
                placeholder={t("dashboardPages.notifications.writeMessage")}
                className="w-full h-[80px] rounded-2xl border border-[#dde1ee] p-2.5 text-xs resize-none outline-none focus:border-[#7c88c4] focus:ring-2 focus:ring-[#7c88c4]/20 transition-all"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                className="flex items-center gap-1.5 bg-[#7c88c4] text-white px-5 py-2 rounded-2xl text-xs font-bold hover:bg-[#5a68b0] transition-colors disabled:opacity-40"
                disabled={!message.trim()}
                onClick={() => {
                  const label = targetType === "all" ? t("dashboardPages.notifications.allCustomersLabel") : (
                    [birthdayTomorrow ? t("dashboardPages.notifications.birthdayTomorrow") : "", yesterdayVisitors ? t("dashboardPages.notifications.yesterdayVisitors") : ""].filter(Boolean).join(" + ")
                  );
                  const history = JSON.parse(localStorage.getItem("notification_history") || "[]");
                  history.unshift({ id: Date.now(), date: new Date().toISOString(), message, recipients: recipientCount, target: label || undefined });
                  localStorage.setItem("notification_history", JSON.stringify(history));
                  setHistoryList(history);
                  toast.success(`${t("dashboardPages.notifications.sentTo")} ${recipientCount} ${t("dashboardPages.notifications.recipient")}`);
                  setMessage("");
                }}
              >
                <Send className="w-4 h-4" />
                {t("dashboardPages.notifications.send")}
              </button>
            </CardContent>
          </Card>

          {/* Notifications History */}
          <Card className={cardClass}>
            <CardHeader className="py-3 px-5 border-b border-[#e5e7eb]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#f7f9ff]">
                  <Clock className="w-3.5 h-3.5 text-[#7c88c4]" />
                </div>
                <span className="text-xs font-semibold text-[#7c88c4]">{t("dashboardPages.notifications.notificationHistory")}</span>
              </div>
            </CardHeader>
            <CardContent className="px-5 py-3 max-h-[240px] overflow-y-auto">
              {historyList.length === 0 ? (
                <div className="text-xs text-[#5f6678] text-center py-6">{t("dashboardPages.cards.viewCard.noNotifications")}</div>
              ) : (
                <div className="divide-y divide-[#e5e7eb]">
                  {[...historyList].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((n) => (
                    <div key={n.id} className="py-2.5 first:pt-0 last:pb-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] text-[#5f6678]">{(() => {
                          try { return format(new Date(n.date), "dd MMM yyyy, hh:mm a", { locale: ar }); } catch { return n.date; }
                        })()}</span>
                        <span className="text-[10px] text-[#5f6678] bg-[#f7f9ff] px-1.5 py-0.5 rounded">
                          {n.target && <span className="text-[9px] text-[#5f6678] ml-1">{n.target} · </span>}
                          {t("dashboardPages.notifications.reached")} {n.recipients}
                        </span>
                      </div>
                      <p className="text-xs text-[#5f6678] whitespace-pre-line leading-relaxed">{n.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Phone Preview — 2 cols */}
        <div className="lg:col-span-2 flex items-start justify-center lg:sticky lg:top-6">
          <div className="relative flex flex-col items-center" dir="ltr">
            <div className="overflow-hidden relative w-[220px] max-xsm:w-[180px]">
              <img alt="" src="/dashboard/ios.svg" className="w-full h-full object-contain" />
              <div className="w-[85%] h-[61%] absolute top-0 translate-y-[105%] right-[50%] translate-x-[50%] rounded-[6px] overflow-hidden">
                <div className="m-1">
                  <div className="w-full flex flex-col bg-gray-700/60 shadow-md rounded-md p-4 text-white">
                    <div className="flex items-center justify-between text-[10px]">
                      <div className="flex gap-2 items-center">
                        <BellRing className="w-[18px] h-[18px]" strokeWidth={2.25} stroke="#ffffff" />
                        <h1 className="text-[13px]">{selectedLocation?.name || t("dashboardPages.notifications.title")}</h1>
                      </div>
                      <span>{t("dashboardPages.notifications.now")}</span>
                    </div>
                    <p className="mt-1 text-[12px]">{message || t("dashboardPages.notifications.writeMessage")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
