import { GraphQLClient } from 'graphql-request';

export class StrapiGraphQLClient extends GraphQLClient {
  constructor(tag?: string) {
    super(`${process.env.STRAPI_API_URL}/graphql`, {
      headers: { authorization: `Bearer ${process.env.STRAPI_API_KEY}` },
      next: tag
        ? {
            tags: [tag],
          }
        : undefined,
    });
  }
}
