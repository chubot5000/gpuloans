import { Footer, Navbar } from "logic/components";
import { TermOfService } from "logic/pages";
import { cn } from "logic/utils";

export default function page() {
  return (
    <div className={cn("overflow-hidden max-h-screen pt-(--nav-height)")}>
      <Navbar className="fixed inset-x-0 top-0 z-50 bg-white" isHomepage />
      <main
        className="flex flex-col overflow-y-auto w-full h-[calc(100vh-var(--nav-height))]"
        style={{ scrollbarGutter: "stable" }}
      >
        <div className="mx-auto w-full px-4 md:px-8 py-10 flex justify-center flex-1">
          <TermOfService />
        </div>
        <Footer />
      </main>
    </div>
  );
}
