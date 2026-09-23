import type { AnchorHTMLAttributes } from 'react';

/** Opens in a new tab with safe rel attributes. */
export function ExternalLink(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a target="_blank" rel="noopener noreferrer" {...props} />;
}
