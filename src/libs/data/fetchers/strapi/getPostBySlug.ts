import { type BlocksContent } from '@strapi/blocks-react-renderer';
import { gql } from 'graphql-request';
import { z } from 'zod';

import { StrapiGraphQLClient } from './client';

const postSchema = z.array(
  z.object({
    body: z.custom<BlocksContent>(),
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    createdAt: z.string().transform((value) => new Date(value)),
  })
);

export type PostContent = z.infer<typeof postSchema>[number];

export async function getPostBySlug(slug: string) {
  const query = gql`
    query ($slug: String!) {
      gpuloansPosts(filters: { slug: { eq: $slug } }) {
        body
        title
        description
        tags
        createdAt
      }
    }
  `;

  const response = await new StrapiGraphQLClient(slug).request(query, {
    slug,
  });

  const data = postSchema.parse(response.gpuloansPosts);

  if (data.length === 0) {
    return null;
  }
  return data[0];
}
