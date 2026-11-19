import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { fadeUp, stagger } from '../lib/motion';

/** Page title + supporting line. The nav already names the page, so there's no extra label above the title. */
export function PageHeader({ title, children }: { title: ReactNode; children?: ReactNode }) {
  return (
    <motion.header initial="hidden" animate="show" variants={stagger(0.05)} className="max-w-3xl pb-12 pt-12 sm:pb-16 sm:pt-20">
      <motion.h1 variants={fadeUp} className="text-title max-w-[18ch]">
        {title}
      </motion.h1>
      {children && (
        <motion.div variants={fadeUp} className="text-lead mt-5 max-w-2xl">
          {children}
        </motion.div>
      )}
    </motion.header>
  );
}
