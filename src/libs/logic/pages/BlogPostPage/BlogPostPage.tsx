import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { PostContent } from "data/fetchers";

import { PostLayout } from "./PostLayout";

export function BlogPostPage(props: { post: PostContent }) {
  const { post } = props;

  return (
    <PostLayout post={post}>
      <BlocksRenderer blocks={{}} content={post.body} />
    </PostLayout>
  );
}
