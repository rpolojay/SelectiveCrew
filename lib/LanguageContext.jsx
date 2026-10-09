'use client';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

const LanguageContext = createContext();
const STORAGE_KEY = 'language';
const isValidLang = (value) => value === 'en' || value === 'es';
// /remote-staffing targets U.S. businesses, so it defaults to English.
const defaultLangFor = (pathname) => (pathname?.startsWith('/remote-staffing') ? 'en' : 'es');

export function LanguageProvider({ children }) {
  // Server and first client render both use the route default (derived from
  // the pathname, known on both sides), so hydration matches; a stored
  // explicit choice is applied after mount.
  const pathname = usePathname();
  const routeDefault = defaultLangFor(pathname);
  const [lang, setLangState] = useState(routeDefault);
  const chosenRef = useRef(false);

  // Runs on mount, and again only when client-side navigation crosses into or
  // out of /remote-staffing. An explicit pick made this session always wins.
  useEffect(() => {
    if (chosenRef.current) return;
    let next = routeDefault;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isValidLang(stored)) next = stored;
    } catch {}
    setLangState(next);
  }, [routeDefault]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Explicit EN/ES selection: update state and remember it.
  const setLang = (value) => {
    if (!isValidLang(value)) return;
    chosenRef.current = true;
    setLangState(value);
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {}
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
