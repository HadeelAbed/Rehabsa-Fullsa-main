import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { useState } from "react";

export const HowItWorks = () => {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const [activeTab, setActiveTab] = useState<"customer" | "business">("customer");

  const customerSteps = [
    { number: "١", title: t('howItWorks.customerStep1Title'), description: t('howItWorks.customerStep1Desc') },
    { number: "٢", title: t('howItWorks.customerStep2Title'), description: t('howItWorks.customerStep2Desc') },
    { number: "٣", title: t('howItWorks.customerStep3Title'), description: t('howItWorks.customerStep3Desc') },
  ];

  const businessSteps = [
    { number: "١", title: t('howItWorks.businessStep1Title'), description: t('howItWorks.businessStep1Desc') },
    { number: "٢", title: t('howItWorks.businessStep2Title'), description: t('howItWorks.businessStep2Desc') },
    { number: "٣", title: t('howItWorks.businessStep3Title'), description: t('howItWorks.businessStep3Desc') },
  ];

  const steps = activeTab === "customer" ? customerSteps : businessSteps;

  return (
    <section id="how-it-works" className="lp-section bg-[#f2f3f8]">
      <div className="container mx-auto max-w-[1120px] px-6">
        <div className="text-center mb-12">
          <span className="lp-tag">{t('howItWorks.subtitle')}</span>
          <h2 className="lp-title">{t('howItWorks.title')}</h2>
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
              👤 {t('howItWorks.customerTab')}
            </button>
            <button
              onClick={() => setActiveTab("business")}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                activeTab === "business"
                  ? "bg-primary text-white shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              ⭐ {t('howItWorks.businessTab')}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Phone image */}
          <motion.div
            key={`img-${activeTab}`}
            initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
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
            initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {steps.map((step, index) => (
              <div key={index} className={`flex gap-5 ${isRTL ? 'flex-row' : 'flex-row'}`}>
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