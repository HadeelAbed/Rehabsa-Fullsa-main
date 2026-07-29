import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { User, Mail, Phone, Cake, Smartphone, CheckCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { z } from "zod";
import { QRCodeCanvas } from "qrcode.react";

type CustomerRegisterFormData = {
  fullName: string;
  email: string;
  phone: string;
  birthDate?: string;
};

export const CustomerRegisterPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const cardParam = searchParams.get("card");
  const [isLoading, setIsLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [customerName, setCustomerName] = useState("");

  const cardName = useMemo(() => {
    if (!cardParam) return null;
    try {
      const raw = localStorage.getItem("dashboard_cards");
      const list: any[] = raw ? JSON.parse(raw) : [];
      return list.find((c: any) => c.cardId === cardParam)?.name || null;
    } catch { return null; }
  }, [cardParam]);

  const schema = useMemo(() => z.object({
    fullName: z.string().min(1, t("customerRegister.validation.fullNameRequired")).min(2, t("customerRegister.validation.fullNameMin")),
    email: z.string().min(1, t("customerRegister.validation.emailRequired")).email(t("customerRegister.validation.emailInvalid")),
    phone: z.string().min(1, t("customerRegister.validation.phoneRequired")).regex(/^[0-9]{8,15}$/, t("customerRegister.validation.phoneInvalid")),
    birthDate: z.string().optional(),
  }), [t]);

  const { register, handleSubmit, formState: { errors } } = useForm<CustomerRegisterFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: CustomerRegisterFormData) => {
    setIsLoading(true);
    try {
      const now = new Date().toISOString();
      const customer = {
        id: Date.now(),
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        birthDate: data.birthDate || null,
        lastVisitDate: now,
        registrationDate: now,
      };
      const existing = JSON.parse(localStorage.getItem("registered_customers") || "[]");
      existing.push(customer);
      localStorage.setItem("registered_customers", JSON.stringify(existing));
      if (cardParam) {
        const cardMap = JSON.parse(localStorage.getItem("customer_card") || "{}");
        cardMap[customer.id] = cardParam;
        localStorage.setItem("customer_card", JSON.stringify(cardMap));
      }
      setCustomerName(data.fullName);
      setRegistered(true);
    } catch {
      toast.error(t("customerRegister.error"));
    } finally {
      setIsLoading(false);
    }
  };

  if (registered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#eef0f8] via-white to-[#dde1f2] flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-lg border border-gray-100 p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t("customerRegister.welcomeTitle") || "أهلاً بك"}
          </h2>
          <p className="text-lg font-semibold text-[#7c88c4] mb-1">
            {customerName}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            {cardName
              ? (t("customerRegister.welcomeSubtitle") || "تم تسجيلك في") + ` ${cardName}`
              : t("customerRegister.welcomeSubtitle") || "تم تسجيلك بنجاح"}
          </p>
          <div className="flex gap-1 mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <div className="bg-gradient-to-br from-[#7c88c4] to-[#5a68b0] rounded-2xl p-6 w-full text-white shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <Smartphone className="w-4 h-4 text-white/70" />
              <span className="text-xs font-medium text-white/70 uppercase tracking-wider">
                {cardName || t("customerRegister.title") || "بطاقة الولاء"}
              </span>
            </div>
            <div className="text-right">
              <div className="text-lg font-black">{customerName}</div>
              <div className="text-xs text-white/60 mt-1">
                {t("customerRegister.welcomeCardMsg") || "نقاطك: 0"}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef0f8] via-white to-[#dde1f2] flex items-center justify-center p-4">
      <Card className="w-full max-w-md border border-gray-200 rounded-2xl shadow-lg">
        <CardHeader className="text-center py-6 px-8 border-b border-gray-50">
          <div className="flex justify-center mb-3">
            <div className="p-3 rounded-2xl bg-[#eef0f8]">
              <Smartphone className="w-8 h-8 text-[#7c88c4]" />
            </div>
          </div>
          <h1 className="text-xl font-bold text-gray-900">{t("customerRegister.title")}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {cardName
              ? `${t("customerRegister.subtitle")} — ${cardName}`
              : t("customerRegister.subtitle")}
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex justify-center mb-6">
            <div className="p-2 rounded-xl bg-[#eef0f8]">
              <QRCodeCanvas value={window.location.href} size={70} bgColor="#ffffff" fgColor="#7c88c4" level="M" />
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-sm font-medium">{t("customerRegister.fullName")}</Label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input id="fullName" type="text" placeholder={t("customerRegister.fullNamePlaceholder")} className="pr-10" {...register("fullName")} />
              </div>
              {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">{t("customerRegister.email")}</Label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input id="email" type="email" placeholder={t("customerRegister.emailPlaceholder")} className="pr-10" {...register("email")} />
              </div>
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-sm font-medium">{t("customerRegister.phone")}</Label>
              <div className="relative">
                <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input id="phone" type="tel" placeholder={t("customerRegister.phonePlaceholder")} className="pr-10" {...register("phone")} />
              </div>
              {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="birthDate" className="text-sm font-medium">{t("customerRegister.birthDate")}</Label>
              <div className="relative">
                <Cake className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input id="birthDate" type="date" className="pr-10" {...register("birthDate")} />
              </div>
            </div>
            <Button type="submit" className="w-full bg-[#7c88c4] hover:bg-[#5a68b0] text-white" disabled={isLoading}>
              {isLoading ? t("customerRegister.submitting") : t("customerRegister.submit")}
            </Button>
            <p className="text-[10px] text-gray-400 text-center leading-relaxed">
              {t("customerRegister.terms")}
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
