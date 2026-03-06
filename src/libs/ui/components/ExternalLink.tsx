import type { AnchorHTMLAttributes } from "react";

export type ExternalLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;

export function ExternalLink(props: ExternalLinkProps) {
  return <a rel="noopener noreferrer" target="_blank" {...props} />;
}
