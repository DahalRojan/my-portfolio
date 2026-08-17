import type { CollectionEntry } from 'astro:content';

type Writing = CollectionEntry<'writing'>;

/** URL-safe form of a tag. Tags are already lowercase-hyphenated by
 *  convention, but don't trust the convention — normalise anyway. */
export function tagSlug(tag: string): string {
  return tag
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Posts related to `post`, ranked by shared tags then recency.
 *
 * If nothing shares a tag we fall back to the most recent other posts
 * rather than rendering an empty block — on a site this size, "nothing
 * related" is almost always a tagging gap, not a real signal.
 */
export function relatedPosts(post: Writing, all: Writing[], limit = 2): Writing[] {
  const own = new Set(post.data.tags.map(tagSlug));
  const others = all.filter((p) => p.id !== post.id);

  const scored = others
    .map((p) => ({
      post: p,
      shared: p.data.tags.filter((t) => own.has(tagSlug(t))).length,
    }))
    .sort(
      (a, b) =>
        b.shared - a.shared || b.post.data.date.getTime() - a.post.data.date.getTime()
    );

  const withOverlap = scored.filter((s) => s.shared > 0).map((s) => s.post);
  if (withOverlap.length >= limit) return withOverlap.slice(0, limit);

  const seen = new Set(withOverlap.map((p) => p.id));
  const filler = others
    .filter((p) => !seen.has(p.id))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return [...withOverlap, ...filler].slice(0, limit);
}

export interface Heading {
  depth: number;
  slug: string;
  text: string;
}

/**
 * Trim Astro's heading list down to what a table of contents should
 * show: h2 and h3 only. h1 is the page title and h4+ is detail the
 * reader is already inside by the time it matters.
 */
export function tocHeadings(headings: Heading[]): Heading[] {
  return headings.filter((h) => h.depth === 2 || h.depth === 3);
}
