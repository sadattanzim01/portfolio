import { useEffect, useState } from 'react';
import { useLocation, useOutlet } from 'react-router';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { applyMeta, getMeta, NOT_FOUND_META } from '../lib/meta';
import { pageEnter, pageExit } from '../lib/motion';
import { Cursor } from './Cursor';
import { Footer } from './Footer';
import { Header } from './Header';

let lastPath: string | null = null;

/** Keeps the outgoing page rendered while it animates out. */
function FrozenOutlet() {
  const outlet = useOutlet();
  const [frozen] = useState(outlet);
  const { pathname } = useLocation();

  // After an in-app navigation, move focus to the new page so keyboard and screen-reader
  // users start at its content (the new document.title is announced with it).
  useEffect(() => {
    if (lastPath !== null && lastPath !== pathname) {
      document.getElementById('main')?.focus({ preventScroll: true });
    }
    lastPath = pathname;
    // Runs once per page instance: each route change mounts a new FrozenOutlet.
  }, []);

  return frozen;
}

export function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    applyMeta(getMeta(pathname) ?? NOT_FOUND_META);
  }, [pathname]);

  return (
    <MotionConfig reducedMotion="user">
      <Cursor />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-fg focus:px-3 focus:py-2 focus:text-bg"
      >
        Skip to content
      </a>
      <div className="flex min-h-dvh flex-col">
        <Header />
        {/* initial={false}: no page-level fade on first load, so content paints immediately. */}
        <AnimatePresence
          mode="wait"
          initial={false}
          onExitComplete={() => window.scrollTo({ top: 0, behavior: 'instant' })}
        >
          <motion.main
            id="main"
            tabIndex={-1}
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: pageEnter }}
            exit={{ opacity: 0, transition: pageExit }}
            className="flex-1 focus:outline-none"
          >
            <FrozenOutlet />
          </motion.main>
        </AnimatePresence>
        <Footer />
      </div>
    </MotionConfig>
  );
}

