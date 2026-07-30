import React from "react";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { AdminStatsCard } from "../components/StatsCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Users,
  CreditCard,
  Check,
  X,
  Save,
  MoreHorizontal,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const plans = [
  {
    id: "plan-1",
    name: "الأساسية",
    description: "خطة مناسبة للشركات الصغيرة والمتاجر الناشئة",
    monthlyPrice: 199,
    yearlyPrice: 1990, // 10% discount
    currency: "SAR",
    features: [
      "1 نوع بطاقة",
      "1 مدير",
      "1 فرع",
      "بطاقات غير محدودة",
      "إشعارات غير محدودة",
      "دعم فني"
    ],
    limitations: {
      cardTypes: 1,
      managers: 1,
      branches: 1,
      maxCustomers: 1000
    },
    isActive: true,
    subscribers: 45,
    revenue: "SAR 8,955"
  },
  {
    id: "plan-2",
    name: "المتقدمة",
    description: "خطة شاملة للشركات المتوسطة",
    monthlyPrice: 299,
    yearlyPrice: 2990, // 10% discount
    currency: "SAR",
    features: [
      "3 أنواع بطاقات",
      "3 مدراء",
      "2-3 فروع",
      "بطاقات غير محدودة",
      "إشعارات غير محدودة",
      "دعم فني متقدم",
      "تقارير مفصلة"
    ],
    limitations: {
      cardTypes: 3,
      managers: 3,
      branches: 3,
      maxCustomers: 5000
    },
    isActive: true,
    subscribers: 35,
    revenue: "SAR 10,465"
  },
  {
    id: "plan-3",
    name: "المميزة",
    description: "خطة متقدمة للشركات الكبيرة",
    monthlyPrice: 499,
    yearlyPrice: 4990, // 10% discount
    currency: "SAR",
    features: [
      "10 أنواع بطاقات",
      "50 مدير",
      "فروع غير محدودة",
      "بطاقات غير محدودة",
      "إشعارات غير محدودة",
      "دعم فني مخصص",
      "تقارير متقدمة",
      "API مخصص"
    ],
    limitations: {
      cardTypes: 10,
      managers: 50,
      branches: -1, // unlimited
      maxCustomers: -1 // unlimited
    },
    isActive: true,
    subscribers: 20,
    revenue: "SAR 9,980"
  },
  {
    id: "plan-4",
    name: "تجريبي",
    description: "خطة تجريبية مجانية لمدة شهر",
    monthlyPrice: 0,
    yearlyPrice: 0,
    currency: "SAR",
    features: [
      "1 نوع بطاقة",
      "1 مدير",
      "1 فرع",
      "بطاقات محدودة (100)",
      "إشعارات محدودة",
      "دعم أساسي"
    ],
    limitations: {
      cardTypes: 1,
      managers: 1,
      branches: 1,
      maxCustomers: 100
    },
    isActive: true,
    subscribers: 15,
    revenue: "SAR 0"
  }
];

