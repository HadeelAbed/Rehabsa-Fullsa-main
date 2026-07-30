import { useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export const useDirection = () => {
  const { i18n } = useTranslation();

  const getLang = useCallback(() => {
    return i18n.resolvedLanguage || i18n.language || localStorage.getItem('i18nextLng') || 'en';
  }, [i18n]);

  useEffect(() => {
    const lang = getLang();
    const isRTL = lang === 'ar';

    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;

    if (isRTL) {
      document.body.classList.add('rtl');
      document.body.classList.remove('ltr');
    } else {
      document.body.classList.add('ltr');
      document.body.classList.remove('rtl');
    }
  }, [i18n.language, i18n.resolvedLanguage, getLang]);

  const lang = getLang();

  return {
    isRTL: lang === 'ar',
    language: lang,
    changeLanguage: (lng: string) => {
      localStorage.setItem('i18nextLng', lng);
      i18n.changeLanguage(lng);
    },
  };
};
