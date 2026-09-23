import type { MouseEvent } from 'react';

/** onMouseMove handler that feeds the .spotlight glow its cursor position. */
export function trackSpotlight(event: MouseEvent<HTMLElement>) {
  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${event.clientX - rect.left}px`);
  el.style.setProperty('--my', `${event.clientY - rect.top}px`);
}
