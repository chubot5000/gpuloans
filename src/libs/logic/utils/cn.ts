import classNames from "classnames";
import { extendTailwindMerge } from "tailwind-merge";

type AdditionalClassGroupIDs = "typography" | "buttonSize" | "buttonVariant";

const customTwMerge = extendTailwindMerge<AdditionalClassGroupIDs>({
  extend: {
    classGroups: {
      typography: ["h1", "h2", "h3"],
      buttonSize: ["btn-normal", "btn-small", "btn-large"],
      buttonVariant: ["btn-primary", "btn-secondary", "btn-tertiary"],
    },
  },
});

export function cn(...args: classNames.ArgumentArray) {
  return customTwMerge(classNames(...args));
}
