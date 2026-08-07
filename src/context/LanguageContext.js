'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    welcome: 'Welcome back',
    availableBalance: 'Available Balance',
    requestFunds: 'Request Funds',
    viewStatement: 'View Statement',
    recentTransactions: 'Recent Transactions',
    mobileRecharge: 'Mobile Recharge',
    dthRecharge: 'DTH Recharge',
    billPayment: 'Bill Payment',
    moneyTransfer: 'Money Transfer',
    aeps: 'AEPS Banking',
    ledgerStatement: 'Ledger Statement',
    helpdesk: 'Helpdesk 24x7',
  },
  hi: {
    welcome: 'स्वागत है',
    availableBalance: 'उपलब्ध शेष राशि',
    requestFunds: 'फंड अनुरोध करें',
    viewStatement: 'स्टेटमेंट देखें',
    recentTransactions: 'हाल के लेनदेन',
    mobileRecharge: 'मोबाइल रीचार्ज',
    dthRecharge: 'डीटीएच रीचार्ज',
    billPayment: 'बिल भुगतान',
    moneyTransfer: 'मनी ट्रांसफर',
    aeps: 'एईपीएस बैंकिंग',
    ledgerStatement: 'बहीखाता विवरण',
    helpdesk: 'सहायता केंद्र 24x7',
  },
  hinglish: {
    welcome: 'Welcome back',
    availableBalance: 'Available Balance (कुल राशि)',
    requestFunds: 'Fund Request Karo',
    viewStatement: 'Statement Dekho',
    recentTransactions: 'Recent Transactions',
    mobileRecharge: 'Mobile Recharge',
    dthRecharge: 'DTH Recharge',
    billPayment: 'Bill Payment',
    moneyTransfer: 'Money Transfer',
    aeps: 'AEPS Fingerprint Banking',
    ledgerStatement: 'Ledger Statement',
    helpdesk: 'Help Line 24x7',
  },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem('unipay-lang');
    if (saved && translations[saved]) {
      setLang(saved);
    }
  }, []);

  const changeLanguage = (newLang) => {
    if (translations[newLang]) {
      setLang(newLang);
      localStorage.setItem('unipay-lang', newLang);
    }
  };

  const t = (key) => translations[lang]?.[key] || translations.en[key] || key;

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext) || { lang: 'en', changeLanguage: () => {}, t: (k) => k };
}
