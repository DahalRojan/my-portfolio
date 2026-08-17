import { getCollection } from 'astro:content';
import { localePath, type Lang } from '../i18n/utils';

/**
 * Resolve the counterpart URL for the other language.
 *
 * Naively swapping the `/ne` prefix sends readers — and hreflang
 * crawlers — to a 404 whenever a piece hasn't been translated yet,
 * which on a piecemeal-translated site is most of them. For the two
 * collection-backed routes we check whether the counterpart entry
 * actually exists, and fall back to that section's index in the target
 * language when it doesn't.
 */
export async function altLangHref(pathname: string, lang: Lang): Promise<string> {
  const target: Lang = lang === 'en' ? 'ne' : 'en';
  const base = (lang === 'ne' ? pathname.replace(/^\/ne/, '') : pathname) || '/';
  const clean = base.replace(/\/$/, '') || '/';

  const match = clean.match(/^\/(writing|work)\/(.+)$/);
  if (match) {
    const [, collection, slug] = match;
    const entries = await getCollection(
      collection as 'writing' | 'work',
      ({ data }) => !data.draft
    );
    const translated = entries.some((entry) => entry.id === `${target}/${slug}`);
    return localePath(translated ? clean : `/${collection}`, target);
  }

  // The 404 page is emitted as /404.html, so a trailing-slash URL for it
  // doesn't resolve — send the switch to the home page instead.
  if (clean === '/404') return localePath('/', target);

  return localePath(clean, target);
}
