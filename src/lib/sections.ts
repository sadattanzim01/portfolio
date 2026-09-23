import { useEffect, useRef, useSyncExternalStore } from 'react';

/**
 * Tracks which labelled page section is under the sticky header.
 *
 * Pages call useSection('Label') and attach the returned ref to a section element.
 * The header reads the active label with useActiveSection(). Scroll handling is
 * rAF-throttled and subscribers only hear about changes to the active label, so
 * scrolling doesn't re-render anything until the section actually changes.
 */

const sections = new Map<HTMLElement, string>();
const listeners = new Set<() => void>();
let active: string | null = null;
let frame = 0;

/** A section becomes active once its top passes this line (px from the viewport top). */
const activationLine = () => Math.min(160, window.innerHeight * 0.3);

function compute() {
  frame = 0;
  const line = activationLine();
  let next: string | null = null;
  let bestTop = -Infinity;

  for (const [el, label] of sections) {
    const top = el.getBoundingClientRect().top;
    if (top <= line && top > bestTop) {
      bestTop = top;
      next = label;
    }
  }

  // At the very bottom, the last section may never reach the line; treat it as active.
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
  if (atBottom && sections.size > 0) {
    let lastTop = -Infinity;
    for (const [el, label] of sections) {
      const top = el.getBoundingClientRect().top;
      if (top > lastTop && top < window.innerHeight) {
        lastTop = top;
        next = label;
      }
    }
  }

  if (next !== active) {
    active = next;
    listeners.forEach((l) => l());
  }
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(compute);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
  }
  schedule();
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    }
  };
}

export function useActiveSection(): string | null {
  return useSyncExternalStore(
    subscribe,
    () => active,
    () => null,
  );
}

/** Registers the element as a named section for the header indicator. */
export function useSection<T extends HTMLElement = HTMLElement>(label: string) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    sections.set(el, label);
    schedule();
    return () => {
      sections.delete(el);
      schedule();
    };
  }, [label]);
  return ref;
}
