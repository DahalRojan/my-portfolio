import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { entrySlug, filterByLang } from '../lib/content';

export async function GET(context: APIContext) {
  const posts = filterByLang(
    await getCollection('writing', ({ data }) => !data.draft),
    'en'
  ).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: 'Rojan Dahal — Writing',
    description:
      'Essays by Rojan Dahal on production ML, agents, retrieval, and the parts of building AI systems that aren’t modeling.',
    site: context.site!.toString(),
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.dek,
      pubDate: post.data.date,
      categories: post.data.tags,
      // entrySlug strips the `en/` locale prefix from the collection id.
      // Using post.id directly here produced /writing/en/<slug>/.
      link: `/writing/${entrySlug(post)}/`,
    })),
    customData: '<language>en-us</language>',
    stylesheet: '/rss/styles.xsl',
  });
}
