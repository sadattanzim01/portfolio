import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { fadeUp, stagger } from '../lib/motion';

export function PageHeader({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <motion.header initial="hidden" animate="show" variants={stagger(0.05)} className="max-w-3xl pb-12 pt-10 sm:pb-16 sm:pt-16">
      <motion.p variants={fadeUp} className="eyebrow">
        <span className="text-accent">/</span> {eyebrow}
      </motion.p>
      <motion.h1 variants={fadeUp} className="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
        {title}
      </motion.h1>
      {children && (
        <motion.div variants={fadeUp} className="mt-5 max-w-2xl text-lg leading-relaxed text-muted text-pretty">
          {children}
        </motion.div>
      )}
    </motion.header>
  );
}
