import { useTranslation } from "react-i18next";

const logos = [
  "https://loyapro.com/assets/guest/images/logo-1.svg",
  "https://loyapro.com/assets/guest/images/logo-2.svg",
  "https://loyapro.com/assets/guest/images/logo-3.svg",
  "https://loyapro.com/assets/guest/images/logo-4.svg",
  "https://loyapro.com/assets/guest/images/logo-5.svg",
  "https://loyapro.com/assets/guest/images/logo-6.svg",
  "https://loyapro.com/assets/guest/images/logo-7.svg",
  "https://loyapro.com/assets/guest/images/logo-8.svg",
];

export const TrustStrip = () => {
  const { t } = useTranslation();

  return (
    <section className="py-8 bg-white border-b border-border">
      <div className="container mx-auto max-w-[1120px] px-6">
        <p className="text-center text-sm font-bold text-muted-foreground mb-5 tracking-wide">
          {t('trustStrip.title') || 'آلاف العلامات التجارية تثق في رؤى'}
        </p>
        <div className="flex items-center justify-center gap-0 flex-nowrap overflow-x-auto scrollbar-none pb-1">
          {logos.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className="h-[70px] w-20 flex-shrink-0 object-contain opacity-85 hover:opacity-100 transition-opacity"
            />
          ))}
        </div>
      </div>
    </section>
  );
};