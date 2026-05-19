import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('writing', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  );

  return rss({
    title: 'Rojan Dahal — Writing',
    description:
      'Essays by Rojan Dahal on production ML, agents, retrieval, and the parts of building AI systems that aren’t modeling.',
    site: context.site!.toString(),
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.dek,
      pubDate: post.data.date,
      link: `/writing/${post.id}/`,
    })),
    customData: '<language>en-us</language>',
    stylesheet: '/rss/styles.xsl',
  });
}
