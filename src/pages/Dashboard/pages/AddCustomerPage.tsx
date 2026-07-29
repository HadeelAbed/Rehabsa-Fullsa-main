import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";

export function AddCustomerPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { isRTL: _isRTL } = useDirection();
  const isArabic = i18n.language === "ar";
  const [formData, setFormData] = React.useState({
    name: "",
    phone: "",
    email: "",
    birthDate: "",
    gender: "",
    address: "",
    cardId: "",
  });

  const allCards = useMemo(() => {
    const defaultCards = [
      { id: 1, name: "نادي اللياقة النخبة", cardId: "477-398-475-609" },

    ];
    try {
      const raw = localStorage.getItem("dashboard_cards");
      const saved: any[] = raw ? JSON.parse(raw) : [];
      return [...defaultCards, ...saved];
    } catch { return defaultCards; }
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // التحقق من البيانات المطلوبة
    if (!formData.name || !formData.phone) {
      toast.error(t("dashboardPages.messages.fillRequiredFields"), {
        description: t("dashboardPages.messages.namePhoneRequired")
      });
      return;
    }

    try {
      const raw = localStorage.getItem("registered_customers");
      const list = raw ? JSON.parse(raw) : [];
      const newId = String(Date.now());
      const newCustomer = {
        id: newId,
        fullName: formData.name,
        email: formData.email || "",
        phone: formData.phone,
        birthDate: formData.birthDate || null,
        lastVisitDate: new Date().toLocaleString("en-US", { hour12: true }),
        registrationDate: new Date().toLocaleString("en-US", { hour12: true }),
      };
      list.push(newCustomer);
      localStorage.setItem("registered_customers", JSON.stringify(list));

      if (formData.cardId) {
        const cardMap = JSON.parse(localStorage.getItem("customer_card") || "{}");
        cardMap[newId] = formData.cardId;
        localStorage.setItem("customer_card", JSON.stringify(cardMap));
      }

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
        customerName: formData.name,
        event: isArabic ? "تم تسجيل عميل جديد" : "New customer registered",
        cashbackStamps: 0,
      });
      localStorage.setItem("audit_logs", JSON.stringify(audit));

      toast.success(t("dashboardPages.messages.customerAddedSuccess"), {
        description: t("dashboardPages.messages.customerAccountCreated", { name: formData.name }),
        action: {
          label: t("dashboardPages.messages.viewDetails"),
          onClick: () => navigate("/dashboard/customers/view/" + newId)
        }
      });

      setFormData({
        name: "",
        phone: "",
        email: "",
        birthDate: "",
        gender: "",
        address: "",
        cardId: "",
      });
    } catch {
      toast.error("فشل حفظ العميل");
    }
  };

  const handleBack = () => {
    navigate("/dashboard/customers");
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 bg-[#fafbff] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleBack} className="rounded-2xl font-bold">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("dashboardPages.crud.back")}
          </Button>
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2 text-[#111111]">
              <UserPlus className="h-6 w-6" />
              {t("dashboardPages.customers.addCustomer")}
            </h1>
            <p className="text-[#5f6678]">{t("dashboardPages.messages.enterCustomerInfo") || "Enter new customer information"}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full">
        <Card className="border border-[#e5e7eb] rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#111111] font-bold">معلومات العميل</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#111111]">المعلومات الشخصية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[#111111] font-bold">الاسم الكامل *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder={t("dashboardPages.forms.fullNamePlaceholder")}
                      required
                      className="border-[#dde1ee] rounded-2xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-[#111111] font-bold">رقم الهاتف *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+966XXXXXXXXX"
                      required
                      className="border-[#dde1ee] rounded-2xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[#111111] font-bold">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="example@email.com"
                      className="border-[#dde1ee] rounded-2xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthDate" className="text-[#111111] font-bold">تاريخ الميلاد</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => handleInputChange("birthDate", e.target.value)}
                      className="border-[#dde1ee] rounded-2xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-[#111111] font-bold">الجنس</Label>
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                      <SelectTrigger className="border-[#dde1ee] rounded-2xl">
                        <SelectValue placeholder={t("dashboardPages.forms.genderPlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">ذكر</SelectItem>
                        <SelectItem value="female">أنثى</SelectItem>
                        <SelectItem value="other">غير محدد</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardId" className="text-[#111111] font-bold">{isArabic ? "البطاقة" : "Card"}</Label>
                    <Select value={formData.cardId} onValueChange={(value) => handleInputChange("cardId", value)}>
                      <SelectTrigger className="border-[#dde1ee] rounded-2xl">
                        <SelectValue placeholder={isArabic ? "اختر بطاقة" : "Select a card"} />
                      </SelectTrigger>
                      <SelectContent>
                        {allCards.map((c: any) => (
                          <SelectItem key={c.cardId} value={c.cardId}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-[#111111] font-bold">العنوان</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder={t("dashboardPages.forms.addressPlaceholder")}
                    rows={3}
                    className="border-[#dde1ee] rounded-2xl"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-6 border-t border-[#e5e7eb]">
                <Button type="button" variant="outline" onClick={handleBack} className="rounded-2xl font-bold">
                  إلغاء
                </Button>
                <Button type="submit" className="flex items-center gap-2 rounded-2xl font-extrabold">
                  <Save className="h-4 w-4" />
                  حفظ العميل
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
