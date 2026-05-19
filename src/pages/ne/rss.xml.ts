import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { entrySlug, filterByLang } from '../../lib/content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const raw = await getCollection('writing', ({ data }) => !data.draft);
  const ne = filterByLang(raw, 'ne').sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  );
  const en = filterByLang(raw, 'en').sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  );

  // Feed = Nepali essays, plus pointers to English originals not yet translated.
  const items = [
    ...ne.map((post) => ({
      title: post.data.title,
      description: post.data.dek,
      pubDate: post.data.date,
      link: `/ne/writing/${entrySlug(post)}/`,
    })),
    ...en
      .filter((p) => !ne.some((n) => entrySlug(n) === entrySlug(p)))
      .map((post) => ({
        title: `${post.data.title} (in English)`,
        description: post.data.dek,
        pubDate: post.data.date,
        link: `/writing/${entrySlug(post)}/`,
      })),
  ];

  return rss({
    title: 'Rojan Dahal — लेखहरू',
    description:
      'उत्पादनस्तरको एमएल बनाउने बारेमा — एलएलएमभन्दा अघिका तहहरू, राउटिङ निर्णयहरू, र वास्तविक प्रणालीहरूका फिल्ड नोटहरू।',
    site: context.site!.toString(),
    items,
    customData: '<language>ne-NP</language>',
    stylesheet: '/rss/styles.xsl',
  });
}
