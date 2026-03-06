import { cn } from "logic/utils";
import { PlusIcon } from "lucide-react";
import { Button } from "ui/components";

interface CreateCustomButtonProps {
  searchTerm: string;
  onClick: () => void;
  fullWidth?: boolean;
}

export function CreateCustomButton(props: CreateCustomButtonProps) {
  const { searchTerm, onClick, fullWidth } = props;

  return (
    <Button
      className={cn("btn-primary px-4 py-3 justify-start !rounded-none", fullWidth && "w-full")}
      onClick={onClick}
      type="button"
      aria-label={`Create new custom value: ${searchTerm}`}
    >
      <PlusIcon className="mr-2 size-4" />
      Create &quot;{searchTerm}&quot;
    </Button>
  );
}
