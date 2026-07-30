import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Plus, Search, ChevronLeft, ChevronRight, Trash2, UserCog, UserCheck, Pencil,
  CalendarDays, Trophy, Users, Award, Gift, Stamp, TrendingUp, BarChart3
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { toast } from "sonner";

interface AuditEntry {
  id: number;
  managerName: string;
  createdAt: string;
  customerName: string;
  event: string;
  cashbackStamps: number;
}

const quickRangesAr = ["يوم", "أسبوع", "شهر", "سنة", "كل الوقت"];
const quickRangesEn = ["Day", "Week", "Month", "Year", "All Time"];

interface Manager {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "manager" | "cashier";
  createdAt: string;
  lastLogin: string;
}

const avatarColors = ["#7c88c4", "#e8796b", "#5baae0", "#67b99a", "#f4a261"];
const cardClass = "border border-[#d4d9ef] rounded-2xl bg-white shadow-[0_4px_24px_rgba(124,136,196,.12)]";

const emptyForm = {
  firstName: "", lastName: "", email: "", phone: "", countryCode: "+966",
  password: "", confirmPassword: "", role: "cashier" as "manager" | "cashier",
};

interface ManagerRow {
  name: string;
  stamps: number;
  rewards: number;
  total: number;
}

export function ManagersPage() {
  const { t, i18n } = useTranslation();
  const { isRTL } = useDirection();
  const navigate = useNavigate();
  const isArabic = i18n.language === "ar";

  const [tab, setTab] = useState<"managers" | "analytics">("managers");
  const [activeRange, setActiveRange] = useState(isArabic ? "شهر" : "Month");
  const quickRanges = isArabic ? quickRangesAr : quickRangesEn;

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [f, setF] = useState({ ...emptyForm });

  const setField = (field: string, value: string) => setF(prev => ({ ...prev, [field]: value }));

  const managers = useMemo((): Manager[] => {
    try {
      const raw = localStorage.getItem("dashboard_managers");
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }, []);

  const filtered = useMemo(() => {
    if (!searchTerm) return managers;
    const q = searchTerm.toLowerCase();
    return managers.filter(m =>
      m.firstName.toLowerCase().includes(q) ||
      m.lastName.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.phone.includes(q)
    );
  }, [managers, searchTerm]);

  const saveManagers = (list: Manager[]) => {
    localStorage.setItem("dashboard_managers", JSON.stringify(list));
    window.location.reload();
  };

  const getList = (): Manager[] => JSON.parse(localStorage.getItem("dashboard_managers") || "[]");

  const validate = () => {
    if (!f.firstName || !f.lastName || !f.email || !f.phone || (!editId && !f.password)) {
      toast.error(isArabic ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill all required fields");
      return false;
    }
    if (!editId && f.password !== f.confirmPassword) {
      toast.error(isArabic ? "كلمة المرور غير متطابقة" : "Passwords do not match");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(f.email)) {
      toast.error(isArabic ? "البريد الإلكتروني غير صحيح" : "Invalid email address");
      return false;
    }
    const phoneDigits = f.phone.replace(/\D/g, '');
    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      toast.error(isArabic ? "رقم الجوال غير صحيح" : "Invalid phone number");
      return false;
    }
    return true;
  };

  const makeManager = (): Manager => ({
    id: editId || crypto.randomUUID(),
    firstName: f.firstName,
    lastName: f.lastName,
    email: f.email,
    phone: f.countryCode + f.phone,
    role: f.role,
    createdAt: editId
      ? (getList().find(m => m.id === editId)?.createdAt || new Date().toLocaleDateString(isArabic ? "ar-SA" : "en-US", { year: "numeric", month: "short", day: "numeric" }))
      : new Date().toLocaleDateString(isArabic ? "ar-SA" : "en-US", { year: "numeric", month: "short", day: "numeric" }),
    lastLogin: editId ? (getList().find(m => m.id === editId)?.lastLogin || "-") : "-",
  });

  const handleAdd = () => {
    if (!validate()) return;
    const list = getList();
    list.push(makeManager());
    saveManagers(list);
    setIsAddOpen(false);
    toast.success(isArabic ? "تم إضافة المستخدم بنجاح" : "User added successfully");
  };

  const handleEdit = () => {
    if (!validate()) return;
    const list = getList();
    const idx = list.findIndex(m => m.id === editId);
    if (idx !== -1) {
      list[idx] = makeManager();
      saveManagers(list);
    }
    setIsEditOpen(false);
    toast.success(isArabic ? "تم تحديث المستخدم بنجاح" : "User updated successfully");
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    const list = getList();
    saveManagers(list.filter(m => !selectedIds.includes(m.id)));
    setSelectedIds([]);
    toast.success(isArabic ? "تم حذف المستخدمين المحددين" : "Selected users deleted");
  };

  const openEdit = (m: Manager) => {
    setEditId(m.id);
    setF({
      firstName: m.firstName, lastName: m.lastName, email: m.email,
      phone: m.phone.replace(/^\+\d+/, ""), countryCode: m.phone.match(/^\+\d+/)?.[0] || "+966",
      password: "", confirmPassword: "", role: m.role,
    });
    setIsEditOpen(true);
  };

  const deleteSingle = (id: string) => {
    const list = getList();
    saveManagers(list.filter(m => m.id !== id));
    toast.success(isArabic ? "تم حذف المستخدم" : "User deleted");
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    setSelectedIds(prev => prev.length === filtered.length ? [] : filtered.map(m => m.id));
  };

  const getInitials = (first: string, last: string) => (first[0] + last[0]).toUpperCase();

  const roleLabel = (role: "manager" | "cashier") => {
    if (isArabic) return role === "manager" ? "مدير" : "كاشير";
    return role === "manager" ? "Manager" : "Cashier";
  };

  const resetForm = () => { setF({ ...emptyForm }); setEditId(null); };

  const formFields = (withPassword: boolean) => (
    <div className="grid gap-4 py-4">
      <div className="space-y-2">
        <Label>{isArabic ? "نوع المستخدم" : "User Type"}</Label>
        <Select value={f.role} onValueChange={(v: "manager" | "cashier") => setField("role", v)}>
          <SelectTrigger className="w-full border-[#d4d9ef] rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="cashier">
              <span className="flex items-center gap-2"><UserCheck className="h-4 w-4 text-[#7c88c4]" /> {isArabic ? "كاشير" : "Cashier"}</span>
            </SelectItem>
            <SelectItem value="manager">
              <span className="flex items-center gap-2"><UserCog className="h-4 w-4 text-[#7c88c4]" /> {isArabic ? "مدير فرعي" : "Sub Manager"}</span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="efn">{t("dashboardPages.managers.firstName")}</Label>
          <Input id="efn" value={f.firstName} onChange={e => setField("firstName", e.target.value)} placeholder={t("dashboardPages.managers.firstNamePlaceholder")} className="border-[#d4d9ef] rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="eln">{t("dashboardPages.managers.lastName")}</Label>
          <Input id="eln" value={f.lastName} onChange={e => setField("lastName", e.target.value)} placeholder={t("dashboardPages.managers.lastNamePlaceholder")} className="border-[#d4d9ef] rounded-xl" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="eem">{t("dashboardPages.managers.email")}</Label>
        <Input id="eem" type="email" value={f.email} onChange={e => setField("email", e.target.value)} placeholder={t("dashboardPages.managers.emailPlaceholder")} className="border-[#d4d9ef] rounded-xl" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="eph">{t("dashboardPages.managers.phone")}</Label>
        <div className="flex gap-2">
          <Select value={f.countryCode} onValueChange={v => setField("countryCode", v)}>
            <SelectTrigger className="w-32 border-[#d4d9ef] rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="+966">+966</SelectItem>
              <SelectItem value="+971">+971</SelectItem>
              <SelectItem value="+965">+965</SelectItem>
            </SelectContent>
          </Select>
          <Input id="eph" value={f.phone} onChange={e => setField("phone", e.target.value)} placeholder={t("dashboardPages.managers.phonePlaceholder")} className="flex-1 border-[#d4d9ef] rounded-xl" dir="ltr" />
        </div>
      </div>
      {withPassword && (
        <>
          <div className="space-y-2">
            <Label htmlFor="epw">{t("dashboardPages.managers.password")}</Label>
            <Input id="epw" type="password" value={f.password} onChange={e => setField("password", e.target.value)} placeholder={t("dashboardPages.managers.passwordPlaceholder")} className="border-[#d4d9ef] rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ecpw">{t("dashboardPages.managers.confirmPassword")}</Label>
            <Input id="ecpw" type="password" value={f.confirmPassword} onChange={e => setField("confirmPassword", e.target.value)} placeholder={t("dashboardPages.managers.confirmPasswordPlaceholder")} className="border-[#d4d9ef] rounded-xl" />
          </div>
        </>
      )}
    </div>
  );

  const [refresh, setRefresh] = useState(0);
  const analytics = useMemo(() => {
    try {
      const raw = localStorage.getItem("customer_points");
      const parsed: any = raw ? JSON.parse(raw) : {};
      let flat: Record<string, number> = {};
      if (typeof parsed === "object" && !Array.isArray(parsed)) {
        const firstVal = Object.values(parsed)[0];
        if (typeof firstVal === "number") {
          flat = parsed;
        } else {
          for (const customers of Object.values(parsed)) {
            for (const [cid, pts] of Object.entries(customers as Record<string, number>)) {
              flat[cid] = (flat[cid] || 0) + pts;
            }
          }
        }
      }
      const raw2 = localStorage.getItem("registered_customers");
      const stored: any[] = raw2 ? JSON.parse(raw2) : [];
      const storedIds = new Set(stored.map((c: any) => String(c.id)));
      const fallbackIds = new Set(["1", "2", "3", "4", "5", "6", "7", "8"]);
      const entries = Object.entries(flat).filter(([id]) => storedIds.has(id) || fallbackIds.has(id));
      const totalPoints = entries.reduce((sum, [, v]) => sum + v, 0);
      const mostActiveId = entries.length
        ? entries.reduce((a, b) => (a[1] >= b[1] ? a : b))[0]
        : null;
      const totalCustomers = stored.length + 8;

      const auditRaw = localStorage.getItem("audit_logs");
      const audit: AuditEntry[] = auditRaw ? JSON.parse(auditRaw) : [];
      const managerMap = new Map<string, ManagerRow>();
      for (const log of audit) {
        if (!managerMap.has(log.managerName)) {
          managerMap.set(log.managerName, { name: log.managerName, stamps: 0, rewards: 0, total: 0 });
        }
        const row = managerMap.get(log.managerName)!;
        const isRedemption = log.event?.includes("استبدل") || log.event?.includes("Redeemed");
        if (isRedemption) {
          row.rewards += log.cashbackStamps || 1;
        } else {
          row.stamps += log.cashbackStamps || 1;
        }
        row.total = row.stamps + row.rewards;
      }
      const managerRows = Array.from(managerMap.values());
      const totalRewards = audit.length;

      return { totalPoints, mostActiveId, totalCustomers, managerRows, totalRewards };
    } catch {
      return { totalPoints: 0, mostActiveId: null as string | null, totalCustomers: 8, managerRows: [] as ManagerRow[], totalRewards: 0 };
    }
  }, [refresh]);

  const kpiCards = [
    { title: isArabic ? "إجمالي العملاء" : "Total Customers", value: analytics.totalCustomers, icon: Users, dark: true },
    { title: isArabic ? "النقاط الممنوحة" : "Points Given", value: analytics.totalPoints, icon: Award, dark: false },
    { title: isArabic ? "المكافآت المستبدلة" : "Rewards Redeemed", value: analytics.totalRewards, icon: Gift, dark: false },
    { title: isArabic ? "معدل التفعيل" : "Activation Rate", value: "0%", icon: TrendingUp, dark: false },
    { title: isArabic ? "الأكثر نشاطاً" : "Most Active", value: analytics.mostActiveId || (isArabic ? "—" : "—"), icon: Trophy, dark: false },
  ];

  const managerTableColumns = [
    { label: isArabic ? "المدير" : "Manager", key: "name", width: "" },
    { label: isArabic ? "الأختام الممنوحة" : "Stamps Granted", key: "stamps", width: "text-center" },
    { label: isArabic ? "المكافآت المستبدلة" : "Rewards Redeemed", key: "rewards", width: "text-center" },
    { label: isArabic ? "الإجمالي" : "Total", key: "total", width: "text-center" },
  ];

  return (
    <div className="px-4 md:px-10 py-6 bg-[#f2f3f8] min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800 mb-4 text-start">
          {isArabic ? "المدراء" : "Managers"}
        </h1>
        <div className="flex items-center gap-1 border-b border-gray-200">
          <button
            onClick={() => setTab("managers")}
            className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
              tab === "managers"
                ? "bg-white text-gray-900 border border-b-0 border-gray-200 -mb-px"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {isArabic ? "المدراء" : "Managers"}
          </button>
          <button
            onClick={() => { setTab("analytics"); setRefresh(x => x + 1); }}
            className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
              tab === "analytics"
                ? "bg-white text-gray-900 border border-b-0 border-gray-200 -mb-px"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {isArabic ? "التحليلات" : "Analytics"}
          </button>
        </div>
      </div>

      {tab === "managers" ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                <Input
                  placeholder={t("dashboardPages.managers.searchManager")}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className={`${isRTL ? 'pr-10' : 'pl-10'} w-64 border-[#d4d9ef] rounded-xl bg-white h-9 text-sm`}
                />
              </div>
              <Dialog open={isAddOpen} onOpenChange={o => { setIsAddOpen(o); if (!o) resetForm(); }}>
                <DialogTrigger asChild>
                  <Button className="bg-[#7c88c4] hover:bg-[#6a76b0] text-white rounded-xl h-9 px-4 text-xs flex items-center gap-1.5">
                    <Plus className="h-4 w-4" /> {t("dashboardPages.managers.addManager")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[480px] border-[#d4d9ef] rounded-2xl">
                  <DialogHeader><DialogTitle className="text-base">{t("dashboardPages.managers.addNewManager")}</DialogTitle></DialogHeader>
                  {formFields(true)}
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-xl text-xs h-9 px-4">{t("dashboardPages.managers.cancel")}</Button>
                    <Button onClick={handleAdd} className="bg-[#7c88c4] hover:bg-[#6a76b0] text-white rounded-xl text-xs h-9 px-4">{isArabic ? "إضافة" : "Add"}</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <Button
              variant="outline" disabled={selectedIds.length === 0} onClick={handleDeleteSelected}
              className="border-red-200 text-red-500 hover:bg-red-50 rounded-xl h-9 px-3 text-xs flex items-center gap-1.5"
            >
              <Trash2 className="h-4 w-4" /> {isArabic ? "حذف" : "Delete"}
            </Button>
          </div>

          <Card className={cardClass}>
            <CardContent className="p-5">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-[#d4d9ef]/60">
                    <TableHead className="w-10 py-4 px-4"><Checkbox checked={filtered.length > 0 && selectedIds.length === filtered.length} onCheckedChange={toggleAll} /></TableHead>
                    <TableHead className="text-xs text-gray-500 font-medium py-4 px-4">{isArabic ? "الاسم" : "Name"}</TableHead>
                    <TableHead className="text-xs text-gray-500 font-medium py-4 px-4">{isArabic ? "الدور" : "Role"}</TableHead>
                    <TableHead className="text-xs text-gray-500 font-medium py-4 px-4">{isArabic ? "البريد الإلكتروني" : "Email"}</TableHead>
                    <TableHead className="text-xs text-gray-500 font-medium py-4 px-4">{isArabic ? "رقم الهاتف" : "Phone"}</TableHead>
                    <TableHead className="text-xs text-gray-500 font-medium py-4 px-4">{isArabic ? "تاريخ الإنشاء" : "Created"}</TableHead>
                    <TableHead className="text-xs text-gray-500 font-medium py-4 px-4">{isArabic ? "آخر دخول" : "Last Login"}</TableHead>
                    <TableHead className="text-xs text-gray-500 font-medium py-4 px-4 text-center">{isArabic ? "الإجراءات" : "Actions"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-gray-400 text-xs py-14">{isArabic ? "لا يوجد مستخدمين بعد" : "No users yet"}</TableCell>
                    </TableRow>
                  ) : filtered.map((m, idx) => (
                    <TableRow key={m.id} className="border-b border-[#d4d9ef]/30 last:border-0">
                      <TableCell className="py-4 px-4"><Checkbox checked={selectedIds.includes(m.id)} onCheckedChange={() => toggleSelect(m.id)} /></TableCell>
                      <TableCell className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 shrink-0">
                            <AvatarFallback className="text-white text-xs font-bold" style={{ backgroundColor: avatarColors[idx % avatarColors.length] }}>
                              {getInitials(m.firstName, m.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium text-gray-800">{m.firstName} {m.lastName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-4">
                        <span className={`inline-block text-[11px] px-3 py-1 rounded-full font-medium whitespace-nowrap ${
                          m.role === "manager" ? "bg-purple-50 text-purple-600 border border-purple-200" : "bg-blue-50 text-blue-600 border border-blue-200"
                        }`}>{roleLabel(m.role)}</span>
                      </TableCell>
                      <TableCell className="text-sm py-4 px-4 text-gray-600" dir="ltr">{m.email}</TableCell>
                      <TableCell className="text-sm py-4 px-4 text-gray-600 whitespace-nowrap" dir="ltr">{m.phone}</TableCell>
                      <TableCell className="text-sm py-4 px-4 text-gray-600 whitespace-nowrap">{m.createdAt}</TableCell>
                      <TableCell className="text-sm py-4 px-4 text-gray-600 whitespace-nowrap">{m.lastLogin}</TableCell>
                      <TableCell className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openEdit(m)} className="h-9 w-9 p-0 rounded-xl text-gray-400 hover:text-[#7c88c4] hover:bg-[#7c88c4]/10">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => deleteSingle(m.id)} className="h-9 w-9 p-0 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Dialog open={isEditOpen} onOpenChange={o => { setIsEditOpen(o); if (!o) resetForm(); }}>
            <DialogContent className="sm:max-w-[480px] border-[#d4d9ef] rounded-2xl">
              <DialogHeader><DialogTitle className="text-base">{isArabic ? "تعديل المستخدم" : "Edit User"}</DialogTitle></DialogHeader>
              {formFields(false)}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditOpen(false)} className="rounded-xl text-xs h-9 px-4">{t("dashboardPages.managers.cancel")}</Button>
                <Button onClick={handleEdit} className="bg-[#7c88c4] hover:bg-[#6a76b0] text-white rounded-xl text-xs h-9 px-4">{isArabic ? "حفظ" : "Save"}</Button>
              </div>
            </DialogContent>
          </Dialog>

          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-gray-500">{isArabic ? `عرض ${filtered.length} من ${managers.length} مستخدم` : `Shown ${filtered.length} of ${managers.length}`}</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled className="h-8 w-8 p-0 rounded-lg border-[#d4d9ef]"><ChevronLeft className="h-4 w-4" /></Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-lg bg-[#7c88c4] text-white border-[#7c88c4] text-xs">1</Button>
              <Button variant="outline" size="sm" disabled className="h-8 w-8 p-0 rounded-lg border-[#d4d9ef]"><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={`flex flex-wrap items-center justify-between gap-2 mb-3 ${cardClass} p-2.5`}>
            <div className="flex items-center gap-1.5 text-xs text-gray-700">
              <CalendarDays className="h-3.5 w-3.5 text-gray-400 shrink-0" />
              <Input type="date" defaultValue="2026-07-01" className="w-24 h-7 border border-[#d4d9ef] rounded text-[10px] px-1.5 bg-white" dir="ltr" />
              <span className="text-gray-400">–</span>
              <Input type="date" defaultValue="2026-07-29" className="w-24 h-7 border border-[#d4d9ef] rounded text-[10px] px-1.5 bg-white" dir="ltr" />
            </div>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
              {quickRanges.map((r) => (
                <button
                  key={r}
                  onClick={() => setActiveRange(r)}
                  className={`px-2.5 py-1 text-[10px] font-medium rounded-md transition-colors ${
                    activeRange === r
                      ? "bg-[#7c88c4] text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 mb-3">
            {kpiCards.map((k, idx) => {
              const Icon = k.icon;
              return idx === 0 ? (
                <Card key={k.title} className="border-0 rounded-xl bg-[#7c88c4] text-white shadow-[0_4px_24px_rgba(124,136,196,.12)]">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon className="h-3.5 w-3.5 text-yellow-300 shrink-0" />
                      <span className="text-[10px] font-medium text-gray-100">{k.title}</span>
                    </div>
                    <p className="text-[11px] text-gray-200">{k.value}</p>
                  </CardContent>
                </Card>
              ) : (
                <Card key={k.title} className={cardClass}>
                  <CardContent className="p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon className="h-3.5 w-3.5 text-[#7c88c4]" />
                      <span className="text-[10px] font-medium text-gray-500">{k.title}</span>
                    </div>
                    <p className="text-xs font-bold text-gray-800">{k.value}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className={cardClass}>
            <CardContent className="p-3.5">
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-[11px] font-bold text-gray-800 text-start">
                  {isArabic ? "العمليات حسب المدير" : "Transactions by Manager"}
                </h3>
              </div>
              {analytics.managerRows.length === 0 ? (
                <div className="flex items-center justify-center h-44 text-gray-400 text-xs bg-[#f8f9fa] rounded-xl">
                  <div className="text-center">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p>{isArabic ? "لا يوجد نشاط في هذه الفترة" : "No activity in this period"}</p>
                  </div>
                </div>
              ) : (
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.managerRows} barCategoryGap="20%" barGap={4}>
                      <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                      <YAxis stroke="#9ca3af" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e5e7eb", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }} labelStyle={{ fontSize: 11 }} />
                      <Bar dataKey="stamps" name={isArabic ? "الأختام" : "Stamps"} fill="#7c88c4" radius={[6, 6, 0, 0]} maxBarSize={30} />
                      <Bar dataKey="rewards" name={isArabic ? "المكافآت" : "Rewards"} fill="#A6AFD8" radius={[6, 6, 0, 0]} maxBarSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className={cardClass}>
            <CardContent className="p-3.5">
              <h3 className="text-[11px] font-bold text-gray-800 text-center mb-2.5">
                {isArabic ? "التحليلات صفحة جانبية للمدير" : "Manager Side Analytics"}
              </h3>
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-[#d4d9ef]/60">
                    {[
                      { label: isArabic ? "المدير" : "Manager", key: "name", width: "" },
                      { label: isArabic ? "الأختام الممنوحة" : "Stamps Granted", key: "stamps", width: "text-center" },
                      { label: isArabic ? "المكافآت المستبدلة" : "Rewards Redeemed", key: "rewards", width: "text-center" },
                      { label: isArabic ? "الإجمالي" : "Total", key: "total", width: "text-center" },
                    ].map((col) => (
                      <TableHead
                        key={col.key}
                        className={`text-[10px] text-gray-500 font-medium py-1.5 px-2 whitespace-nowrap ${col.width}`}
                      >
                        {col.label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics.managerRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-gray-400 text-xs py-8">
                        {isArabic ? "لا يوجد نشاط بعد" : "No activity yet"}
                      </TableCell>
                    </TableRow>
                  ) : analytics.managerRows.map((row, i) => (
                    <TableRow key={i} className="border-b border-[#d4d9ef]/30 last:border-0">
                      <TableCell className="text-xs font-medium text-gray-800 py-2 px-2">{row.name}</TableCell>
                      <TableCell className="text-xs text-gray-600 py-2 px-2 text-center">{row.stamps}</TableCell>
                      <TableCell className="text-xs text-gray-600 py-2 px-2 text-center">{row.rewards}</TableCell>
                      <TableCell className="text-xs font-semibold text-gray-800 py-2 px-2 text-center">{row.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
