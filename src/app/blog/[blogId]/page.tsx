export const dynamic = "force-dynamic";

import { getPostBySlug } from "data/fetchers";
import { Footer, Navbar } from "logic/components";
import { BlogPostPage } from "logic/pages";
import { siteConfig } from "logic/utils";
import { Metadata } from "next";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ blogId: string }>;
}

export default async function page({ params }: PageProps) {
  const { blogId } = await params;
  const post = await getPostBySlug(blogId);

  if (post == null) redirect("/404");

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    url: `${siteConfig.url}/blog/${blogId}`,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.createdAt.toISOString(),
    author: { "@type": "Organization", name: "GPULoans" },
    publisher: {
      "@type": "Organization",
      name: "GPULoans",
      logo: { "@type": "ImageObject", url: `${siteConfig.url}/svg/gpu-loans-logo.svg` },
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <div className="flex flex-col items-center min-h-screen pt-[var(--nav-height)]">
        <Navbar className="fixed inset-x-0 top-0 z-50 bg-white" isHomepage />
        <BlogPostPage post={post} />
        <Footer />
      </div>
    </>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { blogId } = await params;
  const post = await getPostBySlug(blogId);

  if (!post) {
    return {
      title: "Blog Post",
      description: "GPULoans Blog",
    };
  }

  return {
    title: `${post.title}`,
    description: post.description || "Read this article on GPULoans Blog",
    alternates: {
      canonical: `/blog/${blogId}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.createdAt.toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}
