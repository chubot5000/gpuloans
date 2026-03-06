import { PostContent } from "data/fetchers";
import dayjs from "dayjs";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";

import "ui/styles/post.css";

interface PostLayoutProps {
  children: React.ReactNode;
  post: PostContent;
}

export function PostLayout(props: PostLayoutProps) {
  const {
    children,
    post: { title, description, tags, createdAt },
  } = props;

  return (
    <main className="relative -mt-[72px] md:z-[10] flex w-full flex-1 flex-col items-center justify-center text-center md:-mt-[98px] text-black font-swiss bg-background">
      <div className="flex max-w-[728px] min-w-[280px] flex-col flex-wrap flex-1 gap-10 items-center p-4 py-28 marker:md:py-32 w-full min-h-screen max-md:justify-center">
        <PostTitle title={title} description={description} tags={tags} createdAt={createdAt} />
        <div id="post-content">{children}</div>
      </div>
    </main>
  );
}

function PostPath() {
  return (
    <div className="flex gap-1 justify-start items-center w-fit group text-brown-900">
      <Link href="/blog">
        <ChevronLeftIcon className="transition-all duration-300 size-6 text-brown-900 group-hover:text-brown-500" />
      </Link>
      <Link href="/blog" className="transition-all duration-300 group-hover:text-brown-500">
        Blog
      </Link>
    </div>
  );
}

interface PostTitleProps {
  title: string;
  description: string;
  tags: string[];
  createdAt: Date;
}

function PostTitle(props: PostTitleProps) {
  const { title, description, tags, createdAt } = props;

  return (
    <div className="flex flex-col gap-6 md:gap-8 items-start w-full text-brown-50">
      <PostPath />
      <div className="flex flex-col gap-3 md:gap-2 items-start">
        <h1 className="text-[40px]/none font-medium font-swiss text-brown-700 text-left">{title}</h1>
        <p className="text-base md:text-lg italic font-light text-brown-500 text-left">
          <span>{dayjs(createdAt).format("MMM D, YYYY")}</span>
          <span className="mx-2 style">|</span>
          {description}
        </p>
        <div className="flex gap-2 text-base italic font-light text-brown-500">
          {tags.map((tag, idx) => (
            <Fragment key={tag}>
              <span>{tag}</span>
              {idx < tags.length - 1 && <span className="mx-2">|</span>}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
