import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'sv' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  sv: {
    // Navigation
    home: 'Hem',
    modules: 'Moduler',
    resources: 'Resurser',
    profile: 'Profil',
    contact: 'Kontakt',
    signIn: 'Logga in',
    signOut: 'Logga ut',
    
    // Hero section
    heroTitle: 'Bemästra Napoleon Hills Rikedomsplan',
    heroSubtitle: 'Få originalboken plus Napoleon Hill i din ficka',
    heroDescription: 'Lär dig de 13 principerna för framgång genom den mest kompletta kursen baserad på "Tänk och Bli Rik".',
    getStarted: 'Kom igång',
    
    // Features
    feature1Title: '13 Framgångsmoduler',
    feature1Description: 'Strukturerad genomgång av varje kapitel',
    feature2Title: 'Professionell utbildningsvärde',
    feature2Description: 'Livstids tillgång till allt material',
    feature3Title: 'Komplett transformation',
    feature3Description: 'Från kunskap till praktisk tillämpning',
    
    // FAQ
    faqTitle: 'Vanliga frågor',
    faqSubtitle: 'Svar på de vanligaste frågorna om KongMindset-kursen',
    
    // Contact
    contactTitle: 'Kontakta oss',
    contactSubtitle: 'Har du frågor? Vi hjälper dig gärna!',
    email: 'E-post',
    message: 'Meddelande',
    sendMessage: 'Skicka meddelande',
    
    // Auth
    emailAddress: 'E-postadress',
    password: 'Lösenord',
    confirmPassword: 'Bekräfta lösenord',
    createAccount: 'Skapa konto',
    alreadyHaveAccount: 'Har du redan ett konto?',
    
    // Footer
    footerDescription: 'Transformera ditt tänkesätt och bygga rikedom med Napoleon Hills tidlösa principer.',
    quickLinks: 'Snabblänkar',
    contactInfo: 'Kontaktinformation',
    followUs: 'Följ oss',
    
    // Currency and pricing
    price: '299 kr',
    originalPrice: '599 kr',
    
    // Course content
    moduleProgress: 'Modulframsteg',
    completedModules: 'Slutförda moduler',
    totalModules: 'Totalt antal moduler',
    
    // Success messages
    welcomeMessage: 'Välkommen till KongMindset!',
    courseAccess: 'Du har nu full tillgång till kursen.',
    startLearning: 'Börja lära dig',
    
    // FAQ Categories
    faqCategoryCourse: 'Kurs',
    faqCategoryPayment: 'Betalning',
    faqCategoryTechnical: 'Teknisk',
    faqCategoryResults: 'Resultat',
  },
  en: {
    // Navigation
    home: 'Home',
    modules: 'Modules',
    resources: 'Resources',
    profile: 'Profile',
    contact: 'Contact',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    
    // Hero section
    heroTitle: 'Master Napoleon Hill\'s Wealth Blueprint',
    heroSubtitle: 'Get The Original Book Plus Napoleon Hill In Your Pocket',
    heroDescription: 'Learn the 13 principles of success through the most complete course based on "Think and Grow Rich".',
    getStarted: 'Get Started',
    
    // Features
    feature1Title: '13 Success Modules',
    feature1Description: 'Structured walkthrough of each chapter',
    feature2Title: 'Professional Training Value',
    feature2Description: 'Lifetime access to all materials',
    feature3Title: 'Complete Transformation',
    feature3Description: 'From knowledge to practical application',
    
    // FAQ
    faqTitle: 'Frequently Asked Questions',
    faqSubtitle: 'Find answers to the most common questions about the KongMindset course',
    
    // Contact
    contactTitle: 'Contact Us',
    contactSubtitle: 'Have questions? We\'re here to help!',
    email: 'Email',
    message: 'Message',
    sendMessage: 'Send Message',
    
    // Auth
    emailAddress: 'Email Address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    createAccount: 'Create Account',
    alreadyHaveAccount: 'Already have an account?',
    
    // Footer
    footerDescription: 'Transform your mindset and build wealth with Napoleon Hill\'s timeless principles.',
    quickLinks: 'Quick Links',
    contactInfo: 'Contact Information',
    followUs: 'Follow Us',
    
    // Currency and pricing
    price: '$29.99',
    originalPrice: '$59.99',
    
    // Course content
    moduleProgress: 'Module Progress',
    completedModules: 'Completed Modules',
    totalModules: 'Total Modules',
    
    // Success messages
    welcomeMessage: 'Welcome to KongMindset!',
    courseAccess: 'You now have full access to the course.',
    startLearning: 'Start Learning',
    
    // FAQ Categories
    faqCategoryCourse: 'Course',
    faqCategoryPayment: 'Payment',
    faqCategoryTechnical: 'Technical',
    faqCategoryResults: 'Results',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'sv';
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang === 'sv' ? 'sv-SE' : 'en-US';
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['sv']] || key;
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage: handleSetLanguage,
      t
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}