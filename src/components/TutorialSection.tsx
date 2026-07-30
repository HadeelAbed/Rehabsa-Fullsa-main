import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";

export const TutorialSection = () => {
  const { t, i18n } = useTranslation();
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
          <div className="flex items-center gap-1.5 px-3.5 py-2" style={{ background: '#e8e9f0', borderBottom: '1px solid #d4d5de' }}>
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f57' }}></div>
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#febc2e' }}></div>
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#28c840' }}></div>
            <div className="flex-1 mx-2.5 bg-white rounded-[6px] px-2.5 py-0.5 text-[9px] text-[#888] font-mono border border-[#ddd] text-center" style={{ direction: 'ltr' }}>
              app.rehabsa.com/dashboard
            </div>
          </div>

          {/* Animated dashboard preview */}
          <a
            href="https://www.youtube.com/watch?v=jzik577DRvQ"
            target="_blank"
            rel="noopener noreferrer"
            className="block relative aspect-video group cursor-pointer overflow-hidden"
            style={{ background: '#0a0c1a' }}
          >
            {/* Animated dashboard simulation */}
            <div className="w-full h-full flex items-center justify-center p-6" style={{ background: 'linear-gradient(135deg, #0a0c1a 0%, #1a1d35 50%, #2a3068 100%)' }}>
              <div className="w-full max-w-[500px] rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,.5)] border border-white/10">
                {/* Mini titlebar */}
                <div className="flex items-center gap-1 px-3 py-1.5" style={{ background: '#e8e9f0' }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: '#ff5f57' }}></span>
                  <span className="w-2 h-2 rounded-full" style={{ background: '#febc2e' }}></span>
                  <span className="w-2 h-2 rounded-full" style={{ background: '#28c840' }}></span>
                  <span className="text-[7px] text-[#888] font-mono mx-auto">cards/edit/1</span>
                </div>
                {/* Mini body */}
                <div className="flex" style={{ background: '#f5f6fa', minHeight: 180 }}>
                  {/* Left - phone preview */}
                  <div className="flex-1 flex items-center justify-center p-3" style={{ borderRight: '1px solid #e8e9f0' }}>
                    <div className="bg-[#111] rounded-[14px] p-[4px_3px_6px] shadow-[0_8px_24px_rgba(0,0,0,.3)]" style={{ width: 100 }}>
                      <div className="w-[24px] h-[3px] bg-[#333] rounded mx-auto mb-1"></div>
                      <div className="rounded-[8px] overflow-hidden flex flex-col" style={{ background: 'linear-gradient(135deg, #0f2540, #1a3a5c)', minHeight: 130 }}>
                        <div className="flex items-center gap-1.5 px-2 pt-2 pb-0.5">
                          <div className="w-[16px] h-[16px] rounded-full bg-white/20 flex items-center justify-center text-[6px] text-white font-black">R</div>
                          <div>
                            <div className="text-[4px] text-white/50">{i18n.language === 'ar' ? 'بطاقة ولاء' : 'Card'}</div>
                            <div className="text-[5px] text-white font-bold">{i18n.language === 'ar' ? 'المذاق' : 'Shop'}</div>
                          </div>
                        </div>
                        <div className="mx-2 my-1 rounded-[4px] flex items-center justify-center gap-0.5 py-1" style={{ background: 'rgba(255,255,255,.1)' }}>
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} width="10" height="16" viewBox="0 0 24 36"><path d="M12 4L14 14L12 24L4 14Z" fill="#FFD700" opacity={i < 2 ? 1 : 0.15}/></svg>
                          ))}
                        </div>
                        <div className="px-2 pb-1 mt-auto flex items-center justify-between">
                          <div className="w-[16px] h-[16px] bg-white rounded p-[1px]"><svg viewBox="0 0 24 24"><rect x="2" y="2" width="6" height="6" fill="#111"/><rect x="14" y="2" width="6" height="6" fill="#333"/></svg></div>
                          <div className="text-[3px] text-white/60">#RH-1842</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Right - form fields */}
                  <div className="w-[140px] p-2.5 flex flex-col gap-1.5">
                    <div className="text-[6px] font-bold px-1.5 py-0.5 text-white rounded" style={{ background: '#00CEC2', width: 'fit-content' }}>
                      {i18n.language === 'ar' ? 'تصميم' : 'Design'}
                    </div>
                    <div>
                      <div className="text-[5px] text-[#555] font-bold mb-0.5">{i18n.language === 'ar' ? 'الشعار' : 'Logo'} *</div>
                      <div className="flex items-center gap-1">
                        <div className="w-[16px] h-[16px] rounded bg-[#f0ebe4] border border-[#ddd] flex items-center justify-center text-[5px] text-[#bbb]">↑</div>
                        <span className="text-[5px] bg-[#f3f4f8] border border-[#dde] rounded px-1 py-0.5 text-[#666]">{i18n.language === 'ar' ? 'اختر' : 'Choose'}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[5px] text-[#555] font-bold mb-0.5">{i18n.language === 'ar' ? 'الألوان' : 'Colors'}</div>
                      <div className="flex gap-1">
                        {['#0f2540','#1a3a5c','#fff'].map((c, i) => (
                          <div key={i} className="w-[12px] h-[12px] rounded border border-[#ddd]" style={{ background: c }}></div>
                        ))}
                      </div>
                    </div>
                    <div className="text-[5px] text-[#888] mt-auto">{i18n.language === 'ar' ? 'معاينة مباشرة' : 'Live preview'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Play overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(0,0,0,.5)' }}>
              <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(0,206,194,.5)] group-hover:scale-110 transition-all" style={{ background: '#00CEC2' }}>
                <svg className={`w-7 h-7 text-white ${isRTL ? 'mr-0.5' : 'ml-0.5'}`} fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </div>
              <span className="text-sm font-bold text-white px-4 py-1.5 rounded-full backdrop-blur" style={{ background: 'rgba(0,0,0,.55)' }}>
                ▶ {t('tutorial.watchLabel') || 'شرح المنصة كاملاً'}
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};