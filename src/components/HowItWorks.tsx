import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { getSiteContent } from "@/lib/siteContentStorage";
import { useMemo, useState } from "react";

export const HowItWorks = () => {
  const { t } = useTranslation();
  const { direction } = useDirection();
  const [activeTab, setActiveTab] = useState<"customer" | "business">("customer");

  const howItWorksContent = useMemo(() => {
    try {
      const content = getSiteContent(direction === 'rtl' ? 'ar' : 'en');
      return content.howItWorks;
    } catch {
      return {
        subtitle: t('howItWorks.subtitle'),
        title: t('howItWorks.title'),
        steps: [
          { number: "01", title: t('howItWorks.step1Title'), description: t('howItWorks.step1Description') },
          { number: "02", title: t('howItWorks.step2Title'), description: t('howItWorks.step2Description') },
          { number: "03", title: t('howItWorks.step3Title'), description: t('howItWorks.step3Description') },
        ],
        imageAlt: t('howItWorks.imageAlt'),
      };
    }
  }, [direction, t]);

  const customerSteps = [
    { number: "١", title: t('howItWorks.customerStep1Title') || 'يمسح العميل رمز QR', description: t('howItWorks.customerStep1Desc') || 'يفتح العميل كاميرا هاتفه ويمسح رمز QR الموجود في المتجر أو على الفاتورة.' },
    { number: "٢", title: t('howItWorks.customerStep2Title') || 'يدخل اسمه ورقمه', description: t('howItWorks.customerStep2Desc') || 'يُدخل العميل اسمه ورقم جواله فقط — لا يحتاج لتحميل تطبيق أو إنشاء حساب.' },
    { number: "٣", title: t('howItWorks.customerStep3Title') || 'يحفظ البطاقة في هاتفه', description: t('howItWorks.customerStep3Desc') || 'تُضاف بطاقة الولاء مباشرةً إلى Apple Wallet أو Google Wallet وتصله الإشعارات تلقائياً.' },
  ];

  const businessSteps = [
    { number: "١", title: t('howItWorks.businessStep1Title') || 'يشتري العميل ويعرض البطاقة', description: t('howItWorks.businessStep1Desc') || 'بعد إتمام الشراء يفتح العميل بطاقته من المحفظة ويعرض رمز QR للكاشير.' },
    { number: "٢", title: t('howItWorks.businessStep2Title') || 'يمسح الكاشير البطاقة', description: t('howItWorks.businessStep2Desc') || 'يفتح الموظف تطبيق الكاشير ويمسح رمز QR الخاص بالعميل لإضافة نقطة في ثوانٍ.' },
    { number: "٣", title: t('howItWorks.businessStep3Title') || 'يستلم العميل مكافأته', description: t('howItWorks.businessStep3Desc') || 'عند اكتمال النقاط يُشعَر العميل تلقائياً ويستلم هديته في زيارته القادمة.' },
  ];

  const steps = activeTab === "customer" ? customerSteps : businessSteps;

  return (
    <section id="how-it-works" className="lp-section bg-[#f2f3f8]">
      <div className="container mx-auto max-w-[1120px] px-6">
        <div className="text-center mb-12">
          <span className="lp-tag">{howItWorksContent.subtitle}</span>
          <h2 className="lp-title">{howItWorksContent.title}</h2>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-white rounded-full p-1 border border-border shadow-sm">
            <button
              onClick={() => setActiveTab("customer")}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                activeTab === "customer"
                  ? "bg-primary text-white shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              👤 {t('howItWorks.customerTab') || 'كيف يسجّل العميل'}
            </button>
            <button
              onClick={() => setActiveTab("business")}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                activeTab === "business"
                  ? "bg-primary text-white shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              ⭐ {t('howItWorks.businessTab') || 'كيف تضيف النقاط'}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Phone image */}
          <motion.div
            key={`img-${activeTab}`}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex justify-center"
          >
            <div className="relative">
              <img
                src="https://loyapro.com/assets/guest/images/iphone-frame.webp"
                alt=""
                className="w-64 h-auto"
              />
            </div>
          </motion.div>

          {/* Steps */}
          <motion.div
            key={`steps-${activeTab}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {steps.map((step, index) => (
              <div key={index} className="flex gap-5 items-start">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-black flex-shrink-0 shadow-md">
                  {step.number}
                </div>
                <div className="pt-1">
                  <h3 className="text-lg font-bold mb-1.5">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-12">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ background: 'hsl(215, 20%, 85%)' }}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
};