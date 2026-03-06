import { PlusIcon } from "lucide-react";
import { Button, Spinner } from "ui/components";

interface AddNewButtonProps {
  searchTerm: string;
  isLoading: boolean;
  onClick: () => void;
}

export function AddNewButton(props: AddNewButtonProps) {
  const { searchTerm, isLoading, onClick } = props;

  return (
    <div className="flex flex-col gap-2 items-center">
      <div>No results found for &quot;{searchTerm}&quot;</div>
      <Button
        className="btn-primary flex items-center gap-1 px-3 py-2 text-sm !rounded-md"
        disabled={isLoading}
        onClick={onClick}
        type="button"
      >
        {isLoading ? (
          <>
            <Spinner className="size-4" />
            Adding...
          </>
        ) : (
          <>
            <PlusIcon className="size-4" />
            Add &quot;{searchTerm}&quot;
          </>
        )}
      </Button>
    </div>
  );
}
