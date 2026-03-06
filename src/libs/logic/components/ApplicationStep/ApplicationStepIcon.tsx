import {
  DocumentTextIcon,
  GlobeAltIcon,
  LinkIcon,
  PhoneIcon,
  SquaresPlusIcon,
  TableCellsIcon,
} from "@heroicons/react/24/outline";
import { cn } from "logic/utils";
import { ReactNode } from "react";

import { TaskType } from "./ApplicationStep";

interface ApplicationStepIconsProps {
  type: TaskType;
  className?: string;
  iconClassName?: string;
}
export function ApplicationStepIcons(props: ApplicationStepIconsProps) {
  const { type, className, iconClassName } = props;

  const iconClassname = cn("size-4", iconClassName);

  const icons: Record<TaskType, ReactNode> = {
    CALL: <PhoneIcon className={iconClassname} />,
    LINK: <LinkIcon className={iconClassname} />,
    DOC: <DocumentTextIcon className={iconClassname} />,
    FORM: <TableCellsIcon className={iconClassname} />,
    NETWORK: <GlobeAltIcon className={iconClassname} />,
    APP: <SquaresPlusIcon className={iconClassname} />,
  };

  return <div className={cn("p-2", className)}>{icons[type]}</div>;
}
