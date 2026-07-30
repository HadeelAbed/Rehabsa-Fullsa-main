import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faEnvelope, 
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { 
  faWhatsapp as faWhatsappBrand,
  faFacebook as faFacebookBrand,
  faTwitter as faTwitterBrand,
  faInstagram as faInstagramBrand,
  faLinkedin as faLinkedinBrand
} from "@fortawesome/free-brands-svg-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";

export const Footer = () => {
  const { t } = useTranslation();
  const { getLogo } = useTheme();
  
  return (
    <footer style={{ background: 'linear-gradient(135deg, #1a1d35 0%, #2a3068 50%, #1a1d35 100%)' }} className="py-16 text-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse 55% 70% at 80% 50%, rgba(0,206,194,.12) 0%, transparent 60%),
          radial-gradient(ellipse 35% 50% at 15% 30%, rgba(68,117,150,.1) 0%, transparent 55%)
        `
      }}></div>

      <div className="container mx-auto max-w-[1120px] px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Logo & Description */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <img 
                src={getLogo('website')} 
                alt={t('header.logo')} 
                className="h-12 w-auto"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              {t('footer.description')}
            </p>
            {/* Social */}
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all hover:scale-110">
                <FontAwesomeIcon icon={faFacebookBrand} className="text-white text-sm" />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all hover:scale-110">
                <FontAwesomeIcon icon={faTwitterBrand} className="text-white text-sm" />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all hover:scale-110">
                <FontAwesomeIcon icon={faInstagramBrand} className="text-white text-sm" />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all hover:scale-110">
                <FontAwesomeIcon icon={faLinkedinBrand} className="text-white text-sm" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-base mb-5 text-white">{t('footer.quickLinks')}</h4>
            <ul className="space-y-3">
              <li><a href="/login" className="text-white/60 hover:text-white text-sm transition-colors">{t('footer.merchantLogin') || 'دخول التاجر'}</a></li>
              <li><a href="#industries" className="text-white/60 hover:text-white text-sm transition-colors">{t('footer.ourWork') || 'أعمالنا'}</a></li>
              <li><a href="#pricing" className="text-white/60 hover:text-white text-sm transition-colors">{t('navigation.pricing')}</a></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="font-bold text-base mb-5 text-white">{t('footer.policies') || 'اللوائح والسياسات'}</h4>
            <ul className="space-y-3">
              <li><a href="/terms-of-service" className="text-white/60 hover:text-white text-sm transition-colors">{t('footer.termsOfService')}</a></li>
              <li><a href="/privacy-policy" className="text-white/60 hover:text-white text-sm transition-colors">{t('footer.privacyPolicy')}</a></li>
              <li><a href="/cookie-policy" className="text-white/60 hover:text-white text-sm transition-colors">{t('footer.cookiePolicy')}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-base mb-5 text-white">{t('footer.contactUs')}</h4>
            <ul className="space-y-3 text-white/60">
              <li className="flex items-center gap-2.5 text-sm">
                <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 text-blue-400" />
                <span>{t('footer.email') || 'info@roaait.com'}</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm">
                <FontAwesomeIcon icon={faWhatsappBrand} className="w-4 h-4 text-green-400" />
                <a href="https://wa.me/966555332289" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  0555332289
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-sm">
                <FontAwesomeIcon icon={faPhone} className="w-4 h-4 text-yellow-400" />
                <span>{t('footer.phone') || '0553608481'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/10 text-center">
          <p className="text-white/50 text-xs">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};