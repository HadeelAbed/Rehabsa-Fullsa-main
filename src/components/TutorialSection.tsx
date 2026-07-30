import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";

export const TutorialSection = () => {
  const { t } = useTranslation();
  const { isRTL } = useDirection();

  return (
    <section id="tutorial" className="lp-section bg-white">
      <div className="container mx-auto max-w-[1120px] px-6">
        <div className="text-center mb-12">
          <span className="lp-tag">{t('tutorial.badge') || 'دليل البدء'}</span>
          <h2 className="lp-title">{t('tutorial.title') || 'شاهد كيف تبدأ'}</h2>
          <p className="lp-sub">{t('tutorial.subtitle') || 'من التسجيل إلى أول بطاقة ولاء جاهزة — شرح كامل خطوة بخطوة.'}</p>
        </div>

        <div className="max-w-[860px] mx-auto rounded-[20px] overflow-hidden shadow-[0_20px_60px_rgba(0,206,194,.18),0_2px_8px_rgba(0,0,0,.08)] border border-[rgba(0,206,194,.15)]">
          {/* Title bar */}
          <div className="flex items-center gap-1.5 px-3.5 py-2 bg-[#e8e9f0] border-b border-[#d4d5de]">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]"></div>
            <div className="flex-1 mx-2.5 bg-white rounded-[6px] px-2.5 py-0.5 text-[9px] text-[#888] font-mono border border-[#ddd] text-center ltr">
              app.roaait.com/dashboard
            </div>
          </div>

          {/* Video thumbnail */}
          <a
            href="https://www.youtube.com/watch?v=jzik577DRvQ"
            target="_blank"
            rel="noopener noreferrer"
            className="block relative aspect-video bg-[#0a0c1a] group cursor-pointer"
          >
            <img
              src="https://i.ytimg.com/vi/jzik577DRvQ/maxresdefault.jpg"
              alt={t('tutorial.videoAlt') || 'شرح منصة رؤى IT'}
              className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div className="w-[72px] h-[72px] rounded-full bg-secondary flex items-center justify-center shadow-[0_8px_30px_rgba(68,117,150,.5)] group-hover:scale-110 group-hover:shadow-[0_12px_40px_rgba(68,117,150,.7)] transition-all">
                <svg className={`w-7 h-7 text-white ${isRTL ? 'mr-0.5' : 'ml-0.5'}`} fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </div>
              <span className="text-sm font-bold text-white bg-black/55 px-4 py-1.5 rounded-full backdrop-blur">
                ▶ {t('tutorial.watchLabel') || 'شرح المنصة كاملاً'}
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};