import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faEnvelope, 
  faMapMarkerAlt, 
  faPhone,
  faBullseye,
  faStar,
  faRocket
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
    <footer style={{ background: 'linear-gradient(135deg, #1a1d35 0%, #2a3068 50%, #1a1d35 100%)' }} className="py-24 text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse 55% 70% at 80% 50%, rgba(0,206,194,.12) 0%, transparent 60%),
          radial-gradient(ellipse 35% 50% at 15% 30%, rgba(68,117,150,.1) 0%, transparent 55%)
        `
      }}></div>

      <div className="container mx-auto max-w-[1120px] px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-6">
              <div className="w-20 h-20 flex items-center justify-center">
                <img 
                  src={getLogo('website')} 
                  alt={t('header.logo')} 
                  className="h-16 w-auto"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              </div>
            </div>
            <p className="text-white/80 leading-relaxed mb-6 max-w-md text-lg">
              {t('footer.description')}
            </p>
            <Button 
              className="bg-white text-[#2a3068] hover:bg-white/90 rounded-full px-8 py-3 text-lg font-semibold shadow-lg"
            >
              {t('hero.requestDemo')}
            </Button>
            
            {/* Social Media */}
            <div className="mt-8">
              <h5 className="font-semibold mb-4 text-white/90">{t('footer.followUs')}</h5>
              <div className="flex gap-4">
                <a 
                  href="#" 
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <FontAwesomeIcon icon={faFacebookBrand} className="text-white" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <FontAwesomeIcon icon={faTwitterBrand} className="text-white" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <FontAwesomeIcon icon={faInstagramBrand} className="text-white" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <FontAwesomeIcon icon={faLinkedinBrand} className="text-white" />
                </a>
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-xl mb-6 text-white">{t('footer.quickLinks')}</h4>
            <ul className="space-y-4">
              <li>
                <a href="#features" className="text-white/70 hover:text-white transition-colors flex items-center gap-2 group">
                  <FontAwesomeIcon icon={faBullseye} className="w-4 h-4 group-hover:text-white" />
                  {t('navigation.features')}
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-white/70 hover:text-white transition-colors flex items-center gap-2 group">
                  <FontAwesomeIcon icon={faStar} className="w-4 h-4 group-hover:text-white" />
                  {t('navigation.pricing')}
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-white/70 hover:text-white transition-colors flex items-center gap-2 group">
                  <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 group-hover:text-white" />
                  {t('navigation.howItWorks')}
                </a>
              </li>
              <li>
                <a href="#about" className="text-white/70 hover:text-white transition-colors flex items-center gap-2 group">
                  <FontAwesomeIcon icon={faRocket} className="w-4 h-4 group-hover:text-white" />
                  {t('navigation.about')}
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-bold text-xl mb-6 text-white">{t('footer.contactUs')}</h4>
            <ul className="space-y-4 text-white/70">
              <li className="flex items-center gap-3 hover:text-white transition-colors">
                <FontAwesomeIcon icon={faWhatsappBrand} className="w-5 h-5 text-green-400" />
                <a 
                  href="https://wa.me/249111638872" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  +249 111 638 872
                </a>
              </li>
              <li className="flex items-center gap-3 hover:text-white transition-colors">
                <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5 text-blue-400" />
                <span>{t('footer.email')}</span>
              </li>
              <li className="flex items-center gap-3 hover:text-white transition-colors">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="w-5 h-5 text-red-400" />
                <span>{t('footer.address')}</span>
              </li>
              <li className="flex items-center gap-3 hover:text-white transition-colors">
                <FontAwesomeIcon icon={faPhone} className="w-5 h-5 text-yellow-400" />
                <span>{t('footer.phone')}</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-center md:text-right">
              {t('footer.copyright')}
            </p>
            <div className="flex gap-6 text-sm">
              <a href="/privacy-policy" className="text-white/60 hover:text-white transition-colors">
                {t('footer.privacyPolicy')}
              </a>
              <a href="/terms-of-service" className="text-white/60 hover:text-white transition-colors">
                {t('footer.termsOfService')}
              </a>
              <a href="/cookie-policy" className="text-white/60 hover:text-white transition-colors">
                {t('footer.cookiePolicy')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};