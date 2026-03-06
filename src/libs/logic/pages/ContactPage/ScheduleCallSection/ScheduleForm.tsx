"use client";

import { useForm } from "@tanstack/react-form";
import { useNewLeadCreation, useSearchParamsMutation } from "logic/hooks";
import { Button, Input } from "ui/components";
import z from "zod";

const scheduleFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  companyName: z.string().min(1, "Company name is required"),
});

export type ScheduleFormData = z.infer<typeof scheduleFormSchema>;

export function ScheduleForm() {
  const { mutateAsync, isPending } = useNewLeadCreation();
  const sp = useSearchParamsMutation();

  const form = useForm({
    defaultValues: { name: "", companyName: "", email: "" },
    validators: { onSubmit: scheduleFormSchema },
    onSubmit: async ({ value }) => {
      console.log(value);

      const result = await mutateAsync({
        fullName: value.name,
        workEmail: value.email,
        companyName: value.companyName,
      });

      if (result.dealId) {
        sp.set("deal_id", result.dealId.toString());

        localStorage.setItem("name", value.name);
        localStorage.setItem("email", value.email);
        localStorage.setItem("companyName", value.companyName);
      }
    },
  });

  return (
    <div className="flex flex-col gap-8 w-full max-w-xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="flex flex-col gap-6"
      >
        <form.Field name="name">
          {(field) => (
            <div className="flex flex-col gap-2">
              <label htmlFor={field.name} className="text-sm font-light text-text-secondary">
                Full Name
              </label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onChange={(value) => field.handleChange(value)}
                placeholder="John Doe"
                className="border-0 border-b border-outline-major bg-bg-primary px-4 py-1.5 text-primary"
                inputClassName="bg-bg-primary p-0 font-normal placeholder:opacity-60 h-full"
                error={field.state.meta.errors[0]?.message}
                showErrorLabel={false}
              />
            </div>
          )}
        </form.Field>

        <form.Field name="companyName">
          {(field) => (
            <div className="flex flex-col gap-2">
              <label htmlFor={field.name} className="text-sm font-light text-text-secondary">
                Company Name
              </label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onChange={(value) => field.handleChange(value)}
                placeholder="GPULoans"
                className="border-0 border-b border-outline-major bg-bg-primary px-4 py-1.5 text-primary"
                inputClassName="bg-bg-primary p-0 font-normal placeholder:opacity-60 h-full"
                error={field.state.meta.errors[0]?.message}
                showErrorLabel={false}
              />
            </div>
          )}
        </form.Field>

        <form.Field name="email">
          {(field) => (
            <div className="flex flex-col gap-2">
              <label htmlFor={field.name} className="text-sm font-light text-text-secondary">
                Email Address
              </label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onChange={(value) => field.handleChange(value)}
                placeholder="your@email.com"
                className="border-0 border-b border-outline-major bg-bg-primary px-4 py-1.5 text-primary"
                inputClassName="bg-bg-primary p-0 font-normal placeholder:opacity-60 h-full"
                error={field.state.meta.errors[0]?.message}
                showErrorLabel={false}
              />
            </div>
          )}
        </form.Field>

        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              isLoading={isSubmitting || isPending}
              className="py-3 mt-4 text-lg btn-large md:max-w-xs btn-primary"
            >
              Schedule a Call
            </Button>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
}
