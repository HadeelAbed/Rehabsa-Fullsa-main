import { useTranslation } from "react-i18next";

const brands = [
  { name: 'Starbucks', color: '#00704a', textColor: '#fff' },
  { name: 'McDonald\'s', color: '#da291c', textColor: '#fff' },
  { name: 'Nike', color: '#111', textColor: '#fff' },
  { name: 'Adidas', color: '#000', textColor: '#fff' },
  { name: 'Amazon', color: '#ff9900', textColor: '#000' },
  { name: 'Google', color: '#4285f4', textColor: '#fff' },
  { name: 'Zara', color: '#0f0f0f', textColor: '#fff' },
  { name: 'Uber', color: '#000', textColor: '#fff' },
];

export const TrustStrip = () => {
  const { t } = useTranslation();

  return (
    <section className="py-8 bg-white border-b border-border">
      <div className="container mx-auto max-w-[1120px] px-6">
        <p className="text-center text-sm font-bold text-muted-foreground mb-5 tracking-wide">
          {t('trustStrip.title') || 'آلاف العلامات التجارية تثق في رؤى'}
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {brands.map((brand, i) => (
            <div
              key={i}
              className="flex-shrink-0 flex items-center justify-center rounded-xl font-extrabold select-none shadow-sm"
              style={{
                height: 44,
                padding: '0 22px',
                background: brand.color,
                color: brand.textColor,
                fontSize: 15,
                letterSpacing: '0.3px',
                opacity: 0.8,
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              {brand.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};