export function PlansPage() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const [editingPlan, setEditingPlan] = React.useState<string | null>(null);
  const [editedPlan, setEditedPlan] = React.useState<any>(null);
  const [showAddFeature, setShowAddFeature] = React.useState<string | null>(null);
  const [newFeature, setNewFeature] = React.useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [newPlan, setNewPlan] = React.useState({
    name: "",
    description: "",
    monthlyPrice: 0,
    yearlyPrice: 0,
    currency: "SAR",
    features: [] as string[],
    limitations: {
      cardTypes: 1,
      managers: 1,
      branches: 1,
      maxCustomers: 1000
    },
    isActive: true
  });
  const [newFeatureInput, setNewFeatureInput] = React.useState("");

  const handleEditPlan = (plan: any) => {
    setEditingPlan(plan.id);
    setEditedPlan({ ...plan });
  };

  const handleSavePlan = () => {
    toast.success(t("admin.plans.updateSuccess"));
    setEditingPlan(null);
    setEditedPlan(null);
  };

  const handleCancelEdit = () => {
    setEditingPlan(null);
    setEditedPlan(null);
  };

  const handleDeletePlan = (_planId: string) => {
    toast.success(t("admin.plans.deleteSuccess"));
  };

  const handleCreatePlan = () => {
    setIsCreateModalOpen(true);
  };

  const handleSaveNewPlan = () => {
    if (!newPlan.name.trim()) {
      toast.error(t("admin.plans.nameRequired"));
      return;
    }
    if (!newPlan.description.trim()) {
      toast.error(t("admin.plans.descriptionRequired"));
      return;
    }
    if (newPlan.monthlyPrice <= 0) {
      toast.error(t("admin.plans.monthlyPriceRequired"));
      return;
    }
    if (newPlan.yearlyPrice <= 0) {
      toast.error(t("admin.plans.yearlyPriceRequired"));
      return;
    }
    if (newPlan.features.length === 0) {
      toast.error(t("admin.plans.featuresRequired"));
      return;
    }

    // هنا يمكن إضافة منطق حفظ الخطة الجديدة
    toast.success(t("admin.plans.createSuccess"));
    setIsCreateModalOpen(false);
    resetNewPlanForm();
  };

  const resetNewPlanForm = () => {
    setNewPlan({
      name: "",
      description: "",
      monthlyPrice: 0,
      yearlyPrice: 0,
      currency: "SAR",
      features: [],
      limitations: {
        cardTypes: 1,
        managers: 1,
        branches: 1,
        maxCustomers: 1000
      },
      isActive: true
    });
    setNewFeatureInput("");
  };

  const handleAddFeatureToNewPlan = () => {
    if (newFeatureInput.trim()) {
      setNewPlan(prev => ({
        ...prev,
        features: [...prev.features, newFeatureInput.trim()]
      }));
      setNewFeatureInput("");
    }
  };

  const handleRemoveFeatureFromNewPlan = (index: number) => {
    setNewPlan(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleAddFeature = (_planId: string) => {
    if (newFeature.trim()) {
      setEditedPlan(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature("");
      setShowAddFeature(null);
    }
  };

  const handleRemoveFeature = (_planId: string, featureIndex: number) => {
    setEditedPlan(prev => ({
      ...prev,
      features: prev.features.filter((_: any, index: number) => index !== featureIndex)
    }));
  };

  const totalSubscribers = plans.reduce((sum, plan) => sum + plan.subscribers, 0);
  const totalRevenue = plans.reduce((sum, plan) => {
    const revenue = parseFloat(plan.revenue.replace(/[^\d.]/g, ''));
    return sum + revenue;
  }, 0);

  return (
    <div className={`flex flex-col gap-3 p-3 h-full ${isRTL ? 'font-arabic' : 'font-sans'}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row' : 'flex-row'}`}>
        <h1 className={`text-base font-semibold flex items-center gap-1.5 ${isRTL ? 'text-left' : 'text-right'}`}>
          <Shield className="h-4 w-4" />
          {t("admin.plans.title")}
        </h1>
        <div className="flex items-center gap-1.5">
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleCreatePlan} className={`h-7 text-xs px-2 ${isRTL ? 'text-left' : 'text-right'}`}>
                <span>{t("admin.plans.createPlan")}</span>
                <Plus className="h-3 w-3" />
              </Button>
            </DialogTrigger>
            <DialogContent className={`max-w-xl ${isRTL ? 'font-arabic' : 'font-sans'}`} dir={isRTL ? "rtl" : "ltr"}>
              <DialogHeader>
                <DialogTitle className={`text-sm ${isRTL ? 'text-right' : 'text-left'}`}>{t("admin.plans.createPlan")}</DialogTitle>
                <DialogDescription className={`text-[11px] ${isRTL ? 'text-right' : 'text-left'}`}>{t("admin.plans.createPlanDescription")}</DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-2 py-2">
                <div className={`grid grid-cols-4 items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Label className={`text-xs ${isRTL ? 'text-right' : 'text-left'}`}>{t("admin.plans.planName")} *</Label>
                  <Input id="planName" value={newPlan.name} onChange={(e) => setNewPlan(prev => ({ ...prev, name: e.target.value }))} className={`col-span-3 h-7 text-xs ${isRTL ? 'text-right' : 'text-left'}`} placeholder={t("admin.plans.planNamePlaceholder")} />
                </div>
                <div className={`grid grid-cols-4 items-start gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Label className={`text-xs ${isRTL ? 'text-right' : 'text-left'}`}>{t("admin.plans.description")} *</Label>
                  <Textarea id="description" value={newPlan.description} onChange={(e) => setNewPlan(prev => ({ ...prev, description: e.target.value }))} className={`col-span-3 text-xs ${isRTL ? 'text-right' : 'text-left'}`} placeholder={t("admin.plans.descriptionPlaceholder")} rows={2} />
                </div>
                <div className={`grid grid-cols-2 gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`grid grid-cols-4 items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Label className={`text-xs ${isRTL ? 'text-right' : 'text-left'}`}>{t("admin.plans.monthlyPrice")} *</Label>
                    <div className={`col-span-3 flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Input id="monthlyPrice" type="number" value={newPlan.monthlyPrice} onChange={(e) => setNewPlan(prev => ({ ...prev, monthlyPrice: parseInt(e.target.value) || 0 }))} className="h-7 text-xs" min="0" />
                      <span className="text-[11px] text-gray-600">{newPlan.currency}</span>
                    </div>
                  </div>
                  <div className={`grid grid-cols-4 items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Label className={`text-xs ${isRTL ? 'text-right' : 'text-left'}`}>{t("admin.plans.yearlyPrice")} *</Label>
                    <div className={`col-span-3 flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Input id="yearlyPrice" type="number" value={newPlan.yearlyPrice} onChange={(e) => setNewPlan(prev => ({ ...prev, yearlyPrice: parseInt(e.target.value) || 0 }))} className="h-7 text-xs" min="0" />
                      <span className="text-[11px] text-gray-600">{newPlan.currency}</span>
                    </div>
                  </div>
                </div>
                <div className={`grid grid-cols-4 items-start gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Label className={`text-xs ${isRTL ? 'text-right' : 'text-left'}`}>{t("admin.plans.features")} *</Label>
                  <div className="col-span-3 space-y-1">
                    <div className={`flex gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Input value={newFeatureInput} onChange={(e) => setNewFeatureInput(e.target.value)} placeholder={t("admin.plans.addFeature")} className="h-7 text-xs" onKeyPress={(e) => e.key === 'Enter' && handleAddFeatureToNewPlan()} />
                      <Button onClick={handleAddFeatureToNewPlan} size="sm" className="h-7 w-7 p-0"><Plus className="h-3 w-3" /></Button>
                    </div>
                    <div className="space-y-0.5 max-h-24 overflow-y-auto">
                      {newPlan.features.map((feature, index) => (
                        <div key={index} className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <Check className="h-3 w-3 text-green-600 flex-shrink-0" />
                          <span className="text-xs flex-1">{feature}</span>
                          <Button size="sm" variant="ghost" onClick={() => handleRemoveFeatureFromNewPlan(index)} className="h-5 w-5 p-0 text-red-600 hover:text-red-700"><X className="h-2.5 w-2.5" /></Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className={`grid grid-cols-4 items-start gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Label className={`text-xs ${isRTL ? 'text-right' : 'text-left'}`}>{t("admin.plans.limitations")}</Label>
                  <div className={`col-span-3 grid grid-cols-2 gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`grid grid-cols-2 items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Label className={`text-[11px] ${isRTL ? 'text-right' : 'text-left'}`}>{t("admin.plans.cardTypes")}</Label>
                      <Input id="cardTypes" type="number" value={newPlan.limitations.cardTypes} onChange={(e) => setNewPlan(prev => ({ ...prev, limitations: { ...prev.limitations, cardTypes: parseInt(e.target.value) || 1 } }))} className="h-7 text-xs" min="1" />
                    </div>
                    <div className={`grid grid-cols-2 items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Label className={`text-[11px] ${isRTL ? 'text-right' : 'text-left'}`}>{t("admin.plans.managers")}</Label>
                      <Input id="managers" type="number" value={newPlan.limitations.managers} onChange={(e) => setNewPlan(prev => ({ ...prev, limitations: { ...prev.limitations, managers: parseInt(e.target.value) || 1 } }))} className="h-7 text-xs" min="1" />
                    </div>
                    <div className={`grid grid-cols-2 items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Label className={`text-[11px] ${isRTL ? 'text-right' : 'text-left'}`}>{t("admin.plans.branches")}</Label>
                      <Input id="branches" type="number" value={newPlan.limitations.branches} onChange={(e) => setNewPlan(prev => ({ ...prev, limitations: { ...prev.limitations, branches: parseInt(e.target.value) || 1 } }))} className="h-7 text-xs" min="1" />
                    </div>
                    <div className={`grid grid-cols-2 items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Label className={`text-[11px] ${isRTL ? 'text-right' : 'text-left'}`}>{t("admin.plans.maxCustomers")}</Label>
                      <Input id="maxCustomers" type="number" value={newPlan.limitations.maxCustomers} onChange={(e) => setNewPlan(prev => ({ ...prev, limitations: { ...prev.limitations, maxCustomers: parseInt(e.target.value) || 1000 } }))} className="h-7 text-xs" min="1" />
                    </div>
                  </div>
                </div>
                <div className={`grid grid-cols-4 items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Label className={`text-xs ${isRTL ? 'text-right' : 'text-left'}`}>{t("admin.plans.status")}</Label>
                  <div className={`col-span-3 flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Switch id="isActive" checked={newPlan.isActive} onCheckedChange={(checked) => setNewPlan(prev => ({ ...prev, isActive: checked }))} />
                    <Label htmlFor="isActive" className={`text-[11px] ${isRTL ? 'text-right' : 'text-left'}`}>{newPlan.isActive ? t("admin.plans.active") : t("admin.plans.inactive")}</Label>
                  </div>
                </div>
              </div>

              <DialogFooter className={`${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)} className="h-7 text-xs px-2">{t("admin.plans.cancel")}</Button>
                <Button onClick={handleSaveNewPlan} className="h-7 text-xs px-2">{t("admin.plans.createPlan")}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <AdminStatsCard
          title={t("admin.plans.totalPlans")}
          value={plans.length}
          icon={Shield}
          className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20"
          iconColor="text-blue-600"
        />
        <AdminStatsCard
          title={t("admin.plans.totalSubscribers")}
          value={totalSubscribers}
          icon={Users}
          className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20"
          iconColor="text-green-600"
        />
        <AdminStatsCard
          title={t("admin.plans.totalRevenue")}
          value={`SAR ${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20"
          iconColor="text-purple-600"
        />
        <AdminStatsCard
          title={t("admin.plans.activePlans")}
          value={plans.filter(plan => plan.isActive).length}
          icon={CreditCard}
          className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20"
          iconColor="text-orange-600"
        />
      </div>

      {/* Plans Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={`text-[10px] ${isRTL ? "text-left" : "text-right"}`}>{t("admin.plans.planName")}</TableHead>
                <TableHead className={`text-[10px] ${isRTL ? "text-left" : "text-right"}`}>{t("admin.plans.description")}</TableHead>
                <TableHead className={`text-[10px] ${isRTL ? "text-left" : "text-right"}`}>{t("admin.plans.monthlyPrice")}</TableHead>
                <TableHead className={`text-[10px] ${isRTL ? "text-left" : "text-right"}`}>{t("admin.plans.yearlyPrice")}</TableHead>
                <TableHead className={`text-[10px] ${isRTL ? "text-left" : "text-right"}`}>{t("admin.plans.features")}</TableHead>
                <TableHead className={`text-[10px] ${isRTL ? "text-left" : "text-right"}`}>{t("admin.plans.subscribers")}</TableHead>
                <TableHead className={`text-[10px] ${isRTL ? "text-left" : "text-right"}`}>{t("admin.plans.status")}</TableHead>
                <TableHead className={`text-[10px] ${isRTL ? "text-left" : "text-right"}`}>{t("admin.plans.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className={`text-xs font-medium ${isRTL ? 'text-left' : 'text-right'}`}>
                    {editingPlan === plan.id ? (
                      <Input value={editedPlan?.name || plan.name} onChange={(e) => setEditedPlan({ ...editedPlan, name: e.target.value })} className="h-7 text-xs w-full" />
                    ) : plan.name}
                  </TableCell>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>
                    {editingPlan === plan.id ? (
                      <Textarea value={editedPlan?.description || plan.description} onChange={(e) => setEditedPlan({ ...editedPlan, description: e.target.value })} className="w-full min-w-[150px] text-xs" rows={1} />
                    ) : (
                      <div className="max-w-[150px]">
                        <p className="text-[11px] text-gray-600 line-clamp-2">{plan.description}</p>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>
                    {editingPlan === plan.id ? (
                      <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Input type="number" value={editedPlan?.monthlyPrice || plan.monthlyPrice} onChange={(e) => setEditedPlan({ ...editedPlan, monthlyPrice: parseInt(e.target.value) })} className="w-16 h-7 text-xs" />
                        <span className="text-[11px]">{plan.currency}</span>
                      </div>
                    ) : (
                      <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-xs font-semibold">{plan.monthlyPrice}</span>
                        <span className="text-[11px] text-gray-600">{plan.currency}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>
                    {editingPlan === plan.id ? (
                      <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Input type="number" value={editedPlan?.yearlyPrice || plan.yearlyPrice} onChange={(e) => setEditedPlan({ ...editedPlan, yearlyPrice: parseInt(e.target.value) })} className="w-16 h-7 text-xs" />
                        <span className="text-[11px]">{plan.currency}</span>
                      </div>
                    ) : (
                      <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-xs font-semibold">{plan.yearlyPrice}</span>
                        <span className="text-[11px] text-gray-600">{plan.currency}</span>
                        <Badge variant="outline" className="text-[9px] bg-green-100 text-green-800 px-1 py-0">{t("admin.plans.yearlyDiscount")}</Badge>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>
                    <div className="max-w-[220px]">
                      {editingPlan === plan.id ? (
                        <div className="space-y-1">
                          <div className="space-y-0.5">
                            {(editedPlan?.features || plan.features).map((feature: string, index: number) => (
                              <div key={index} className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <Check className="h-3 w-3 text-green-600 flex-shrink-0" />
                                <span className="text-[10px]">{feature}</span>
                                <Button size="sm" variant="ghost" onClick={() => handleRemoveFeature(plan.id, index)} className="h-4 w-4 p-0 text-red-600 hover:text-red-700">
                                  <X className="h-2.5 w-2.5" />
                                </Button>
                              </div>
                            ))}
                          </div>
                          {showAddFeature === plan.id ? (
                            <div className={`flex gap-0.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <Input value={newFeature} onChange={(e) => setNewFeature(e.target.value)} placeholder={t("admin.plans.addFeature")} className="h-6 text-[10px]" onKeyPress={(e) => e.key === 'Enter' && handleAddFeature(plan.id)} />
                              <Button size="sm" onClick={() => handleAddFeature(plan.id)} className="h-6 w-6 p-0"><Plus className="h-3 w-3" /></Button>
                              <Button size="sm" variant="outline" onClick={() => setShowAddFeature(null)} className="h-6 w-6 p-0"><X className="h-3 w-3" /></Button>
                            </div>
                          ) : (
                            <Button size="sm" variant="outline" onClick={() => setShowAddFeature(plan.id)} className="text-[10px] h-6 px-1.5">
                              <Plus className={`h-3 w-3 ${isRTL ? 'ml-0.5' : 'mr-0.5'}`} />
                              {t("admin.plans.addFeature")}
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-0.5">
                          {plan.features.slice(0, 3).map((feature, index) => (
                            <div key={index} className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <Check className="h-3 w-3 text-green-600 flex-shrink-0" />
                              <span className="text-[10px]">{feature}</span>
                            </div>
                          ))}
                          {plan.features.length > 3 && <p className="text-[10px] text-gray-500">+{plan.features.length - 3} {t("admin.plans.moreFeatures")}</p>}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>
                    <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Users className="h-3 w-3 text-gray-500" />
                      <span className="text-xs font-medium">{plan.subscribers}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={plan.isActive ? "default" : "secondary"} className="text-[9px] px-1.5 py-0">
                      {plan.isActive ? t("admin.plans.active") : t("admin.plans.inactive")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-6 w-6 p-0"><MoreHorizontal className="h-3 w-3" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align={isRTL ? "start" : "end"} className="text-xs">
                        <DropdownMenuLabel className="text-[10px]">{t("admin.plans.actions")}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEditPlan(plan)} className="text-xs"><Edit className={`h-3 w-3 ${isRTL ? 'ml-1.5' : 'mr-1.5'}`} />{t("admin.plans.edit")}</DropdownMenuItem>
                        <DropdownMenuItem className="text-xs"><Eye className={`h-3 w-3 ${isRTL ? 'ml-1.5' : 'mr-1.5'}`} />{t("admin.plans.view")}</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {editingPlan === plan.id ? (
                          <>
                            <DropdownMenuItem onClick={handleSavePlan} className="text-xs"><Save className={`h-3 w-3 ${isRTL ? 'ml-1.5' : 'mr-1.5'}`} />{t("admin.plans.save")}</DropdownMenuItem>
                            <DropdownMenuItem onClick={handleCancelEdit} className="text-xs"><X className={`h-3 w-3 ${isRTL ? 'ml-1.5' : 'mr-1.5'}`} />{t("admin.plans.cancel")}</DropdownMenuItem>
                          </>
                        ) : (
                          <DropdownMenuItem className="text-red-600 text-xs" onClick={() => handleDeletePlan(plan.id)}>
                            <Trash2 className={`h-3 w-3 ${isRTL ? 'ml-1.5' : 'mr-1.5'}`} />{t("admin.plans.delete")}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
