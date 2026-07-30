import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";

export const LogoToCard = () => {
  const { t } = useTranslation();
  const { isRTL } = useDirection();

  return (
    <section className="lp-section bg-white">
      <div className="container mx-auto max-w-[1120px] px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Animated Panel */}
          <div className="ltc-panel">
            <div className="ltc-panel-bg"></div>
            <div className="ltc-state-badge">{t('logoToCard.badge') || 'نظام آلي'}</div>

            {/* State 1: Upload */}
            <div className="ltc-state ltc-state-1">
              <div className="ltc-upload-zone">
                <span className="text-3xl">🖼️</span>
                <span className="text-[11px] font-semibold text-muted-foreground">{t('logoToCard.uploadHint') || 'ارفع لوجو متجرك'}</span>
                <img
                  src="https://loyapro.com/assets/guest/images/logo-falling.png"
                  alt=""
                  className="ltc-logo-falling"
                />
                <div className="ltc-accept-badge">✓ {t('logoToCard.accepted') || 'تم الاستلام'}</div>
              </div>
            </div>

            {/* State 2: Generate */}
            <div className="ltc-state ltc-state-2">
              <div className="ltc-gen-wrap">
                <span className="ltc-gen-title">{t('logoToCard.generating') || 'يتم توليد الألوان المناسبة'}</span>
                <div className="ltc-gen-bar-wrap">
                  <div className="ltc-gen-bar"></div>
                </div>
                <div className="ltc-swatches-grid">
                  <div className="ltc-sw"></div>
                  <div className="ltc-sw"></div>
                  <div className="ltc-sw"></div>
                  <div className="ltc-sw"></div>
                </div>
                <div className="ltc-gen-done">✓ {t('logoToCard.done') || 'تم التوليد'}</div>
              </div>
            </div>

            {/* State 3: Result */}
            <div className="ltc-state ltc-state-3">
              <div className="ltc-result-wrap">
                <div className="ltc-result-phone">
                  <div className="ltc-result-card-wrap">
                    <img src="https://loyapro.com/assets/guest/images/card-preview.png" alt="" />
                    <div className="ltc-card-shine"></div>
                  </div>
                </div>
                <div className="ltc-ready-badge">✓ {t('logoToCard.ready') || 'الكارد جاهز'}</div>
              </div>
            </div>

            {/* Dots */}
            <div className="ltc-dots">
              <div className="ltc-dot ltc-dot-1"></div>
              <div className="ltc-dot ltc-dot-2"></div>
              <div className="ltc-dot ltc-dot-3"></div>
            </div>
          </div>

          {/* Right: Text */}
          <div>
            <span className="lp-tag">{t('logoToCard.badge') || 'نظام آلي'}</span>
            <h2 className="text-[clamp(24px,3vw,36px)] font-black leading-[1.25] mb-4">
              {t('logoToCard.title') || 'لوجو متجرك إلى كارد ولاء احترافي'}
            </h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed mb-8">
              {t('logoToCard.description') || 'فقط ارفع لوجو متجرك ونظامنا الذكي يختار الألوان والتصميم المناسب تلقائياً'}
            </p>

            <div className="flex flex-col gap-4 mb-8">
              {[1, 2, 3].map((step) => (
                <div key={step} className={`flex gap-3.5 items-start ltc-step-item-${step}`}>
                  <div className="ltc-step-num">{String(step).padStart(2, '0')}</div>
                  <div className="ltc-step-text">
                    <strong>{t(`logoToCard.step${step}Title`) || ''}</strong>
                    <span>{t(`logoToCard.step${step}Description`) || ''}</span>
                  </div>
                </div>
              ))}
            </div>

            <a href="/register" className="ltc-cta">
              {t('logoToCard.cta') || 'ابدأ الآن'}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d={isRTL ? "M19 12H5m7-7-7 7 7 7" : "M5 12h14m-7-7 7 7-7 7"} /></svg>
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .ltc-panel {
          height: 480px;
          border-radius: 28px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 12px 48px rgba(0,206,194,.18);
        }
        .ltc-panel-bg {
          position: absolute; inset: 0;
          animation: ltc-panel-bg 9s ease-in-out infinite;
        }
        @keyframes ltc-panel-bg {
          0%,30%  { background: linear-gradient(145deg,#e6f7f5,#d1f0ec); }
          33%,63% { background: linear-gradient(145deg,#eaf1f7,#d6e4f0); }
          66%,96% { background: linear-gradient(145deg,#f5edf0,#ecd6db); }
          100%    { background: linear-gradient(145deg,#e6f7f5,#d1f0ec); }
        }
        .ltc-state-badge {
          position: absolute; top: 22px; right: 22px;
          background: white; color: #00CEC2; font-size: 11px; font-weight: 800;
          padding: 5px 13px; border-radius: 50px;
          box-shadow: 0 2px 8px rgba(0,0,0,.1); z-index: 2;
        }
        .ltc-state {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 0;
          opacity: 0;
        }
        .ltc-state-1 { animation: ltc-state-show 9s ease-in-out infinite; }
        .ltc-state-2 { animation: ltc-state-show 9s ease-in-out infinite; animation-delay: 3s; }
        .ltc-state-3 { animation: ltc-state-show 9s ease-in-out infinite; animation-delay: 6s; }
        @keyframes ltc-state-show {
          0%      { opacity: 0; transform: translateY(22px) scale(.97); }
          7%      { opacity: 1; transform: translateY(0) scale(1); }
          28%     { opacity: 1; transform: translateY(0) scale(1); }
          33%     { opacity: 0; transform: translateY(-14px) scale(.98); }
          100%    { opacity: 0; }
        }
        .ltc-dots {
          position: absolute; bottom: 22px; left: 50%; transform: translateX(-50%);
          display: flex; gap: 8px; z-index: 2;
        }
        .ltc-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: hsl(215, 20%, 85%); transition: all .3s;
        }
        .ltc-dot-1 { animation: ltc-dot-on 9s ease-in-out infinite; }
        .ltc-dot-2 { animation: ltc-dot-on 9s ease-in-out infinite; animation-delay: 3s; }
        .ltc-dot-3 { animation: ltc-dot-on 9s ease-in-out infinite; animation-delay: 6s; }
        @keyframes ltc-dot-on {
          0%,5%   { background: #00CEC2; transform: scale(1.5); }
          30%     { background: #00CEC2; transform: scale(1.5); }
          33%,100%{ background: hsl(215, 20%, 85%); transform: scale(1); }
        }
        .ltc-upload-zone {
          width: 160px; height: 160px; border: 2.5px dashed #8CE4DE;
          border-radius: 20px; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 10px;
          position: relative; background: rgba(255,255,255,.6);
          animation: ltc-zone-glow 9s ease-in-out infinite;
        }
        @keyframes ltc-zone-glow {
          0%,10%  { border-color: #8CE4DE; background: rgba(255,255,255,.6); }
          14%,28% { border-color: #00CEC2; background: rgba(255,255,255,.9); box-shadow: 0 0 0 4px rgba(0,206,194,.15); }
          33%,100%{ border-color: #8CE4DE; background: rgba(255,255,255,.6); }
        }
        .ltc-logo-falling {
          position: absolute; width: 70px;
          filter: drop-shadow(0 6px 14px rgba(0,0,0,.18));
          animation: ltc-logo-fall 9s ease-in-out infinite;
        }
        @keyframes ltc-logo-fall {
          0%,2%   { top: -80px; opacity: 0; transform: scale(.6) rotate(-10deg); }
          9%      { top: 42px;  opacity: 1; transform: scale(1) rotate(0deg); }
          12%,28% { top: 42px;  opacity: 1; transform: scale(1); }
          31%     { top: 42px;  opacity: 0; }
          33%,100%{ top: -80px; opacity: 0; }
        }
        .ltc-accept-badge {
          position: absolute; bottom: -36px;
          background: #00CEC2; color: white;
          font-size: 11px; font-weight: 800; padding: 6px 16px; border-radius: 50px;
          opacity: 0; animation: ltc-accept-pop 9s ease-in-out infinite;
          white-space: nowrap; box-shadow: 0 4px 12px rgba(0,206,194,.4);
        }
        @keyframes ltc-accept-pop {
          0%,12%  { opacity: 0; transform: scale(.7); }
          15%,28% { opacity: 1; transform: scale(1); }
          32%,100%{ opacity: 0; transform: scale(.7); }
        }
        .ltc-gen-wrap {
          display: flex; flex-direction: column; align-items: center; gap: 18px;
          padding: 0 32px; width: 100%;
        }
        .ltc-gen-title { font-size: 13px; font-weight: 700; color: hsl(215, 20%, 45%); }
        .ltc-gen-bar-wrap {
          width: 100%; height: 8px; background: rgba(255,255,255,.7);
          border-radius: 50px; overflow: hidden;
        }
        .ltc-gen-bar {
          height: 100%; border-radius: 50px; width: 0%;
          background: linear-gradient(90deg, #8CE4DE, #00CEC2);
          animation: ltc-bar-fill 9s ease-in-out infinite;
          animation-delay: 3s;
        }
        @keyframes ltc-bar-fill {
          0%,5%   { width: 0%; }
          25%,28% { width: 100%; }
          33%,100%{ width: 0%; }
        }
        .ltc-swatches-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
        }
        .ltc-sw {
          width: 52px; height: 52px; border-radius: 14px;
          box-shadow: 0 4px 14px rgba(0,0,0,.15); opacity: 0;
          border: 3px solid white;
        }
        .ltc-sw:nth-child(1){ background:#00CEC2; animation:ltc-sw-pop 9s ease-in-out infinite; animation-delay:3.4s; }
        .ltc-sw:nth-child(2){ background:#447596; animation:ltc-sw-pop 9s ease-in-out infinite; animation-delay:3.7s; }
        .ltc-sw:nth-child(3){ background:#8CE4DE; animation:ltc-sw-pop 9s ease-in-out infinite; animation-delay:4.0s; }
        .ltc-sw:nth-child(4){ background:#e0f7f5; border-color:#eee; animation:ltc-sw-pop 9s ease-in-out infinite; animation-delay:4.3s; }
        @keyframes ltc-sw-pop {
          0%,3%   { opacity: 0; transform: scale(.3) rotate(-8deg); }
          10%,28% { opacity: 1; transform: scale(1) rotate(0deg); }
          33%,100%{ opacity: 0; transform: scale(.3); }
        }
        .ltc-gen-done {
          font-size: 11px; font-weight: 800; color: #00CEC2;
          background: #e6f7f5; border: 1px solid #b8efe8;
          border-radius: 50px; padding: 5px 14px; opacity: 0;
          animation: ltc-sw-pop 9s ease-in-out infinite; animation-delay: 4.8s;
        }
        .ltc-result-wrap {
          display: flex; flex-direction: column; align-items: center; gap: 14px;
        }
        .ltc-result-phone {
          width: 110px; height: 238px;
          background: #111; border-radius: 22px;
          padding: 8px 6px 10px;
          box-shadow: 0 20px 56px rgba(0,0,0,.4);
          display: flex; flex-direction: column;
          animation: ltc-result-rise 9s ease-in-out infinite; animation-delay: 6s;
        }
        @keyframes ltc-result-rise {
          0%,3%   { opacity: 0; transform: translateY(40px) scale(.9); }
          12%,28% { opacity: 1; transform: translateY(0) scale(1); }
          33%,100%{ opacity: 0; transform: translateY(40px) scale(.9); }
        }
        .ltc-result-phone::before {
          content: ''; display: block; width: 34px; height: 4px;
          background: #333; border-radius: 2px; margin: 0 auto 6px; flex-shrink: 0;
        }
        .ltc-result-card-wrap {
          flex: 1; border-radius: 14px; overflow: hidden; position: relative;
          background: #1a1208; display: flex; align-items: center; justify-content: center;
        }
        .ltc-result-card-wrap img { width: 100%; height: auto; object-fit: contain; display: block; border-radius: 10px; }
        .ltc-card-shine {
          position: absolute; inset: 0;
          background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,.6) 50%, transparent 100%);
          transform: translateX(-100%);
          animation: ltc-card-sweep 9s ease-in-out infinite; animation-delay: 6s;
        }
        @keyframes ltc-card-sweep {
          0%,8%   { transform: translateX(-100%); opacity: 1; }
          18%     { transform: translateX(200%); opacity: 1; }
          19%,100%{ transform: translateX(200%); opacity: 0; }
        }
        .ltc-ready-badge {
          background: #00CEC2; color: white;
          font-size: 12px; font-weight: 800; padding: 7px 18px; border-radius: 50px;
          box-shadow: 0 4px 14px rgba(0,206,194,.35);
          opacity: 0;
          animation: ltc-sw-pop 9s ease-in-out infinite; animation-delay: 7s;
        }
        .ltc-step-num {
          width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
          background: hsl(215, 20%, 95%); border: 2px solid hsl(215, 20%, 85%);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 900; color: #00CEC2;
        }
        .ltc-step-item-1 .ltc-step-num { animation: ltc-num-hl 9s ease-in-out infinite; }
        .ltc-step-item-2 .ltc-step-num { animation: ltc-num-hl 9s ease-in-out infinite; animation-delay: 3s; }
        .ltc-step-item-3 .ltc-step-num { animation: ltc-num-hl 9s ease-in-out infinite; animation-delay: 6s; }
        @keyframes ltc-num-hl {
          0%,5%   { background: #00CEC2; border-color: #00CEC2; color: white; }
          30%     { background: #00CEC2; border-color: #00CEC2; color: white; }
          33%,100%{ background: hsl(215, 20%, 95%); border-color: hsl(215, 20%, 85%); color: #00CEC2; }
        }
        .ltc-step-item-1 { animation: ltc-step-hl 9s ease-in-out infinite; }
        .ltc-step-item-2 { animation: ltc-step-hl 9s ease-in-out infinite; animation-delay: 3s; }
        .ltc-step-item-3 { animation: ltc-step-hl 9s ease-in-out infinite; animation-delay: 6s; }
        @keyframes ltc-step-hl {
          0%,5%   { opacity: 1; }
          30%     { opacity: 1; }
          33%,100%{ opacity: .35; }
        }
        .ltc-step-text strong { font-size: 15px; font-weight: 800; display: block; margin-bottom: 3px; }
        .ltc-step-text span   { font-size: 13px; color: hsl(215, 20%, 45%); }
        .ltc-cta {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 32px; border-radius: 50px;
          background: #00CEC2; color: white;
          font-size: 16px; font-weight: 800;
          text-decoration: none; transition: all .2s;
          box-shadow: 0 4px 20px rgba(0,206,194,.4);
        }
        .ltc-cta:hover { background: #00B8AD; transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,206,194,.5); }
      `}</style>
    </section>
  );
};