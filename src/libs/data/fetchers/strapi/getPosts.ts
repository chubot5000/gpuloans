import { gql } from 'graphql-request';
import { z } from 'zod';

import { StrapiGraphQLClient } from './client';

export const postSchema = z.object({
  slug: z.string(),
  description: z.string(),
  documentId: z.string(),
  title: z.string(),
  tags: z.array(z.string()),
  createdAt: z.string().transform((value) => new Date(value)),
  cover: z
    .object({
      url: z.string(),
    })
    .transform(
      ({ url }) => `${process.env.STRAPI_API_URL?.includes('localhost') ? process.env.STRAPI_API_URL : ''}${url}`
    ),
});

export const postsSchema = z.array(postSchema);

export type Post = z.infer<typeof postSchema>;

export async function getPosts() {
  const query = gql`
    query {
      gpuloansPosts(sort: "createdAt:desc") {
        slug
        description
        documentId
        title
        createdAt
        tags
        cover {
          url
        }
      }
    }
  `;

  const response = await new StrapiGraphQLClient('blog').request(query);

  return postsSchema.parse(response.gpuloansPosts);
}
