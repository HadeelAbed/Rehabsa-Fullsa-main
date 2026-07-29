import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";

interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  birthDate: string | null;
  lastVisitDate: string;
  registrationDate: string;
}

const fallbackCustomers: Customer[] = [
  { id: "1", fullName: "هديل", email: "hadeel@example.com", phone: "5059595050", birthDate: null, lastVisitDate: "10/22/2025 4:55:43 PM", registrationDate: "10/22/2025 4:55:43 PM" },
  { id: "2", fullName: "مداوي القحطاني", email: "medawi@example.com", phone: "580005528", birthDate: null, lastVisitDate: "10/22/2025 4:54:40 PM", registrationDate: "10/22/2025 4:53:52 PM" },
  { id: "3", fullName: "سعيد", email: "saeed@example.com", phone: "551047087", birthDate: null, lastVisitDate: "10/22/2025 2:23:08 PM", registrationDate: "10/22/2025 2:22:39 PM" },
  { id: "4", fullName: "ابو حاتم", email: "abohatim@example.com", phone: "569941511", birthDate: null, lastVisitDate: "10/22/2025 12:27:07 PM", registrationDate: "10/22/2025 12:25:06 PM" },
  { id: "5", fullName: "فهد", email: "fahad@example.com", phone: "566889900", birthDate: null, lastVisitDate: "10/21/2025", registrationDate: "10/20/2025" },
  { id: "6", fullName: "سارة", email: "sara@example.com", phone: "505050505", birthDate: "1995-03-15", lastVisitDate: "10/25/2025", registrationDate: "10/18/2025" },
  { id: "7", fullName: "نورة", email: "noura@example.com", phone: "544332211", birthDate: "2000-07-22", lastVisitDate: "10/26/2025", registrationDate: "10/15/2025" },
  { id: "8", fullName: "خالد", email: "khaled@example.com", phone: "577661122", birthDate: null, lastVisitDate: "10/19/2025", registrationDate: "10/10/2025" },
];

const avatarColors = ["#7c88c4", "#e8796b", "#5baae0", "#67b99a", "#f4a261", "#a78bfa", "#f472b6", "#34d399"];

export function CustomersPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const [searchInput, setSearchInput] = useState("");

  const customers = useMemo(() => {
    try {
      const raw = localStorage.getItem("registered_customers");
      const stored: Customer[] = raw ? JSON.parse(raw) : [];
      const merged = [...fallbackCustomers];
      for (const s of stored) {
        if (!merged.find((m) => String(m.id) === String(s.id))) {
          merged.push(s);
        }
      }
      return merged;
    } catch {
      return fallbackCustomers;
    }
  }, []);

  function readAllPoints(): Record<string, Record<string, number>> {
    try {
      const raw = localStorage.getItem("customer_points");
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      if (typeof parsed === "object" && !Array.isArray(parsed)) {
        const firstVal = Object.values(parsed)[0];
        if (typeof firstVal === "number") {
          return { "000-000-000-000": parsed };
        }
        return parsed;
      }
      return {};
    } catch { return {}; }
  }

  const customerTotalPoints = useMemo(() => {
    const cardMap = readAllPoints();
    const total: Record<string, number> = {};
    for (const customers of Object.values(cardMap)) {
      for (const [cid, pts] of Object.entries(customers)) {
        total[cid] = (total[cid] || 0) + pts;
      }
    }
    return total;
  }, []);

  const filtered = useMemo(() => {
    if (!searchInput) return customers;
    const q = searchInput.trim().toLowerCase();
    return customers.filter(
      (c) => c.fullName.toLowerCase().includes(q) || c.phone.includes(q)
    );
  }, [customers, searchInput]);

  const getInitials = (name: string) =>
    name.split(" ").filter(Boolean).map((s) => s[0]).join("").slice(0, 2).toUpperCase();

  const cardClass = "border border-[#d4d9ef] rounded-2xl bg-white shadow-[0_4px_24px_rgba(124,136,196,.12)] transition-all duration-200 hover:shadow-[0_12px_48px_rgba(124,136,196,.26)]";

  return (
    <div className="px-4 md:px-10 py-6 bg-[#f2f3f8] min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
      <h1 className="text-xl font-bold text-gray-800 mb-6">
        {t("dashboardPages.customers.title")}
      </h1>

      {/* Search bar — full width */}
      <div className="flex items-center gap-2 mb-6">
        <Input
          placeholder={t("dashboardPages.customers.searchPlaceholder")}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && setSearchInput(searchInput)}
          className="flex-1 border-[#d4d9ef] rounded-xl bg-white h-11 text-sm"
        />
        <Button
          onClick={() => setSearchInput(searchInput)}
          className="bg-[#7c88c4] hover:bg-[#6a76b0] text-white rounded-xl h-11 px-6 flex items-center gap-2 shrink-0"
        >
          <Search className="h-4 w-4" />
          {t("dashboardPages.customers.search")}
        </Button>
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <Card className={`${cardClass} p-8 text-center`}>
            <p className="text-sm text-gray-400">
              {searchInput
                ? t("dashboardPages.customers.noResults", { query: searchInput })
                : t("dashboardPages.customers.noCustomers")}
            </p>
          </Card>
        ) : filtered.map((customer, idx) => (
          <Card key={customer.id} className={`${cardClass} hover:-translate-y-0.5`}>
            <div className="p-4">
              {/* Column headers */}
              <div className="grid grid-cols-12 gap-2 mb-1 px-1">
                <div className="col-span-4 text-xs text-gray-400 font-medium">{t("dashboardPages.customers.customerName")}</div>
                <div className="col-span-3 text-xs text-gray-400 font-medium text-center">{t("dashboardPages.customers.points")}</div>
                <div className="col-span-3 text-xs text-gray-400 font-medium text-center">{t("dashboardPages.customers.status")}</div>
                <div className="col-span-2"></div>
              </div>
              {/* Row data */}
              <div className="grid grid-cols-12 gap-2 items-center px-1">
                <div className="col-span-4 flex items-center gap-2.5">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="text-white text-xs font-bold" style={{ backgroundColor: avatarColors[idx % avatarColors.length] }}>
                      {getInitials(customer.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">{customer.fullName}</p>
                    <p className="text-[11px] text-gray-500" dir="ltr">{customer.phone}</p>
                  </div>
                </div>
                <div className="col-span-3 text-center">
                  <span className="font-bold text-gray-800">{customerTotalPoints[String(customer.id)] || 0}</span>
                </div>
                <div className="col-span-3 text-center">
                  <Badge variant="outline" className="border-red-200 text-red-500 bg-red-50 text-[11px] rounded-full px-2.5">
                    {t("dashboardPages.customers.inactive")}
                  </Badge>
                </div>
                <div className="col-span-2 text-left">
                  <Button
                    onClick={() => navigate(`/dashboard/customers/view/${customer.id}`)}
                    className="bg-[#7c88c4] hover:bg-[#6a76b0] text-white text-xs font-medium rounded-xl h-8 px-4 w-full"
                  >
                    {t("dashboardPages.customers.details")}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
