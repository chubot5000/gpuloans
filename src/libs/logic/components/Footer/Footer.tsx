"use client";

import { useForm } from "@tanstack/react-form";
import { createPipedrivePerson } from "data/fetchers";
import { cn } from "logic/utils";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { Input, Spinner } from "ui/components";
import { z } from "zod";

const FOOTER_LINKS = [
  {
    title: "Get in touch",
    links: [
      { label: "Twitter", href: "https://x.com/USDai_Official" },
      { label: "LinkedIn", href: "https://www.linkedin.com/company/usd-ai" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "https://www.permianlabs.xyz/careers" },
    ],
  },
  {
    title: "Resources",
    links: [{ label: "Docs", href: "https://docs.usd.ai/" }],
  },
];

const schema = z.object({
  email: z.email("Invalid email address"),
});

export function Footer() {
  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: { onChange: schema },
    onSubmit: async ({ value }) => {
      try {
        await createPipedrivePerson({
          name: "[Newsletter_gpuloans]",
          emails: [{ value: value.email, primary: true }],
        });
      } catch (error) {
        console.error("Error creating Pipedrive person:", error);
        throw error;
      } finally {
        form.reset();
      }
    },
  });

  return (
    <footer
      className={cn("flex flex-col items-center gap-12 px-8 pt-20 pb-12 w-full justify-between", "bg-brown-900 h-fit")}
    >
      <div className="flex flex-col w-full max-w-9xl md:flex-row">
        <div className="flex flex-col flex-1 gap-10">
          <span className="text-3xl font-medium text-white font-eiko">Subscribe to our blog</span>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <form.Field name="email">
              {(field) => (
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  value={field.state.value}
                  onChange={(value) => field.handleChange(value)}
                  onBlur={field.handleBlur}
                  className={cn(
                    "border-0 border-b border-outline-major px-4 py-1.5 text-[#E7E5E4]",
                    "bg-[rgba(253,253,252,0.07)]",
                  )}
                  inputClassName="p-0 font-normal h-full placeholder:text-[#E7E5E4]"
                  placeholder="Your email address"
                  error={field.state.meta.errors[0]?.message}
                  showErrorLabel={false}
                  trailing={
                    <form.Subscribe selector={(state) => [!state.isPristine && state.canSubmit, state.isSubmitting]}>
                      {([canSubmit, isSubmitting]) => (
                        <button type="submit" aria-label="Submit email" disabled={!canSubmit || isSubmitting}>
                          {isSubmitting ? (
                            <Spinner className="text-white size-3.5" />
                          ) : (
                            <ChevronRightIcon className="text-[#E7E5E4] size-4" />
                          )}
                        </button>
                      )}
                    </form.Subscribe>
                  }
                />
              )}
            </form.Field>
          </form>

          <span className="text-sm text-outline-minor">
            Unlock fast, flexible capital for your GPU cluster, tailored specifically for AI HPC use cases.
          </span>
        </div>

        <div
          className={cn(
            "block border-t md:border-t-0 md:border-l border-[#6A655B]",
            "h-px w-full my-12 md:my-0 md:h-auto md:w-auto md:mx-8 lg:mx-24",
          )}
        />

        <div className="grid flex-1 grid-cols-1 gap-10 md:gap-2 md:grid-cols-3">
          {FOOTER_LINKS.map(({ title, links }, index) => (
            <div className="flex flex-col gap-4.5 md:gap-7" key={index}>
              <span className="text-lg font-medium text-white font-eiko">{title}</span>
              <div className="flex flex-row gap-8 md:gap-6 md:flex-col">
                {links.map((link, i) => (
                  <Link
                    href={link.href}
                    key={`${index}-${i}`}
                    className="font-light text-white hover:underline underline-offset-2.5"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full max-w-9xl">
        <span className="text-sm font-light text-white font-swiss">
          GPU Loans is a service operated by USD.AI Foundation, a Cayman Islands foundation company. Financing is
          facilitated through the USD.AI Protocol, a decentralized structured credit protocol. GPU Loans is not a bank,
          licensed lender, or broker-dealer. All financing arrangements are subject to eligibility requirements, due
          diligence, and protocol terms. Nothing on this website constitutes an offer to lend or a commitment to provide
          financing.
        </span>
      </div>

      <div className="flex flex-col gap-2 w-full max-w-9xl">
        <div className="flex flex-col gap-2 justify-between text-white md:flex-row font-polar">
          <div className="flex gap-5 divide-x divide-solid divide-brown-500 [&>*]:pr-5 h-fit">
            <span className="text-sm">Powered by USD.AI</span>
            <Link href="/terms" className="text-sm">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-sm">
              Privacy Policy
            </Link>
          </div>

          <a className="text-sm" href="mailto:hello@gpuloans.com">
            hello@gpuloans.com
          </a>
        </div>
      </div>
    </footer>
  );
}
