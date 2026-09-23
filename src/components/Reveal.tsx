import { motion, type HTMLMotionProps } from 'motion/react';
import { ease, fadeUp, revealViewport as viewport, stagger } from '../lib/motion';

/** Fades its children up once they scroll into view. */
export function Reveal({ delay = 0, ...props }: HTMLMotionProps<'div'> & { delay?: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={{
        hidden: { opacity: 0, y: 12 },
        show: { opacity: 1, y: 0, transition: { duration: 0.45, delay, ease } },
      }}
      {...props}
    />
  );
}

/** Staggers its <RevealItem> children as the group scrolls into view. */
export function RevealGroup({ gap = 0.06, ...props }: HTMLMotionProps<'div'> & { gap?: number }) {
  return <motion.div initial="hidden" whileInView="show" viewport={viewport} variants={stagger(gap)} {...props} />;
}

export function RevealItem(props: HTMLMotionProps<'div'>) {
  return <motion.div variants={fadeUp} {...props} />;
}
