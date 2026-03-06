import { revalidateTag } from 'next/cache';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const data = await request.json();

  const slug: string | undefined = data?.entry?.slug;

  if (slug) {
    revalidateTag('blog');
    revalidateTag(slug);
    return Response.json({ revalidated: true, now: Date.now() });
  }

  return Response.json({
    revalidated: false,
    now: Date.now(),
    message: 'Missing path to revalidate',
  });
}
