"use client";

import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { useForm } from "@tanstack/react-form";
import { useNewLeadCreation } from "logic/hooks";
import { cn } from "logic/utils";
import { useRouter } from "next/navigation";
import { Button, Input } from "ui/components";
import { z } from "zod";

export function QuoteSimulator() {
  const { mutateAsync, isPending } = useNewLeadCreation();
  const router = useRouter();

  const form = useForm({
    defaultValues: { name: "", companyName: "", email: "" },
    onSubmit: async ({ value }) => {
      console.log(value);

      const result = await mutateAsync({
        fullName: value.name,
        workEmail: value.email,
        companyName: value.companyName,
      });

      if (result.dealId) {
        localStorage.setItem("name", value.name);
        localStorage.setItem("email", value.email);
        localStorage.setItem("companyName", value.companyName);

        router.push(`/contact?deal_id=${result.dealId}`);
      }
    },
    validators: {
      onSubmit: z.object({
        name: z.string().min(1),
        companyName: z.string().min(1),
        email: z.email(),
      }),
    },
  });

  return (
    <div className={cn("w-full max-w-[980px] border border-[#BEAB9A] p-2.5 md:p-3.5")}>
      <div className="px-5 py-6 bg-white shadow-md md:px-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] gap-5 lg:gap-7 items-end">
            <form.Field name="name">
              {(field) => (
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-light text-text-secondary">Name</label>
                  <Input
                    id="name"
                    name={field.name}
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                    onBlur={field.handleBlur}
                    className="border-0 border-b border-outline-major bg-bg-primary px-4 py-1.5 text-primary"
                    inputClassName="bg-bg-primary p-0 font-normal placeholder:opacity-60 h-full"
                    placeholder="John Doe"
                    error={field.state.meta.errors[0]?.message}
                    showErrorLabel={false}
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="companyName">
              {(field) => (
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-light text-text-secondary">Company Name</label>
                  <Input
                    id="company-name"
                    name={field.name}
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                    onBlur={field.handleBlur}
                    className="border-0 border-b border-outline-major bg-bg-primary px-4 py-1.5 text-primary"
                    inputClassName="bg-bg-primary p-0 font-normal placeholder:opacity-60 h-full"
                    placeholder="GPULoans"
                    error={field.state.meta.errors[0]?.message}
                    showErrorLabel={false}
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="email">
              {(field) => (
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-light text-text-secondary">Email</label>
                  <Input
                    id="email"
                    name={field.name}
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                    onBlur={field.handleBlur}
                    className="border-0 border-b border-outline-major bg-bg-primary px-4 py-1.5 text-primary"
                    inputClassName="bg-bg-primary p-0 font-normal placeholder:opacity-60 h-full"
                    placeholder="your@email.com"
                    error={field.state.meta.errors[0]?.message}
                    showErrorLabel={false}
                  />
                </div>
              )}
            </form.Field>

            <form.Subscribe>
              <Button
                type="submit"
                disabled={isPending}
                isLoading={isPending}
                className={cn(
                  "flex flex-row gap-2 justify-between items-center w-full lg:w-44 btn-primary",
                  "bg-[#2F2823]",
                )}
              >
                <div />
                Get a Quote
                <ChevronRightIcon className="size-4" />
              </Button>
            </form.Subscribe>
          </div>
        </form>
      </div>
    </div>
  );
}
