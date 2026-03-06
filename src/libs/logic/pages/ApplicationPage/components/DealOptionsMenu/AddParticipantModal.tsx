"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addParticipant, searchPersonByEmail, type AddParticipant } from "data/fetchers/pipedrive";
import { useDebounceCallback } from "logic/hooks/useDebounceCallback";
import { cn } from "logic/utils";
import { FormEvent, useCallback, useState } from "react";
import { Button, Input, Modal, Spinner } from "ui/components";
import { z } from "zod";

import { useApplication } from "../../ApplicationPageProvider";

interface AddParticipantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const formSchema = z.object({
  email: z.email("Please enter a valid email address"),
  name: z.string().min(1, "Name is required"),
});

type PersonSearch =
  | { status: "idle" }
  | { status: "searching" }
  | { status: "done"; personId: number | null; personName: string | null };

const IDLE_SEARCH: PersonSearch = { status: "idle" };

export function AddParticipantModal({ isOpen, onClose }: AddParticipantModalProps) {
  const [search, setSearch] = useState<PersonSearch>(IDLE_SEARCH);

  const queryClient = useQueryClient();
  const { dealId, dealDetail } = useApplication();

  const addMutation = useMutation({
    mutationFn: (data: AddParticipant) => addParticipant(dealId, data, dealDetail.org_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["application-participants", dealId] });
      reset();
      setSearch(IDLE_SEARCH);
      onClose();
    },
    onError: () => {
      console.error("Failed to add participant. Please try again.");
    },
  });

  const searchMutation = useMutation({
    mutationFn: (email: string) => searchPersonByEmail(email.trim()),
    onMutate: () => setSearch({ status: "searching" }),
    onSuccess: (result) => {
      const personId = result.exists ? (result.personId ?? null) : null;
      const personName = result.exists ? (result.name ?? null) : null;
      setSearch({ status: "done", personId, personName });
      setFieldValue("name", personName ?? "");
    },
    onError: () => setSearch({ status: "done", personId: null, personName: null }),
  });

  const { Field, Subscribe, reset, setFieldValue, handleSubmit } = useForm({
    defaultValues: { email: "", name: "" },
    validators: { onChange: formSchema },
    onSubmit: ({ value }) => {
      const existingPerson = search.status === "done" && search.personId !== null ? search : null;
      const finalName = existingPerson?.personName ?? value.name.trim();

      addMutation.mutate({
        email: value.email.trim(),
        name: finalName,
        existingPersonId: existingPerson?.personId ?? undefined,
      });
    },
  });

  const triggerSearch = useCallback(
    (email: string) => {
      if (formSchema.shape.email.safeParse(email.trim()).success) searchMutation.mutate(email);
    },
    [searchMutation],
  );

  const debouncedSearch = useDebounceCallback(triggerSearch, 500);

  const isSearching = search.status === "searching";
  const nameDisabled = search.status !== "done" || search.personId !== null;

  const handleClose = () => {
    reset();
    setSearch(IDLE_SEARCH);
    onClose();
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleSubmit();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="sm:max-w-lg">
      <Modal.Title>Deal Participants</Modal.Title>
      <Modal.Children>
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-8">
          <Field name="email">
            {(field) => (
              <div className="flex flex-col gap-3">
                <label htmlFor={field.name} className="text-sm text-text-secondary">
                  Email Address
                </label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  value={field.state.value}
                  onChange={(value) => {
                    field.handleChange(value);
                    setSearch(IDLE_SEARCH);
                    setFieldValue("name", "");

                    if (formSchema.shape.email.safeParse(value.trim()).success) debouncedSearch(value);
                    else debouncedSearch.cancel();
                  }}
                  onBlur={() => {
                    field.handleBlur();
                    if (search.status === "idle") {
                      debouncedSearch.cancel();
                      triggerSearch(field.state.value);
                    }
                  }}
                  showErrorLabel={false}
                  trailing={isSearching ? <Spinner className="size-4 mr-3 text-text-secondary" /> : undefined}
                  className="border-0 border-b border-outline-major bg-bg-primary px-4 py-1.5 text-primary"
                  inputClassName="bg-bg-primary p-0 font-normal placeholder:opacity-60 h-full"
                />
              </div>
            )}
          </Field>

          <Field name="name">
            {(field) => (
              <div className="flex flex-col gap-3">
                <label htmlFor={field.name} className="text-sm text-text-secondary">
                  Full Name
                </label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  value={field.state.value}
                  onChange={(value) => field.handleChange(value)}
                  disabled={nameDisabled}
                  showErrorLabel={false}
                  className={cn(
                    "border-0 border-b border-outline-major bg-bg-primary px-4 py-1.5 text-primary",
                    nameDisabled && "!bg-bg-primary",
                  )}
                  inputClassName="bg-bg-primary p-0 font-normal placeholder:opacity-60 h-full"
                />
              </div>
            )}
          </Field>

          <Subscribe selector={(state) => [state.isDirty, state.canSubmit, state.isSubmitting]}>
            {([isDirty, canSubmit, isSubmitting]) => (
              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  isLoading={isSubmitting || addMutation.isPending}
                  disabled={!isDirty || !canSubmit || isSubmitting || isSearching}
                  className="w-full btn-large btn-primary-light"
                >
                  Add Participant
                </Button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn btn-normal text-base border-0 bg-transparent text-text-secondary w-full"
                >
                  Cancel
                </button>
              </div>
            )}
          </Subscribe>
        </form>
      </Modal.Children>
    </Modal>
  );
}
