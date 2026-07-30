import { useTranslation } from "react-i18next";

const contacts = [
  { key: 'whatsapp', icon: '💬' },
  { key: 'email', icon: '📧' },
  { key: 'phone', icon: '📞' },
  { key: 'address', icon: '📍' },
];

export const ContactSection = () => {
  const { t } = useTranslation();

  return (
    <section id="contact" className="lp-section bg-[#f2f3f8]">
      <div className="container mx-auto max-w-[1120px] px-6">
        <div className="text-center mb-16">
          <span className="lp-tag">{t('contact.badge') || 'اتصل بنا'}</span>
          <h2 className="lp-title">{t('contact.title') || 'تواصل معنا'}</h2>
          <p className="lp-sub">{t('contact.subtitle') || 'نحن هنا لمساعدتك في أي وقت'}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contacts.map((c, i) => (
            <div key={i} className="bg-white border border-border rounded-[18px] p-7 text-center transition-all hover:border-primary hover:-translate-y-1 hover:shadow-[0_4px_24px_rgba(0,206,194,.18)]">
              <div className="text-3xl mb-2.5">{c.icon}</div>
              <h4 className="text-sm font-bold mb-1.5 text-muted-foreground">
                {t(`contact.${c.key}Title`) || ''}
              </h4>
              {c.key === 'whatsapp' ? (
                <a href="https://wa.me/249111638872" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-secondary hover:underline no-underline">
                  {t('contact.whatsapp') || '+249 111 638 872'}
                </a>
              ) : (
                <p className="text-sm font-semibold text-secondary">
                  {t(`contact.${c.key}`) || ''}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};