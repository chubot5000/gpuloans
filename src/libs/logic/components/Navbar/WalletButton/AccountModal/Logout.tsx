import { usePrivyAccount } from "logic/components";
import { LogOutIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "ui/components";

export function Logout() {
  const { logout } = usePrivyAccount();

  const [isLoading, setIsLoading] = useState(false);

  async function onClick() {
    setIsLoading(true);
    await logout();
    setIsLoading(false);
  }

  return (
    <Button className="gap-2 btn-tertiary" isLoading={isLoading} onClick={onClick} type="button">
      <LogOutIcon className="size-4" /> <span>Logout</span>
    </Button>
  );
}
