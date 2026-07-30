import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";

export const FreeTrial = () => {
  const { t, i18n } = useTranslation();
  const { isRTL } = useDirection();

  return (
    <section className="relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #1a1d35 0%, #2a3068 50%, #1a1d35 100%)',
    }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse 55% 70% at 80% 50%, rgba(0,206,194,.12) 0%, transparent 60%),
          radial-gradient(ellipse 35% 50% at 15% 30%, rgba(68,117,150,.1) 0%, transparent 55%)
        `
      }}></div>

      <div className="container mx-auto max-w-[1120px] px-6 py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div>
            <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-5" style={{
              background: 'rgba(0,206,194,.15)',
              color: '#00CEC2',
              border: '1px solid rgba(0,206,194,.3)',
            }}>
              {t('freeTrial.badge') || 'جرّب مجاناً · بدون بطاقة ائتمان'}
            </div>
            <h2 className="text-white font-black leading-[1.2] mb-4" style={{ fontSize: 'clamp(26px, 3.2vw, 42px)' }}>
              {t('freeTrial.title') || 'جاهز تبدأ؟ جرّب المنصة مجاناً لـ 14 يوم'}
            </h2>
            <p className="text-base leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,.65)' }}>
              {t('freeTrial.subtitle') || 'صمّم بطاقة ولائك وابدأ تجمع عملاءك اليوم — بدون تطبيق، بدون تعقيد، بدون انتظار.'}
            </p>
            <ul className="space-y-3 mb-10">
              {[
                t('freeTrial.perk1') || 'ابدأ خلال ٥ دقائق فقط',
                t('freeTrial.perk2') || 'بدون تطبيق للعملاء',
                t('freeTrial.perk3') || 'إشعارات غير محدودة',
                t('freeTrial.perk4') || 'دعم مباشر عبر واتساب',
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm font-semibold" style={{ color: 'rgba(255,255,255,.8)' }}>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{
                    background: 'rgba(0,206,194,.25)',
                    color: '#00CEC2',
                    fontSize: 11,
                  }}>✓</span>
                  {text}
                </li>
              ))}
            </ul>
            <button className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-base font-extrabold border-none cursor-pointer transition-all hover:-translate-y-0.5" style={{
              background: '#00CEC2',
              color: '#1a1d35',
              boxShadow: '0 4px 20px rgba(0,206,194,.4)',
            }}>
              {t('freeTrial.cta') || 'ابدأ تجربتك المجانية ←'}
            </button>
          </div>

          {/* Right: Demo window */}
          <div className="rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,.5)] bg-[#f5f6fa]" style={{ direction: i18n.language === 'ar' ? 'rtl' : 'ltr' }}>
            {/* Title bar */}
            <div className="flex items-center gap-1.5 px-3.5 py-2" style={{ background: '#e8e9f0', borderBottom: '1px solid #d4d5de' }}>
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f57' }}></span>
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#febc2e' }}></span>
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#28c840' }}></span>
              <span className="flex-1 mx-2.5 bg-white rounded text-[9px] text-[#888] font-mono text-center border border-[#ddd]" style={{ padding: '1px 8px', direction: 'ltr' }}>
                app.rehabsa.com/dashboard
              </span>
            </div>

            {/* Body */}
            <div className="flex" style={{ height: 340 }}>
              {/* Sidebar */}
              <div className="w-[42px] flex-shrink-0 bg-white flex flex-col items-center gap-0.5 py-2.5 border-l border-[#e8e9f0]">
                <div className="w-[30px] h-[30px] mb-2.5 flex items-center justify-center text-[11px] font-black" style={{ color: '#00CEC2' }}>R</div>
                {['□', '◎', '◇'].map((s, i) => (
                  <div key={i} className={`w-[30px] h-[30px] rounded-lg flex items-center justify-center text-sm ${i === 0 ? 'text-white' : 'text-[#aaa]'}`} style={i === 0 ? { background: '#00CEC2' } : {}}>{s}</div>
                ))}
              </div>

              {/* Main */}
              <div className="flex-1 p-3 flex gap-3 overflow-hidden">
                {/* Phone preview */}
                <div className="w-[88px] flex-shrink-0">
                  <div className="bg-[#111] rounded-[18px] p-[5px_4px_8px] shadow-[0_10px_30px_rgba(0,0,0,.4)] flex flex-col" style={{ height: 191 }}>
                    <div className="w-[34px] h-[4px] bg-[#333] rounded mx-auto mb-1.5 flex-shrink-0"></div>
                    {/* Card */}
                    <div className="flex-1 rounded-[10px] overflow-hidden flex flex-col" style={{ background: '#3d2810' }}>
                      <div className="flex justify-between items-start px-1.5 py-1">
                        <div className="text-[5px] text-white/50">COFFEE</div>
                        <div className={isRTL ? 'text-right' : 'text-left'}>
                          <span className="text-[4px] text-white/50 block">Ahmed</span>
                          <span className="text-[5px] text-white/80 font-bold block">★★★★★</span>
                        </div>
                      </div>
                      {/* Strip */}
                      <div className="relative h-[42px]" style={{ background: '#f5e6d8' }}>
                        <div className="flex items-center justify-center gap-0.5 h-full relative z-10">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} width="14" height="26" viewBox="0 0 24 40"><path d="M12 4L14 16L12 28L4 16Z" fill="#6b4226" opacity={i < 3 ? 1 : 0.2}/></svg>
                          ))}
                        </div>
                      </div>
                      {/* Bottom */}
                      <div className="px-1.5 py-1 flex items-center justify-between">
                        <div>
                          <span className="text-[4px] text-white/50 block">Points</span>
                          <span className="text-[9px] text-white font-black block">2/5</span>
                        </div>
                        <div className="w-[26px] h-[26px] bg-white rounded p-0.5">
                          <svg viewBox="0 0 24 24"><rect x="4" y="4" width="8" height="8" fill="#111"/><rect x="14" y="4" width="6" height="6" fill="#333"/><rect x="4" y="14" width="8" height="6" fill="#333"/></svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form area */}
                <div className="flex-1 flex flex-col gap-1.5 overflow-hidden min-w-0">
                  <div className="text-[10px] font-black px-1 py-1.5 rounded" style={{ background: '#00CEC2', color: '#fff' }}>
                    {i18n.language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
                  </div>
                  <div className="flex gap-1">
                    {['التفاصيل', 'تصميم', 'روابط'].map((tab, i) => (
                      <span key={i} className={`text-[8px] font-bold px-2 pb-1 ${i === 1 ? '' : 'text-[#aaa]'}`} style={i === 1 ? { color: '#00CEC2', borderBottom: '2px solid #00CEC2' } : {}}>{tab}</span>
                    ))}
                  </div>
                  {/* Upload row */}
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="w-6 h-6 rounded flex items-center justify-center text-[9px] border border-[#ddd]" style={{ background: '#f0ebe4', color: '#bbb' }}>↑</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[7px] text-[#555] font-bold mb-0.5">{i18n.language === 'ar' ? 'شعار المتجر' : 'Store Logo'} <span style={{ color: '#e44' }}>*</span></div>
                      <span className="text-[7px] bg-[#f3f4f8] border border-[#dde] rounded px-1.5 py-0.5 text-[#666] font-semibold">{i18n.language === 'ar' ? 'اختر ملف' : 'Choose File'}</span>
                    </div>
                  </div>
                  {/* Color row */}
                  <div className="flex gap-2 mt-1">
                    {['bg', 'text', 'strip'].map((_, i) => (
                      <div key={i} className="flex flex-col gap-0.5">
                        <span className="text-[6px] text-[#888] font-bold">{['لون الخلفية','لون النص','لون الشريط'][i] || 'Color'}</span>
                        <div className="w-[18px] h-[18px] rounded border border-[#ddd]" style={{ background: ['#3d2810','#f5e6d8','#6b4226'][i] }}></div>
                      </div>
                    ))}
                  </div>
                  <button className="self-start mt-auto text-[8px] font-extrabold text-white border-none rounded px-3 py-1.5 cursor-pointer" style={{ background: '#00CEC2', boxShadow: '0 4px 12px rgba(0,206,194,.4)' }}>
                    {i18n.language === 'ar' ? 'التالي ←' : 'Next →'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};