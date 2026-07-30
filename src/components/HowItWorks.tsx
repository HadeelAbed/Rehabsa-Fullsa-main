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
          {/* Phone mockup */}
          <motion.div
            key={`img-${activeTab}`}
            initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex justify-center"
          >
            <div className="relative" style={{ width: 220 }}>
              {/* Phone frame */}
              <div className="bg-[#111] rounded-[32px] p-[10px_8px_14px] shadow-[0_24px_64px_rgba(0,0,0,.35)] mx-auto" style={{ width: 200 }}>
                {/* Notch */}
                <div className="w-[50px] h-[5px] bg-[#333] rounded mx-auto mb-3"></div>
                {/* Card screen */}
                <div className="rounded-[14px] overflow-hidden" style={{
                  background: activeTab === 'customer'
                    ? 'linear-gradient(135deg, #0f2540, #1a3a5c)'
                    : 'linear-gradient(135deg, #2d1a3a, #4a2a5c)',
                  minHeight: 260
                }}>
                  {/* Status bar */}
                  <div className="flex items-center justify-between px-3 pt-3 pb-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center text-[7px] text-white font-black">R</div>
                      <span className="text-[7px] text-white/70 font-bold">{t('howItWorks.appName') || 'رحاب'}</span>
                    </div>
                    <div className="text-white/50 text-[6px]">9:41</div>
                  </div>

                  {/* Step content */}
                  <div className="px-3 pt-2 pb-3">
                    {/* Big step number */}
                    <div className="text-center mb-2">
                      <span className="text-[30px] font-black text-white/15">{steps[0].number}</span>
                    </div>
                    {/* QR code visual */}
                    <div className="flex justify-center mb-3">
                      <div className="w-14 h-14 bg-white rounded-[6px] p-1.5 shadow-lg">
                        <svg viewBox="0 0 24 24" width="100%" height="100%">
                          <rect x="2" y="2" width="8" height="8" fill="#111" rx="1"/>
                          <rect x="14" y="2" width="8" height="8" fill="#333" rx="1"/>
                          <rect x="2" y="14" width="8" height="8" fill="#333" rx="1"/>
                          <rect x="14" y="14" width="3" height="3" fill="#111"/>
                          <rect x="18" y="18" width="3" height="3" fill="#111"/>
                          <rect x="14" y="18" width="3" height="3" fill="#111"/>
                        </svg>
                      </div>
                    </div>
                    {/* Step title/desc on phone */}
                    <div className="bg-white/10 rounded-[8px] p-2 mb-1">
                      <div className="text-[8px] font-bold text-white mb-0.5">{steps[0].title}</div>
                      <div className="text-[6px] text-white/60 leading-relaxed">{steps[0].description}</div>
                    </div>
                    {/* Dots */}
                    <div className="flex justify-center gap-1 mt-2">
                      {[0,1,2].map(i => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: i === 0 ? '#00CEC2' : 'rgba(255,255,255,.2)' }}></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* Label */}
              <div className="text-center mt-3">
                <span className="text-[11px] font-semibold text-muted-foreground">{t('howItWorks.phoneLabel') || 'واجهة العميل'}</span>
              </div>
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
              <div key={index} className="flex gap-5">
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
      </div>
    </section>
  );
};