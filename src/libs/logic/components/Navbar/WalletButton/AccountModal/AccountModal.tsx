"use client";

import type { User } from "@privy-io/react-auth";
import { PrivyAccountProvider } from "logic/components";
import { Modal, type ModalBaseProps } from "ui/components";

import { EmailRow } from "./EmailRow";
import { Logout } from "./Logout";
import { WalletRows } from "./WalletRows";

type Props = ModalBaseProps & { user: User };

export function AccountModal(props: Props) {
  const { user, ...rest } = props;

  return (
    <PrivyAccountProvider user={user}>
      <Modal {...rest}>
        <Modal.Title>Account</Modal.Title>
        <Modal.Children className="w-160 max-w-full gap-8 text-base">
          <div className="flex flex-col gap-2">
            <span className="text-base font-medium">Email</span>
            <EmailRow />
          </div>
          <WalletRows />
          <Logout />
        </Modal.Children>
      </Modal>
    </PrivyAccountProvider>
  );
}
