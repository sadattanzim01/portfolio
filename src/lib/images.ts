import type { Project } from '../content/types.ts';

/** Rendered widths, so the browser picks the 800w or 1600w file (see scripts/generate-project-images.py). */
export const CARD_SIZES = '(min-width: 1024px) 352px, (min-width: 768px) calc(50vw - 44px), calc(100vw - 32px)';
export const HERO_SIZES = '(min-width: 1152px) 1104px, calc(100vw - 32px)';

export function srcSetOf(image: Project['image']): string | undefined {
  return image.small ? `${image.small} 800w, ${image.src} 1600w` : undefined;
}
