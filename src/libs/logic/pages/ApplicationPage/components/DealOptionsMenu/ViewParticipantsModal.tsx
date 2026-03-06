"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Participant, removeParticipant } from "data/fetchers";
import { useConnectedEmail } from "logic/hooks/useConnectedEmail";
import { cn } from "logic/utils";
import { EllipsisVerticalIcon, MailIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { Button, Modal, Spinner } from "ui/components";

import { useApplication } from "../../ApplicationPageProvider";

import { AddParticipantModal } from "./AddParticipantModal";

interface ViewParticipantsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ViewParticipantsModal({ isOpen, onClose }: ViewParticipantsModalProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { dealId, participants, isLoadingParticipants } = useApplication();
  const connectedEmail = useConnectedEmail();

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
    queryClient.invalidateQueries({ queryKey: ["application-participants", dealId] });
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} className="sm:max-w-lg">
        <Modal.Title>Deal Participants</Modal.Title>
        <Modal.Children>
          <div className="flex flex-col gap-5 min-h-30">
            {isLoadingParticipants ? (
              <div className="flex items-center justify-center flex-1 py-8">
                <Spinner className="size-6 text-text-secondary" />
              </div>
            ) : (
              <>
                <p className="text-sm text-text-secondary">Each deal is allowed 3 participants.</p>

                <div className="flex flex-col gap-3">
                  {participants.map((participant) => (
                    <ParticipantCard
                      key={participant.id}
                      participant={participant}
                      isCurrentUser={
                        !!connectedEmail &&
                        !!participant.email &&
                        participant.email.toLowerCase() === connectedEmail.toLowerCase()
                      }
                    />
                  ))}

                  {participants.length < 3 && (
                    <Button
                      onClick={() => setIsAddModalOpen(true)}
                      className="btn-tertiary h-17 gap-2 border-dashed border-outline-minor text-sm"
                    >
                      <PlusIcon className="size-5" />
                      Add Another Participant
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </Modal.Children>
      </Modal>

      <AddParticipantModal isOpen={isAddModalOpen} onClose={handleAddModalClose} />
    </>
  );
}

interface ParticipantCardProps {
  participant: Participant;
  isCurrentUser: boolean;
}

function ParticipantCard({ participant, isCurrentUser }: ParticipantCardProps) {
  const { name, email } = participant;

  return (
    <div className="flex items-center gap-3 h-17 bg-bg-primary px-3 rounded-xs">
      <span className="flex size-8 shrink-0 items-center justify-center text-sm bg-bg-secondary">
        {name.charAt(0).toUpperCase()}
      </span>

      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <span className="text-sm text-text-primary capitalize">{name}</span>
        {email && (
          <div className="flex items-center gap-1 text-sm text-text-secondary">
            <MailIcon className="size-4 shrink-0" />
            <span className="truncate">{email}</span>
          </div>
        )}
      </div>

      {isCurrentUser ? (
        <span className="flex h-6 w-12 rounded-xs items-center justify-center bg-fill-secondary text-sm text-white shrink-0">
          me
        </span>
      ) : (
        <ParticipantMenu participant={participant} />
      )}
    </div>
  );
}

interface ParticipantMenuProps {
  participant: Participant;
}

function ParticipantMenu(props: ParticipantMenuProps) {
  const { participant } = props;
  const { dealId } = useApplication();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: () => removeParticipant(dealId, participant.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["application-participants", dealId] });
    },
  });

  return (
    <Menu as="div" className="relative shrink-0">
      <MenuButton
        type="button"
        className={cn(
          "flex size-9 items-center justify-center text-text-secondary transition-colors",
          "hover:bg-bg-secondary hover:text-text-primary data-active:bg-bg-secondary",
        )}
        aria-label="Participant options"
      >
        <EllipsisVerticalIcon className="size-5" />
      </MenuButton>

      <MenuItems
        anchor="bottom end"
        className={cn(
          "z-50 mt-1 min-w-[140px] origin-top-right bg-white py-1 shadow-lg",
          "border border-outline-major outline-none focus:outline-none",
          "transition duration-150 ease-out data-[closed]:scale-95 data-[closed]:opacity-0",
        )}
      >
        <MenuItem>
          {({ focus }) => (
            <button
              type="button"
              onClick={() => mutate()}
              className={cn(
                "flex w-full items-center justify-center gap-1.5 px-4 py-2 text-sm text-fill-primary transition-colors",
                focus && "bg-bg-primary",
              )}
            >
              <Trash2Icon className="size-4" />
              Remove
            </button>
          )}
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}
