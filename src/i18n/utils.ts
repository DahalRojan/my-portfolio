import { ui, defaultLang, type Lang } from './ui';

/** Detect locale from pathname. /ne or /ne/... is Nepali; everything else is English. */
export function getLangFromUrl(url: URL): Lang {
  const seg = url.pathname.split('/').filter(Boolean)[0];
  if (seg === 'ne') return 'ne';
  return defaultLang;
}

/** Translator. Falls back to English if a key is missing in the target locale. */
export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]): string {
    return ui[lang][key as string] ?? ui[defaultLang][key as string] ?? (key as string);
  };
}

/** Build an absolute path for a given language. */
export function localePath(path: string, lang: Lang): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (lang === defaultLang) return clean;
  return clean === '/' ? '/ne/' : `/ne${clean}`;
}

export type { Lang } from './ui';
