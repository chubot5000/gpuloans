import { Layout } from "logic/components";
import type { Metadata } from "next";
import Image from "next/image";
import { PageWrapper } from "ui/components";

export const metadata: Metadata = {
  title: "Not Found",
};

export default function NotFound() {
  return (
    <Layout>
      <PageWrapper className="flex flex-col items-center justify-center gap-14 p-4 md:max-w-480 md:px-8 md:py-9">
        <Image alt="Not Found" draggable={false} height={197} src="/svg/not-found.svg" width={291} />
        <div className="flex flex-col items-center gap-5">
          <span className="text-xl text-primary">404 Error - Page Not Found.</span>
          <span className="text-center text-base text-text-secondary">
            The page you’re looking for does not exist or has been moved.
          </span>
        </div>
      </PageWrapper>
    </Layout>
  );
}
