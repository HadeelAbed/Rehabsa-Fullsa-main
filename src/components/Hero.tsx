import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { getSiteContent } from "@/lib/siteContentStorage";
import { useMemo, useState, useEffect } from "react";

const cardImages = [
  "https://loyapro.com/assets/guest/images/card-mockup-1.png",
  "https://loyapro.com/assets/guest/images/card-mockup-2.png",
  "https://loyapro.com/assets/guest/images/card-mockup-3.png",
];

export const Hero = () => {
  const { t, i18n } = useTranslation();
  const { language } = useDirection();
  const [cardIndex, setCardIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCardIndex((prev) => (prev + 1) % cardImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const heroContent = useMemo(() => {
    try {
      const content = getSiteContent(language as 'ar' | 'en');
      return content.hero;
    } catch {
      return {
        title: t('hero.title'),
        subtitle: t('hero.subtitle'),
        cta: t('hero.cta'),
        requestDemo: t('hero.requestDemo'),
      };
    }
  }, [language, t]);

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
      {/* Floating orbs */}
      <div className="orb orb1"></div>
      <div className="orb orb2"></div>
      <div className="orb orb3"></div>
      <div className="orb orb4"></div>

      {/* Gradient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse 70% 80% at 15% 50%, rgba(0,206,194,.15) 0%, transparent 60%),
          radial-gradient(ellipse 50% 60% at 85% 20%, rgba(68,117,150,.12) 0%, transparent 55%),
          radial-gradient(ellipse 40% 40% at 60% 90%, rgba(0,206,194,.08) 0%, transparent 55%)
        `
      }}></div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Left: Visual */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <div className="relative" style={{ width: 280, height: 420 }}>
              {cardImages.map((img, idx) => (
                <div
                  key={idx}
                  className="absolute inset-0 flex items-center justify-center transition-all duration-500"
                  style={{
                    opacity: cardIndex === idx ? 1 : 0,
                    transform: cardIndex === idx ? 'none' : 'translateY(14px) scale(.96)',
                    pointerEvents: cardIndex === idx ? 'auto' : 'none',
                  }}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-[230px] h-auto rounded-[22px] shadow-[0_24px_64px_rgba(0,0,0,.4),0_4px_16px_rgba(0,0,0,.2)]"
                  />
                </div>
              ))}
            </div>
            {/* Dots */}
            <div className="flex gap-[7px] mt-5">
              {cardImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCardIndex(idx)}
                  className="w-[7px] h-[7px] rounded-full transition-all border-none p-0"
                  style={{
                    background: cardIndex === idx ? 'white' : 'rgba(255,255,255,.25)',
                    transform: cardIndex === idx ? 'scale(1.35)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
            {/* Platform badges */}
            <div className="flex items-center justify-center gap-2.5 mt-4 flex-wrap">
              <span className="text-xs font-semibold text-muted-foreground">منصة الولاء الرقمي</span>
              <div className="flex gap-2">
                <span className="bg-white border border-border rounded-lg px-3 py-1 text-[11px] font-extrabold shadow-sm text-muted-foreground">SAAS</span>
                <span className="bg-white border border-border rounded-lg px-3 py-1 text-[11px] font-extrabold shadow-sm text-muted-foreground">AI</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Text */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 px-4 py-1.5 rounded-full text-sm font-bold mb-5 text-secondary">
              <span className="w-[7px] h-[7px] rounded-full bg-secondary" style={{ animation: 'blink 2s infinite' }}></span>
              {heroContent.requestDemo}
            </div>
            <h1 className="text-[clamp(26px,3.6vw,46px)] font-black leading-[1.15] mb-4">
              {heroContent.title}
            </h1>
            <p className="text-[17px] leading-relaxed mb-8 max-w-[460px] text-muted-foreground">
              {heroContent.subtitle}
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              <button className="lp-btn lp-btn-primary text-base">
                {heroContent.cta}
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button className="lp-btn lp-btn-outline text-base">
                {t('hero.learnMore') || 'اعرف المزيد'}
              </button>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {['بدون تطبيق', 'نقاط ولاء', 'تقارير ذكية'].map((pill, i) => (
                <span key={i} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <svg className="w-4 h-4 flex-shrink-0 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  {pill}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        .orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          animation: float 6s ease-in-out infinite;
        }
        .orb1 {
          width: 90px; height: 90px;
          background: radial-gradient(circle at 35% 35%, #66DBD0, #00CEC2);
          top: 12%; left: 6%;
          box-shadow: 0 12px 40px rgba(0,206,194,.35);
          opacity: .7;
        }
        .orb2 {
          width: 56px; height: 56px;
          background: radial-gradient(circle at 35% 35%, #8FC7D8, #447596);
          top: 68%; left: 36%;
          animation-delay: -2s;
          box-shadow: 0 8px 24px rgba(68,117,150,.3);
          opacity: .65;
        }
        .orb3 {
          width: 40px; height: 40px;
          background: radial-gradient(circle at 35% 35%, #66DBD0, #00CEC2);
          top: 28%; right: 4%;
          animation-delay: -4s;
          box-shadow: 0 6px 18px rgba(0,206,194,.3);
          opacity: .6;
        }
        .orb4 {
          width: 24px; height: 24px;
          background: radial-gradient(circle at 35% 35%, #8FC7D8, #447596);
          bottom: 22%; left: 10%;
          animation-delay: -1s;
          opacity: .55;
        }
      `}</style>
    </section>
  );
};