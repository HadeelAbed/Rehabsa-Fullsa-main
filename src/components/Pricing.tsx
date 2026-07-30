import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullseye, faRocket, faStar } from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useDirection } from "@/hooks/useDirection";

type Plan = {
  id: string;
  name: string;
  icon: IconDefinition;
  price: string;
  period?: string;
  featured?: boolean;
  features: string[];
  extras?: {
    title: string;
    items: string[];
  };
};

const getPlans = (t: any): Plan[] => [
  {
    id: "basic",
    name: t("pricing.basic.name"),
    icon: faBullseye,
    price: "1000",
    period: t("pricing.basic.period"),
    features: [
      t("pricing.basic.features.cardTypes"),
      t("pricing.basic.features.managers"),
      t("pricing.basic.features.branches"),
      t("pricing.basic.features.unlimitedCards"),
      t("pricing.basic.features.unlimitedNotifications"),
      t("pricing.basic.features.welcomeFeature"),
      t("pricing.basic.features.support"),
    ],
  },
  {
    id: "advanced",
    name: t("pricing.advanced.name"),
    icon: faRocket,
    price: "2000",
    period: t("pricing.advanced.period"),
    featured: true,
    features: [
      t("pricing.advanced.features.cardTypes"),
      t("pricing.advanced.features.managers"),
      t("pricing.advanced.features.branches"),
      t("pricing.advanced.features.unlimitedCards"),
      t("pricing.advanced.features.unlimitedNotifications"),
      t("pricing.advanced.features.welcomeFeature"),
      t("pricing.advanced.features.support"),
    ],
    extras: {
      title: t("pricing.advanced.extras.title"),
      items: [
        t("pricing.advanced.extras.items.prioritySupport"),
        t("pricing.advanced.extras.items.dedicatedSuccess"),
      ],
    },
  },
  {
    id: "premium",
    name: t("pricing.premium.name"),
    icon: faStar,
    price: t("pricing.premium.price"),
    period: "",
    features: [
      t("pricing.premium.features.cardTypes"),
      t("pricing.premium.features.managers"),
      t("pricing.premium.features.branches"),
      t("pricing.premium.features.unlimitedCards"),
      t("pricing.premium.features.unlimitedNotifications"),
      t("pricing.premium.features.welcomeFeature"),
      t("pricing.premium.features.support"),
    ],
  },
];

export const Pricing = () => {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const plans = getPlans(t);

  return (
    <section id="pricing" className="lp-section bg-[#f2f3f8]">
      <div className="container mx-auto max-w-[1120px] px-6">
        <div className="text-center mb-16">
          <span className="lp-tag">{t("pricing.badge") || 'Pricing'}</span>
          <h2 className="lp-title">{t("pricing.title")}</h2>
          <p className="lp-sub">{t("pricing.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`lp-plan ${plan.featured ? 'pop' : ''}`}
            >
              {plan.featured && (
                <div className="lp-pop-badge">{t("pricing.mostPopular")}</div>
              )}

              <div className="tier">{plan.name}</div>
              <div className="price">
                <span className="cur">SAR </span>{plan.price}
              </div>
              {plan.period && <div className="period">/{plan.period}</div>}

              <hr />
              <ul>
                {plan.features.map((feature, idx) => (
                  <li key={idx}>
                    <span className="lp-ck">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              {plan.extras && (
                <div className="mb-6 rounded-xl border border-[#7c88c4]/20 bg-[#7c88c4]/5 p-4 text-sm">
                  <h4 className="font-semibold mb-3" style={{ color: '#7c88c4' }}>{plan.extras.title}</h4>
                  <ul className="space-y-2">
                    {plan.extras.items.map((item, extrasIdx) => (
                      <li key={extrasIdx} className="flex items-start gap-2 text-sm" style={{ color: '#3d4257' }}>
                        <span className="lp-ck shrink-0 mt-0.5">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {plan.price === t("pricing.premium.price") ? (
                <button className="lp-btn lp-btn-primary w-full justify-center mt-auto">
                  <Link to="/contact" className="text-white no-underline">{t("pricing.contactUs")}</Link>
                </button>
              ) : (
                <button className={`lp-btn w-full justify-center mt-auto ${plan.featured ? 'lp-btn-primary' : 'lp-btn-outline'}`}>
                  <Link to={`/subscribe/${plan.id}`} className={`no-underline ${plan.featured ? 'text-white' : ''}`}>
                    {t("pricing.getStarted")}
                  </Link>
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};