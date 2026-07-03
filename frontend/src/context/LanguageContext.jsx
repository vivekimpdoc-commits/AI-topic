import React, { createContext, useContext, useState, useEffect } from 'react';
import translations from '../translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Check local storage for saved language or default to 'en'
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('up_police_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('up_police_lang', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === 'en' ? 'hi' : 'en'));
  };

  const t = (key) => {
    const keys = key.split('.');
    let current = translations[language];
    
    for (let i = 0; i < keys.length; i++) {
      if (current[keys[i]] === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key; // Fallback to key itself if not found
      }
      current = current[keys[i]];
    }
    
    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
