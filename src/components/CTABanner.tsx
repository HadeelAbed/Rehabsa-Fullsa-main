import { useTranslation } from "react-i18next";

export const CTABanner = () => {
  const { t } = useTranslation();

  return (
    <section id="cta" className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1d35 0%, #2a3068 50%, #1a1d35 100%)' }}>
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse 55% 70% at 80% 50%, rgba(0,206,194,.15) 0%, transparent 60%),
          radial-gradient(ellipse 35% 50% at 15% 30%, rgba(68,117,150,.12) 0%, transparent 55%)
        `
      }}></div>

      <div className="container mx-auto max-w-[1120px] px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold mb-4" style={{ background: 'rgba(0,206,194,.18)', color: '#8CE4DE', border: '1px solid rgba(0,206,194,.3)' }}>
              {t('cta.badge') || 'ابدأ الآن'}
            </span>
            <h2 className="text-[clamp(24px,3.2vw,42px)] font-black text-white leading-[1.25] mb-4">
              {t('cta.title') || 'جاهز لتحويل عملائك إلى مشتركين أوفياء؟'}
            </h2>
            <p className="text-[16px] leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,.6)' }}>
              {t('cta.description') || 'اكتشف كيف يمكن لنظام الولاء الرقمي أن يزيد تكرار الشراء ويعزز ولاء عملائك بدون تطبيق أو متابعة.'}
            </p>
            <ul className="list-none mb-8 flex flex-col gap-2.5">
              {[
                t('cta.perk1') || 'نقاط ولاء ذكية بدون تطبيق',
                t('cta.perk2') || 'تقارير وتحليلات لحظية',
                t('cta.perk3') || 'دعم فني متميز على مدار الساعة',
              ].map((perk, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm font-semibold" style={{ color: 'rgba(255,255,255,.8)' }}>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[11px]" style={{ background: 'rgba(0,206,194,.25)', color: '#8CE4DE' }}>✓</span>
                  {perk}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              <a href="/register" className="lp-btn lp-btn-primary text-base no-underline">
                {t('cta.cta') || 'ابدأ تجربتك المجانية'}
              </a>
              <a href="/contact" className="lp-btn lp-btn-outline text-base no-underline text-white border-white/30 hover:bg-white/10">
                {t('cta.contact') || 'تواصل مع المبيعات'}
              </a>
            </div>
          </div>

          {/* Demo window */}
          <div className="demo-window">
            <div className="demo-titlebar">
              <div className="demo-dot"></div>
              <div className="demo-dot"></div>
              <div className="demo-dot"></div>
              <div className="demo-url">loyalty.demo.com/dashboard</div>
            </div>
            <div className="demo-body">
              <div className="demo-sidebar">
                <div className="demo-sidebar-logo">
                  <img src="https://loyapro.com/assets/guest/images/demo-logo.svg" alt="" />
                </div>
                <div className="demo-nav-item active">📊</div>
                <div className="demo-nav-item">👥</div>
                <div className="demo-nav-item">💳</div>
                <div className="demo-nav-item">⚙️</div>
              </div>
              <div className="demo-main">
                <div className="demo-phone-wrap">
                  <div className="demo-phone">
                    <div className="demo-loyalty-card-rebuilt">
                      <div className="demo-card-top">
                        <img className="demo-card-banner" src="https://loyapro.com/assets/guest/images/demo-banner.svg" alt="" />
                        <div className="demo-card-name-col">
                          <span className="demo-card-name-label">العميل</span>
                          <span className="demo-card-name-val">أحمد محمد</span>
                        </div>
                      </div>
                      <div className="demo-card-strip">
                        <img className="demo-card-strip-img" src="https://loyapro.com/assets/guest/images/demo-strip-bg.svg" alt="" />
                        <div className="demo-card-cups">
                          <img className="demo-card-cup" src="https://loyapro.com/assets/guest/images/demo-cup.svg" alt="" />
                          <img className="demo-card-cup" src="https://loyapro.com/assets/guest/images/demo-cup.svg" alt="" />
                          <img className="demo-card-cup" src="https://loyapro.com/assets/guest/images/demo-cup.svg" alt="" />
                          <img className="demo-card-cup" src="https://loyapro.com/assets/guest/images/demo-cup.svg" alt="" />
                        </div>
                      </div>
                      <div className="demo-card-bottom">
                        <div className="demo-card-stats">
                          <div><span className="demo-card-stat-val">128</span> نقاط</div>
                          <div><span className="demo-card-stat-val">15</span> زيارة</div>
                        </div>
                        <div className="demo-card-qr">
                          <img src="https://loyapro.com/assets/guest/images/demo-qr.svg" alt="" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="demo-form">
                  <div className="demo-tabs">
                    <div className="demo-tab active">التصميم</div>
                    <div className="demo-tab">المحتوى</div>
                  </div>
                  <div className="demo-upload-row">
                    <div className="demo-upload-preview">
                      <img src="https://loyapro.com/assets/guest/images/demo-logo-sm.svg" alt="" />
                    </div>
                    <div className="demo-upload-right">
                      <div className="demo-upload-label">شعار المتجر <span>*</span></div>
                      <span className="demo-upload-btn">اختيار ملف</span>
                    </div>
                  </div>
                  <div className="demo-colors-row">
                    <div className="demo-color-col">
                      <span className="demo-color-col-label">اللون الأساسي</span>
                      <div className="demo-swatch demo-swatch-1"></div>
                    </div>
                    <div className="demo-color-col">
                      <span className="demo-color-col-label">اللون الثانوي</span>
                      <div className="demo-swatch demo-swatch-2"></div>
                    </div>
                    <div className="demo-color-col">
                      <span className="demo-color-col-label">خلفية</span>
                      <div className="demo-swatch demo-swatch-3"></div>
                    </div>
                  </div>
                  <button className="demo-btn-next">التالي ←</button>
                  {/* Animated cursor */}
                  <div className="demo-cursor"></div>
                  {/* Color picker popup */}
                  <div className="demo-color-picker">
                    <div className="demo-picker-gradient">
                      <div className="demo-picker-dot" style={{ top: '30%', right: '25%' }}></div>
                    </div>
                    <div className="demo-picker-hue">
                      <div className="demo-picker-hue-thumb"></div>
                    </div>
                    <div className="demo-picker-hex" style={{ backgroundColor: '#f3f4f8', border: '1px solid #e0e1ea', borderRadius: 4, padding: '2px 5px', fontSize: 8, fontWeight: 700, color: '#444', fontFamily: 'monospace', textAlign: 'center' }}>#00CEC2</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .demo-window {
          background: #f5f6fa; border-radius: 16px; overflow: hidden;
          box-shadow: 0 32px 80px rgba(0,0,0,.5), 0 0 0 1px rgba(0,0,0,.08);
          direction: rtl;
        }
        .demo-titlebar {
          background: #e8e9f0; padding: 9px 14px;
          display: flex; align-items: center; gap: 6px;
          border-bottom: 1px solid #d4d5de;
        }
        .demo-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
        .demo-dot:nth-child(1) { background: #ff5f57; }
        .demo-dot:nth-child(2) { background: #febc2e; }
        .demo-dot:nth-child(3) { background: #28c840; }
        .demo-url {
          flex: 1; margin: 0 10px; background: white;
          border-radius: 6px; padding: 3px 10px; font-size: 9px;
          color: #888; font-family: monospace; border: 1px solid #ddd;
          direction: ltr; text-align: center;
        }
        .demo-body { display: flex; height: 340px; }
        .demo-sidebar {
          width: 42px; background: white; flex-shrink: 0;
          padding: 10px 0; border-left: 1px solid #e8e9f0;
          display: flex; flex-direction: column; align-items: center; gap: 2px;
        }
        .demo-sidebar-logo { width: 30px; height: 30px; margin-bottom: 10px; display: flex; align-items: center; justify-content: center; }
        .demo-sidebar-logo img { width: 100%; height: 100%; object-fit: contain; display: block; }
        .demo-nav-item { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 13px; cursor: default; }
        .demo-nav-item.active { background: #eef0f8; color: #00CEC2; }
        .demo-main { flex: 1; padding: 12px; overflow: hidden; display: flex; gap: 12px; }
        .demo-phone-wrap { width: 90px; flex-shrink: 0; }
        .demo-phone { width: 88px; height: 191px; background: #111; border-radius: 18px; padding: 8px 5px 10px; box-shadow: 0 10px 30px rgba(0,0,0,.4); display: flex; flex-direction: column; }
        .demo-phone::before { content: ''; display: block; width: 34px; height: 4px; background: #333; border-radius: 2px; margin: 0 auto 6px; flex-shrink: 0; }
        .demo-loyalty-card-rebuilt { border-radius: 10px; overflow: hidden; direction: rtl; flex: 1; animation: demo-card-bg 9s ease-in-out infinite; }
        @keyframes demo-card-bg {
          0%,28%  { background: #00CEC2; }
          33%,61% { background: #447596; }
          66%,94% { background: #2a3068; }
          99%,100%{ background: #00CEC2; }
        }
        .demo-card-top { padding: 5px 6px 3px; display: flex; justify-content: space-between; align-items: flex-start; }
        .demo-card-banner { width: 62%; display: block; }
        .demo-card-name-col { text-align: left; }
        .demo-card-name-label { font-size: 5px; color: rgba(255,255,255,.5); display: block; }
        .demo-card-name-val   { font-size: 5.5px; color: rgba(255,255,255,.8); font-weight: 700; display: block; }
        .demo-card-strip { position: relative; height: 42px; overflow: hidden; }
        .demo-card-strip-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: .55; }
        .demo-card-cups { position: relative; z-index: 1; display: flex; align-items: center; justify-content: center; gap: 2px; height: 100%; padding: 3px; }
        .demo-card-cup { height: 26px; width: auto; display: block; }
        .demo-card-bottom { padding: 5px 6px 6px; }
        .demo-card-stats { display: flex; justify-content: space-between; font-size: 4.5px; color: rgba(255,255,255,.7); margin-bottom: 5px; }
        .demo-card-stat-val { font-size: 10px; font-weight: 900; color: white; display: block; }
        .demo-card-qr { width: 34px; height: 34px; margin: 0 auto; background: white; border-radius: 3px; padding: 2px; }
        .demo-card-qr img { width: 100%; height: 100%; display: block; }
        .demo-form { flex: 1; display: flex; flex-direction: column; gap: 7px; overflow: hidden; min-width: 0; }
        .demo-tabs { display: flex; gap: 1px; border-bottom: 1px solid #e0e1ea; padding-bottom: 7px; margin-bottom: 2px; }
        .demo-tab { padding: 3px 8px; border-radius: 5px; font-size: 8.5px; font-weight: 700; color: #aaa; }
        .demo-tab.active { color: #00CEC2; border-bottom: 2px solid #00CEC2; border-radius: 0; margin-bottom: -9px; padding-bottom: 5px; }
        .demo-upload-row { display: flex; align-items: center; gap: 6px; }
        .demo-upload-preview { width: 28px; height: 28px; border-radius: 5px; background: #f0ebe4; border: 1px solid #ddd; flex-shrink: 0; overflow: hidden; display: flex; align-items: center; justify-content: center; }
        .demo-upload-preview img { width: 100%; height: 100%; object-fit: cover; border-radius: 4px; }
        .demo-upload-right { flex: 1; min-width: 0; }
        .demo-upload-label { font-size: 8.5px; color: #555; font-weight: 700; margin-bottom: 2px; }
        .demo-upload-label span { color: #e44; font-size: 7px; }
        .demo-upload-btn { background: #f3f4f8; border: 1px solid #dde; border-radius: 4px; padding: 2px 7px; font-size: 8px; color: #666; font-weight: 600; display: inline-block; }
        .demo-colors-row { display: flex; gap: 8px; margin-top: 2px; }
        .demo-color-col { display: flex; flex-direction: column; gap: 3px; align-items: flex-start; }
        .demo-color-col-label { font-size: 7.5px; color: #888; font-weight: 700; white-space: nowrap; }
        .demo-swatch { width: 22px; height: 22px; border-radius: 5px; border: 1.5px solid #ddd; }
        .demo-swatch-1 { background: #00CEC2; }
        .demo-swatch-2 { background: #447596; }
        .demo-swatch-3 { background: #ffffff; border: 1.5px solid #ccc; }
        .demo-btn-next { align-self: flex-start; margin-top: auto; background: #00CEC2; color: white; border: none; border-radius: 7px; padding: 6px 16px; font-size: 9.5px; font-weight: 800; cursor: pointer; box-shadow: 0 4px 12px rgba(0,206,194,.4); animation: btn-pulse 3s ease-in-out infinite; }
        @keyframes btn-pulse { 0%,100% { box-shadow: 0 4px 12px rgba(0,206,194,.35); } 50% { box-shadow: 0 4px 22px rgba(0,206,194,.65); } }
        .demo-cursor { position: absolute; pointer-events: none; z-index: 20; width: 14px; height: 16px; animation: cursor-move 9s ease-in-out infinite; }
        .demo-cursor::before { content: ''; position: absolute; inset: 0; background: rgba(30,30,30,.9); clip-path: polygon(0 0, 38% 100%, 50% 60%, 100% 82%); filter: drop-shadow(0 1px 2px rgba(0,0,0,.3)); }
        .demo-cursor::after { content: ''; position: absolute; top: -4px; left: -4px; width: 20px; height: 20px; border-radius: 50%; border: 2px solid #00CEC2; opacity: 0; animation: cursor-click 9s ease-in-out infinite; }
        @keyframes cursor-move {
          0%,24%    { top: 90%; left: 22%; transform: scale(1); }
          27%       { top: 90%; left: 22%; }
          29%,31%   { top: 73%; left: 44%; transform: scale(.85); }
          32%,57%   { top: 90%; left: 22%; transform: scale(1); }
          60%       { top: 90%; left: 22%; }
          62%,64%   { top: 73%; left: 44%; transform: scale(.85); }
          65%,90%   { top: 90%; left: 22%; transform: scale(1); }
          93%       { top: 90%; left: 22%; }
          95%,97%   { top: 73%; left: 44%; transform: scale(.85); }
          100%      { top: 90%; left: 22%; transform: scale(1); }
        }
        @keyframes cursor-click {
          29%  { opacity: 0; transform: scale(.3); }
          30%  { opacity: .9; transform: scale(.5); }
          32%  { opacity: 0; transform: scale(1.4); }
          62%  { opacity: 0; transform: scale(.3); }
          63%  { opacity: .9; transform: scale(.5); }
          65%  { opacity: 0; transform: scale(1.4); }
          95%  { opacity: 0; transform: scale(.3); }
          96%  { opacity: .9; transform: scale(.5); }
          98%  { opacity: 0; transform: scale(1.4); }
        }
        .demo-color-picker { position: absolute; top: 18%; left: 32%; width: 100px; background: white; border-radius: 8px; padding: 6px; box-shadow: 0 4px 20px rgba(0,0,0,.22); z-index: 15; pointer-events: none; opacity: 0; animation: picker-show 9s ease-in-out infinite; }
        @keyframes picker-show {
          28%  { opacity: 0; transform: translateY(4px); }
          29%  { opacity: 1; transform: translateY(0); }
          32%  { opacity: 1; }
          33%  { opacity: 0; }
          61%  { opacity: 0; transform: translateY(4px); }
          62%  { opacity: 1; transform: translateY(0); }
          65%  { opacity: 1; }
          66%  { opacity: 0; }
          94%  { opacity: 0; transform: translateY(4px); }
          95%  { opacity: 1; transform: translateY(0); }
          98%  { opacity: 1; }
          99%  { opacity: 0; }
        }
        .demo-picker-gradient { width: 100%; height: 52px; border-radius: 5px; margin-bottom: 5px; position: relative; overflow: hidden; animation: picker-gradient-cycle 9s ease-in-out infinite; }
        @keyframes picker-gradient-cycle {
          0%,28%  { background: linear-gradient(to bottom, white, transparent), linear-gradient(to right, white, #00CEC2); }
          33%,61% { background: linear-gradient(to bottom, white, transparent), linear-gradient(to right, white, #447596); }
          66%,94% { background: linear-gradient(to bottom, white, transparent), linear-gradient(to right, white, #2a3068); }
          99%,100%{ background: linear-gradient(to bottom, white, transparent), linear-gradient(to right, white, #00CEC2); }
        }
        .demo-picker-gradient::after { content: ''; position: absolute; top: 0; bottom: 0; left: 0; right: 0; background: linear-gradient(to bottom, transparent, black); }
        .demo-picker-dot { position: absolute; width: 7px; height: 7px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 0 1px rgba(0,0,0,.3); z-index: 2; top: 30%; right: 25%; }
        .demo-picker-hue { height: 7px; border-radius: 4px; margin-bottom: 5px; background: linear-gradient(to left, #ff0000, #ff8000, #ffff00, #00ff00, #00ffff, #0000ff, #8000ff, #ff0080, #ff0000); }
        .demo-picker-hue-thumb { width: 9px; height: 9px; border-radius: 50%; background: white; border: 1.5px solid #ccc; box-shadow: 0 1px 3px rgba(0,0,0,.2); margin-top: -8px; position: relative; animation: picker-hue-pos 9s ease-in-out infinite; }
        @keyframes picker-hue-pos {
          0%,28%  { margin-right: 68%; }
          33%,61% { margin-right: 80%; }
          66%,94% { margin-right: 15%; }
          99%,100%{ margin-right: 68%; }
        }
        @media (max-width: 960px) {
          .demo-window { order: 2; width: 100%; }
        }
      `}</style>
    </section>
  );
};