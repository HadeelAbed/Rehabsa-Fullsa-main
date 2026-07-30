import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { getSiteContent } from "@/lib/siteContentStorage";
import { useMemo } from "react";

export const HowItWorks = () => {
  const { t } = useTranslation();
  const { language } = useDirection();
  
  const howItWorksContent = useMemo(() => {
    try {
      const content = getSiteContent(language as 'ar' | 'en');
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
  }, [language, t]);
  
  const steps = howItWorksContent.steps;
  
  return (
    <section id="how-it-works" className="lp-section bg-[#f2f3f8]">
      <div className="container mx-auto max-w-[1120px] px-6">
        <div className="text-center mb-16">
          <span className="lp-tag">{howItWorksContent.subtitle}</span>
          <h2 className="lp-title">{howItWorksContent.title}</h2>
          <p className="lp-sub">{t('howItWorks.description') || ''}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[22px]">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="lp-step"
            >
              <div className="lp-step-n">{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};