import type { CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/utils';

/**
 * Content collection IDs follow `<lang>/<slug>` (e.g. `en/the-gatekeeper-pattern`).
 * Extract the locale and the route-facing slug for an entry.
 */
export function parseEntryId(id: string): { lang: Lang; slug: string } {
  const [maybeLang, ...rest] = id.split('/');
  if (maybeLang === 'en' || maybeLang === 'ne') {
    return { lang: maybeLang, slug: rest.join('/') };
  }
  // No locale prefix — treat as English at the root.
  return { lang: 'en', slug: id };
}

export function entryLang(entry: { id: string }): Lang {
  return parseEntryId(entry.id).lang;
}

export function entrySlug(entry: { id: string }): string {
  return parseEntryId(entry.id).slug;
}

export function filterByLang<T extends { id: string }>(
  entries: T[],
  lang: Lang
): T[] {
  return entries.filter((e) => entryLang(e) === lang);
}

export function bySlug<T extends { id: string }>(entries: T[]): Map<string, T> {
  const m = new Map<string, T>();
  for (const e of entries) m.set(entrySlug(e), e);
  return m;
}

export type WritingEntry = CollectionEntry<'writing'>;
export type WorkEntry = CollectionEntry<'work'>;
