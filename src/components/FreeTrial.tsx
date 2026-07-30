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

          {/* Right: Card builder demo */}
          <div className="rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,.5)] bg-[#f5f6fa]" style={{ direction: i18n.language === 'ar' ? 'rtl' : 'ltr' }}>
            {/* Title bar */}
            <div className="flex items-center gap-1.5 px-3.5 py-2" style={{ background: '#e8e9f0', borderBottom: '1px solid #d4d5de' }}>
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f57' }}></span>
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#febc2e' }}></span>
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#28c840' }}></span>
              <span className="flex-1 mx-2.5 bg-white rounded text-[9px] text-[#888] font-mono text-center border border-[#ddd]" style={{ padding: '1px 8px', direction: 'ltr' }}>
                app.rehabsa.com/dashboard/cards/edit/1
              </span>
            </div>

            {/* Body: two-panel layout like EditCardPage */}
            <div className="flex" style={{ height: 360 }}>
              {/* Left: Phone preview */}
              <div className="flex-1 bg-white flex items-center justify-center p-4 border-l border-[#e8e9f0]">
                <div className="bg-[#111] rounded-[24px] p-[6px_5px_10px] shadow-[0_16px_48px_rgba(0,0,0,.35)] flex flex-col items-center" style={{ width: 170 }}>
                  <div className="w-[36px] h-[4px] bg-[#333] rounded mx-auto mb-2 flex-shrink-0"></div>
                  {/* Card preview */}
                  <div className="w-full rounded-[12px] overflow-hidden flex flex-col" style={{
                    background: 'linear-gradient(135deg, #0f2540 0%, #1a3a5c 100%)',
                    minHeight: 220,
                  }}>
                    {/* Logo + Name */}
                    <div className="flex items-center gap-2 px-3 pt-3 pb-1">
                      <div className="w-[28px] h-[28px] rounded-full bg-white/20 flex items-center justify-center text-white text-[10px] font-black">R</div>
                      <div>
                        <div className="text-[7px] text-white/60">{i18n.language === 'ar' ? 'بطاقة ولاء' : 'Loyalty Card'}</div>
                        <div className="text-[9px] text-white font-bold">{i18n.language === 'ar' ? 'قهوة المذاق' : 'Coffee Shop'}</div>
                      </div>
                    </div>
                    {/* Stars/Stamp area */}
                    <div className="mx-3 my-2 rounded-[8px] flex items-center justify-center gap-1 py-2" style={{ background: 'rgba(255,255,255,.12)' }}>
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} width="16" height="24" viewBox="0 0 24 36">
                          <path d="M12 4L14 14L12 24L4 14Z" fill="#FFD700" opacity={i < 2 ? 1 : 0.2}/>
                        </svg>
                      ))}
                    </div>
                    {/* Reward info */}
                    <div className="px-3 pb-2">
                      <div className="text-[7px] text-white/60">{i18n.language === 'ar' ? 'المكافأة' : 'Reward'}</div>
                      <div className="text-[9px] text-white font-bold">{i18n.language === 'ar' ? 'مشروب مجاني' : 'Free Drink'}</div>
                    </div>
                    {/* QR placeholder */}
                    <div className="mt-auto px-3 pb-3 flex items-center justify-between">
                      <div className="w-[28px] h-[28px] bg-white rounded-[4px] p-[2px]">
                        <svg viewBox="0 0 24 24" width="100%" height="100%">
                          <rect x="2" y="2" width="8" height="8" fill="#111"/>
                          <rect x="14" y="2" width="8" height="8" fill="#333"/>
                          <rect x="2" y="14" width="8" height="8" fill="#333"/>
                        </svg>
                      </div>
                      <div className="text-right">
                        <div className="text-[6px] text-white/50">{i18n.language === 'ar' ? 'رقم العضوية' : 'Member ID'}</div>
                        <div className="text-[7px] text-white/80 font-mono">#RH-1842</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-[7px] text-[#666] mt-2 font-semibold">{i18n.language === 'ar' ? 'معاينة البطاقة' : 'Card Preview'}</div>
                </div>
              </div>

              {/* Right: Form panel */}
              <div className="w-[200px] flex flex-col p-3 gap-2 overflow-hidden flex-shrink-0">
                {/* Tabs */}
                <div className="flex gap-0.5 border-b border-[#e0e1ea] pb-1.5">
                  {[
                    i18n.language === 'ar' ? 'التفاصيل' : 'Details',
                    i18n.language === 'ar' ? 'تصميم' : 'Design',
                    i18n.language === 'ar' ? 'روابط' : 'Links'
                  ].map((tab, i) => (
                    <span key={i} className={`text-[7.5px] font-bold px-1.5 pb-1 ${i === 1 ? '' : 'text-[#aaa]'}`}
                      style={i === 1 ? { color: '#00CEC2', borderBottom: '2px solid #00CEC2' } : {}}>{tab}</span>
                  ))}
                </div>

                {/* Logo upload field */}
                <div>
                  <div className="text-[7.5px] text-[#555] font-bold mb-1">
                    {i18n.language === 'ar' ? 'شعار المتجر' : 'Store Logo'} <span style={{ color: '#e44' }}>*</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-[26px] h-[26px] rounded-[5px] bg-[#f0ebe4] border border-[#ddd] flex items-center justify-center text-[9px] text-[#bbb]">↑</div>
                    <span className="text-[7px] bg-[#f3f4f8] border border-[#dde] rounded px-1.5 py-0.5 text-[#666] font-semibold">
                      {i18n.language === 'ar' ? 'اختر ملف' : 'Choose File'}
                    </span>
                  </div>
                </div>

                {/* Background image upload */}
                <div>
                  <div className="text-[7.5px] text-[#555] font-bold mb-1">
                    {i18n.language === 'ar' ? 'صورة الخلفية' : 'Background Image'}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-[26px] h-[26px] rounded-[5px] bg-[#e8eef8] border border-[#ddd] flex items-center justify-center text-[9px] text-[#bbb]">🖼</div>
                    <span className="text-[7px] bg-[#f3f4f8] border border-[#dde] rounded px-1.5 py-0.5 text-[#666] font-semibold">
                      {i18n.language === 'ar' ? 'اختر ملف' : 'Choose File'}
                    </span>
                  </div>
                </div>

                {/* Color pickers */}
                <div>
                  <div className="text-[7.5px] text-[#555] font-bold mb-1.5">{i18n.language === 'ar' ? 'الألوان' : 'Colors'}</div>
                  <div className="flex gap-2">
                    {[
                      { label: i18n.language === 'ar' ? 'خلفية البطاقة' : 'Card BG', color: '#0f2540' },
                      { label: i18n.language === 'ar' ? 'لون الشريط' : 'Bar BG', color: '#1a3a5c' },
                      { label: i18n.language === 'ar' ? 'لون النص' : 'Text', color: '#FFFFFF' },
                    ].map((c, i) => (
                      <div key={i} className="flex flex-col items-center gap-0.5">
                        <div className="w-[20px] h-[20px] rounded-[4px] border border-[#ddd] shadow-sm" style={{ background: c.color }}></div>
                        <span className="text-[6px] text-[#999] font-semibold">{c.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next button */}
                <button className="self-start mt-auto text-[8px] font-extrabold text-white border-none rounded px-3 py-1.5 cursor-pointer transition-all hover:opacity-90" style={{
                  background: '#00CEC2',
                  boxShadow: '0 4px 12px rgba(0,206,194,.4)',
                }}>
                  {i18n.language === 'ar' ? 'حفظ ←' : 'Save →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};