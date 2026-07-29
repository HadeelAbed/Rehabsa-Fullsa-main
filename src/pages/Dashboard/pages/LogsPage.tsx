import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft, ChevronRight, Download, Filter, ArrowUpDown
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink,
  PaginationNext, PaginationPrevious, PaginationEllipsis,
} from "@/components/ui/pagination";

interface AuditEntry {
  id: number;
  managerName: string;
  createdAt: string;
  customerName: string;
  event: string;
  cashbackStamps: number;
}

const PAGE_SIZE = 50;

export function LogsPage() {
  const { t, i18n } = useTranslation();
  const { isRTL } = useDirection();
  const isArabic = i18n.language === "ar";
  const [page, setPage] = useState(1);

  const allLogs: AuditEntry[] = useMemo(() => {
    try {
      const raw = localStorage.getItem("audit_logs");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, []);

  const totalPages = Math.max(1, Math.ceil(allLogs.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const pageLogs = allLogs.slice(start, start + PAGE_SIZE);

  const getPageNumbers = (): (number | "...")[] => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePage > 3) pages.push("...");
      const startP = Math.max(2, safePage - 1);
      const endP = Math.min(totalPages - 1, safePage + 1);
      for (let i = startP; i <= endP; i++) pages.push(i);
      if (safePage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const handleExport = () => {
    const header = isArabic
      ? "اسم المدير,تاريخ الإنشاء,اسم العميل,الحدث,استرداد النقود/الأختام"
      : "Manager Name,Creation Date,Customer Name,Event,Cashback/Stamps";
    const rows = allLogs.map(l =>
      `"${l.managerName}","${l.createdAt}","${l.customerName}","${l.event}","${l.cashbackStamps}"`
    ).join("\n");
    const csv = `${header}\n${rows}`;
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit_logs_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="px-4 md:px-6 py-6 bg-[#f2f3f8] min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-xl font-bold text-gray-800 text-start">
          {t("dashboardPages.logs.title")}
        </h1>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="bg-white border border-[#d4d9ef] rounded-xl text-xs h-9 px-4 gap-1.5"
          >
            <Download className="h-4 w-4" />
            {isArabic ? "تصدير السجلات" : "Export Logs"}
          </Button>
          <span className="text-xs text-gray-500 whitespace-nowrap">
            {t("dashboardPages.logs.shownFrom", { shown: Math.min(start + PAGE_SIZE, allLogs.length), total: allLogs.length })}
          </span>
        </div>
      </div>

      <Card className="border border-[#d4d9ef] rounded-2xl bg-white shadow-[0_4px_24px_rgba(124,136,196,.12)]">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                <TableHead className="text-xs text-gray-500 font-medium py-4 px-4 text-start">
                  <div className="flex items-center gap-1.5">
                    {t("dashboardPages.logs.managerName")}
                  </div>
                </TableHead>
                <TableHead className="text-xs text-gray-500 font-medium py-4 px-4 text-start">
                  <div className="flex items-center gap-1.5">
                    {t("dashboardPages.logs.creationDate")}
                    <Filter className="h-3 w-3 text-gray-400" />
                  </div>
                </TableHead>
                <TableHead className="text-xs text-gray-500 font-medium py-4 px-4 text-start">
                  <div className="flex items-center gap-1.5">
                    {t("dashboardPages.logs.customerName")}
                    <ArrowUpDown className="h-3 w-3 text-gray-400" />
                  </div>
                </TableHead>
                <TableHead className="text-xs text-gray-500 font-medium py-4 px-4 text-start">
                  {t("dashboardPages.logs.event")}
                </TableHead>
                <TableHead className="text-xs text-gray-500 font-medium py-4 px-4 text-center">
                  {t("dashboardPages.logs.cashbackStamps")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-400 text-xs py-14">
                    {isArabic ? "لا توجد سجلات" : "No logs yet"}
                  </TableCell>
                </TableRow>
              ) : pageLogs.map((log) => (
                <TableRow key={log.id} className="border-b border-[#e5e7eb]/30 last:border-0 hover:bg-gray-50">
                  <TableCell className="text-xs py-4 px-4 font-medium text-gray-800 whitespace-nowrap">
                    {log.managerName}
                  </TableCell>
                  <TableCell className="text-xs py-4 px-4 text-gray-600 whitespace-nowrap font-arabic" dir="ltr">
                    {log.createdAt}
                  </TableCell>
                  <TableCell className="text-xs py-4 px-4 text-gray-800 whitespace-nowrap">
                    {log.customerName}
                  </TableCell>
                  <TableCell className="text-xs py-4 px-4 text-gray-700">
                    {log.event}
                  </TableCell>
                  <TableCell className="text-xs py-4 px-4 text-center font-medium text-gray-800">
                    {log.cashbackStamps}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {t("dashboardPages.logs.perPage", { count: PAGE_SIZE })}
          </span>
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => { e.preventDefault(); if (safePage > 1) setPage(safePage - 1); }}
                className={safePage <= 1 ? "pointer-events-none opacity-40" : ""}
              />
            </PaginationItem>
            {getPageNumbers().map((p, i) =>
              p === "..." ? (
                <PaginationItem key={`e${i}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={p}>
                  <PaginationLink
                    href="#"
                    isActive={p === safePage}
                    onClick={(e) => { e.preventDefault(); setPage(p as number); }}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => { e.preventDefault(); if (safePage < totalPages) setPage(safePage + 1); }}
                className={safePage >= totalPages ? "pointer-events-none opacity-40" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
