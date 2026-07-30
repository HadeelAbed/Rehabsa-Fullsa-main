import { Smartphone, Watch, QrCode, Zap, Users, Bell } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { getSiteContent } from "@/lib/siteContentStorage";
import { useMemo } from "react";

const iconMap: Record<string, any> = {
  mobileCompatible: Smartphone,
  realTimeUpdates: Watch,
  easySetup: Zap,
  varietyCards: QrCode,
  analytics: Users,
  notifications: Bell,
};

const visualBgColors = [
  "from-[#e6f7f5] to-[#d1f0ec]",
  "from-[#edf5ee] to-[#d5edda]",
  "from-[#fdf3ea] to-[#f5e6d8]",
  "from-[#e8eefb] to-[#d0ddf5]",
  "from-[#f5edf8] to-[#e8d5f0]",
  "from-[#fef3e2] to-[#fae4c8]",
];

const getFeatures = (t: any, featuresContent: any) => {
  return featuresContent.items.map((item: any) => ({
    icon: iconMap[item.key] || Smartphone,
    title: item.title,
    description: item.description,
    key: item.key,
  }));
};

export const Features = () => {
  const { t } = useTranslation();
  const { language } = useDirection();
  
  const featuresContent = useMemo(() => {
    try {
      const content = getSiteContent(language as 'ar' | 'en');
      return content.features;
    } catch {
      return {
        title: t('features.title'),
        items: [
          { key: 'mobileCompatible', title: t('features.mobileCompatible.title'), description: t('features.mobileCompatible.description') },
          { key: 'realTimeUpdates', title: t('features.realTimeUpdates.title'), description: t('features.realTimeUpdates.description') },
          { key: 'easySetup', title: t('features.easySetup.title'), description: t('features.easySetup.description') },
          { key: 'varietyCards', title: t('features.varietyCards.title'), description: t('features.varietyCards.description') },
          { key: 'analytics', title: t('features.analytics.title'), description: t('features.analytics.description') },
          { key: 'notifications', title: t('features.notifications.title'), description: t('features.notifications.description') },
        ]
      };
    }
  }, [language, t]);
  
  const features = getFeatures(t, featuresContent);
  
  return (
    <section id="features" className="lp-section bg-[#f2f3f8]">
      <div className="container mx-auto max-w-[1120px] px-6">
        <div className="text-center mb-16">
          <span className="lp-tag">{t('features.badge') || 'Features'}</span>
          <h2 className="lp-title">{featuresContent.title}</h2>
          <p className="lp-sub">{t('features.subtitle') || ''}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="lp-card"
            >
              <div className={`lp-card-visual bg-gradient-to-br ${visualBgColors[index % visualBgColors.length]}`}>
                <feature.icon className="w-16 h-16 text-primary opacity-80" />
              </div>
              <div className="lp-card-body">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
