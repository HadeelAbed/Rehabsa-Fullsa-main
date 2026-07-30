import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTheme } from "@/hooks/useTheme";
import { useDirection } from "@/hooks/useDirection";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const navigate = useNavigate();
  const location = useLocation();
  const { getLogo } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSectionNavigation = (sectionId: string) => {
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
    setIsMenuOpen(false);
  };

  const navLinks = [
    { key: 'features', section: 'features' },
    { key: 'pricing', section: 'pricing' },
    { key: 'tutorial', section: 'tutorial' },
    { key: 'industries', section: 'industries' },
    { key: 'contact', section: 'contact' },
  ];

  return (
    <nav className={`fixed top-2.5 left-1/2 -translate-x-1/2 z-[1000] w-fit transition-shadow duration-300 ${
      scrolled ? 'shadow-[0_4px_24px_rgba(0,0,0,.09)]' : ''
    }`}
      style={{
        background: 'rgba(255,255,255,.92)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0,206,194,.2)',
        borderRadius: '16px',
        padding: '8px 20px',
      }}
    >
      <div className="flex items-center gap-2.5 whitespace-nowrap">
        {/* Logo */}
        <div className="flex-shrink-0">
          <img src={getLogo('website')} alt={t('header.logo')} className="h-[38px] w-auto block" />
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-[2px] flex-shrink-0">
          {navLinks.map((link) =>
            link.type === 'link' ? (
              <Link
                key={link.key}
                to={link.to!}
                className="text-sm font-medium px-3 py-1.5 rounded-full transition-colors hover:bg-muted no-underline text-foreground"
              >
                {t(`navigation.${link.key}`)}
              </Link>
            ) : (
              <button
                key={link.key}
                onClick={() => handleSectionNavigation(link.section!)}
                className="text-sm font-medium px-3 py-1.5 rounded-full transition-colors hover:bg-muted border-none cursor-pointer text-foreground"
              >
                {t(`navigation.${link.key}`)}
              </button>
            )
          )}
        </div>

        {/* Login + Lang + CTA */}
        <div className="hidden md:flex items-center gap-2">
          <LanguageSwitcher />
          <Link
            to="/login"
            className="text-sm font-semibold px-3.5 py-1.5 rounded-full border border-border no-underline transition-all hover:border-primary hover:text-secondary flex-shrink-0 text-foreground"
          >
            {t('navigation.login')}
          </Link>
          <Link
            to="/register"
            className="text-sm font-extrabold px-4 py-1.5 rounded-full no-underline transition-all hover:-translate-y-0.5 flex-shrink-0"
            style={{
              background: '#00CEC2',
              color: '#fff',
              boxShadow: '0 2px 8px rgba(0,206,194,.35)',
            }}
          >
            {t('navigation.startNow') || 'ابدأ الآن'}
          </Link>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden border-none bg-transparent cursor-pointer p-1" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden pt-3 pb-2 flex flex-col gap-1.5 border-t border-border mt-2.5">
          {navLinks.map((link) =>
            link.type === 'link' ? (
              <Link
                key={link.key}
                to={link.to!}
                className="py-2 text-sm font-medium no-underline hover:text-secondary text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                {t(`navigation.${link.key}`)}
              </Link>
            ) : (
              <button
                key={link.key}
                onClick={() => handleSectionNavigation(link.section!)}
                className={`py-2 text-sm font-medium ${isRTL ? 'text-right' : 'text-left'} border-none bg-transparent cursor-pointer hover:text-secondary text-foreground`}
              >
                {t(`navigation.${link.key}`)}
              </button>
            )
          )}
          <div className="flex items-center gap-2 pt-2 border-t border-border mt-1">
            <LanguageSwitcher />
            <Link
              to="/login"
              className="text-sm font-semibold px-3.5 py-1.5 rounded-full border border-border no-underline text-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('navigation.login')}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};