import type { Transition, Variants } from 'motion/react';

export const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Route change: the old page fades out fast, the new one fades/slides in.
 * Total ≈ 150ms + 300ms, well under 500ms.
 */
export const pageEnter: Transition = { duration: 0.3, ease };
export const pageExit: Transition = { duration: 0.15, ease: 'easeIn' };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
};

export const stagger = (gap = 0.05, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});

/** Scroll reveals fire just before an element is fully on screen, and only once. */
export const revealViewport = { once: true, amount: 0.15, margin: '0px 0px -40px 0px' } as const;
