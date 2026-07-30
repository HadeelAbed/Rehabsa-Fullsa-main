import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { getSiteContent } from "@/lib/siteContentStorage";
import { useMemo, useState, useEffect } from "react";

const cardThemes = [
  { bg: '#3d2810', strip: '#f5e6d8', cup: '#6b4226', label: 'COFFEE', points: '2/5' },
  { bg: '#0f2540', strip: '#d0e8ff', cup: '#2a6a9c', label: 'RESTAURANT', points: '4/5' },
  { bg: '#1e0d30', strip: '#e8d5ff', cup: '#7b4fa0', label: 'BEAUTY', points: '3/5' },
];

export const Hero = () => {
  const { t, i18n } = useTranslation();
  const { language } = useDirection();
  const [cardIndex, setCardIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCardIndex((prev) => (prev + 1) % cardThemes.length);
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

  const theme = cardThemes[cardIndex];

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center" style={{ background: '#dde1f2' }}>
      {/* Floating orbs */}
      <div className="orb orb1"></div>
      <div className="orb orb2"></div>
      <div className="orb orb3"></div>
      <div className="orb orb4"></div>

      <div className="absolute inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse 70% 80% at 15% 50%, rgba(0,206,194,.15) 0%, transparent 60%),
          radial-gradient(ellipse 50% 60% at 85% 20%, rgba(68,117,150,.12) 0%, transparent 55%),
          radial-gradient(ellipse 40% 40% at 60% 90%, rgba(0,206,194,.08) 0%, transparent 55%)
        `
      }}></div>

      <div className="container mx-auto max-w-[1120px] px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Left: Phone mockup with card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            {/* Phone frame */}
            <div className="relative" style={{ width: 280, height: 420 }}>
              {cardThemes.map((th, idx) => (
                <div
                  key={idx}
                  className="absolute inset-0 flex items-center justify-center transition-all duration-500"
                  style={{
                    opacity: cardIndex === idx ? 1 : 0,
                    transform: cardIndex === idx ? 'none' : 'translateY(14px) scale(.96)',
                    pointerEvents: cardIndex === idx ? 'auto' : 'none',
                  }}
                >
                  {/* Phone body */}
                  <div className="relative" style={{ width: 200, height: 390, background: '#111', borderRadius: 36, padding: '10px 8px 14px', boxShadow: '0 24px 64px rgba(0,0,0,.4), 0 4px 16px rgba(0,0,0,.2)' }}>
                    {/* Notch */}
                    <div style={{ width: 60, height: 5, background: '#333', borderRadius: 3, margin: '0 auto 10px' }}></div>

                    {/* Loyalty card */}
                    <div className="flex flex-col rounded-[14px] overflow-hidden" style={{ flex: 1, height: 290, background: th.bg }}>
                      {/* Card top */}
                      <div className="flex justify-between items-start px-3 py-2.5">
                        <div>
                          <div style={{ fontSize: 8, color: 'rgba(255,255,255,.5)', fontWeight: 700 }}>{t('hero.cardLabel') || 'LOYALTY CARD'}</div>
                          <div style={{ fontSize: 13, color: 'rgba(255,255,255,.9)', fontWeight: 900, marginTop: 2 }}>{th.label}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 7, color: 'rgba(255,255,255,.4)' }}>{t('hero.cardMember') || 'Member'}</div>
                          <div style={{ fontSize: 8, color: 'rgba(255,255,255,.7)', fontWeight: 700 }}>★★★★★</div>
                        </div>
                      </div>

                      {/* Strip - stamp area */}
                      <div className="relative" style={{ height: 80, background: th.strip }}>
                        <div className="flex items-center justify-center gap-1.5 h-full relative z-10">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} width="22" height="38" viewBox="0 0 24 40">
                              <path d="M12 4L14 16L12 28L4 16Z" fill={th.cup} opacity={i < parseInt(th.points[0]) ? 1 : 0.18}/>
                            </svg>
                          ))}
                        </div>
                      </div>

                      {/* Card bottom */}
                      <div className="px-3 py-2 flex items-center justify-between">
                        <div>
                          <div style={{ fontSize: 7, color: 'rgba(255,255,255,.5)' }}>{t('hero.cardPoints') || 'Points'}</div>
                          <div style={{ fontSize: 14, color: 'white', fontWeight: 900 }}>{th.points}</div>
                        </div>
                        {/* QR placeholder */}
                        <div style={{ width: 34, height: 34, background: 'white', borderRadius: 4, padding: 3 }}>
                          <svg viewBox="0 0 24 24" width="100%" height="100%">
                            <rect x="2" y="2" width="8" height="8" fill="#111"/>
                            <rect x="14" y="2" width="8" height="8" fill="#333"/>
                            <rect x="2" y="14" width="8" height="8" fill="#333"/>
                            <rect x="14" y="14" width="4" height="4" fill="#111"/>
                            <rect x="18" y="18" width="4" height="4" fill="#111"/>
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Card shine */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ borderRadius: 36, padding: '10px 8px 14px' }}>
                      <div style={{
                        position: 'absolute',
                        top: 10, left: 8, right: 8, bottom: 14,
                        background: 'linear-gradient(120deg, transparent 0%, rgba(255,255,255,.5) 50%, transparent 100%)',
                        transform: 'translateX(-100%)',
                        borderRadius: 14,
                        animation: 'card-shine 9s ease-in-out infinite',
                      }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dots */}
            <div className="flex gap-[7px] mt-5">
              {cardThemes.map((_, idx) => (
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
              <span className="text-xs font-semibold" style={{ color: '#6b7082' }}>{t('hero.platformLabel') || 'Digital Loyalty Platform'}</span>
              <div className="flex gap-2">
                <span className="bg-white border rounded-lg px-3 py-1 text-[11px] font-extrabold shadow-sm" style={{ borderColor: '#d4d9ef', color: '#3d4257' }}>SAAS</span>
                <span className="bg-white border rounded-lg px-3 py-1 text-[11px] font-extrabold shadow-sm" style={{ borderColor: '#d4d9ef', color: '#3d4257' }}>AI</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Text */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-5" style={{
              background: 'rgba(0,206,194,.12)',
              border: '1px solid rgba(0,206,194,.3)',
              color: '#447596',
            }}>
              <span className="w-[7px] h-[7px] rounded-full" style={{ background: '#447596', animation: 'blink 2s infinite' }}></span>
              {heroContent.requestDemo}
            </div>
            <h1 className="text-[clamp(26px,3.6vw,46px)] font-black leading-[1.15] mb-4">
              {heroContent.title}
            </h1>
            <p className="text-[17px] leading-relaxed mb-8 max-w-[460px]" style={{ color: '#6b7082' }}>
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
              {[t('hero.pill1') || 'بدون تطبيق', t('hero.pill2') || 'نقاط ولاء', t('hero.pill3') || 'تقارير ذكية'].map((pill, i) => (
                <span key={i} className="flex items-center gap-1.5 text-sm" style={{ color: '#6b7082' }}>
                  <svg className="w-4 h-4 flex-shrink-0" style={{ color: '#447596' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  {pill}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes card-shine {
          0%,8%   { transform: translateX(-100%); opacity: 1; }
          18%     { transform: translateX(200%); opacity: 1; }
          19%,100%{ transform: translateX(200%); opacity: 0; }
        }
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
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
      `}</style>
    </section>
  );
};