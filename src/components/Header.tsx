import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { AnimatePresence, motion, useScroll } from 'motion/react';
import { site } from '../content/site';
import { NAV_ITEMS } from '../lib/nav';
import { useActiveSection } from '../lib/sections';
import { socials } from '../content/socials';
import { ExternalLink } from './ExternalLink';
import { CloseIcon, MenuIcon, ResumeIcon, SOCIAL_ICONS } from './icons';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();
  const section = useActiveSection();
  const { scrollYProgress } = useScroll();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      menuButtonRef.current?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const compact = scrolled && !open;

  return (
    <>
      {/* Reserves the full header height so shrinking the fixed bar never shifts the page. */}
      <div className="h-16" aria-hidden="true" />
      <header
        className={`fixed inset-x-0 top-0 z-40 border-b transition-colors duration-300 ${
          scrolled || open ? 'border-line bg-bg/80 backdrop-blur-xl' : 'border-transparent'
        }`}
      >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 transition-[height] duration-300 ease-out sm:px-6 ${
          compact ? 'h-13' : 'h-16'
        }`}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <Link to="/" className="group flex shrink-0 items-center gap-2.5">
            <span
              aria-hidden="true"
              className={`grid size-8 place-items-center rounded-lg bg-fg font-mono text-xs font-bold text-bg transition-[background-color,color,scale] duration-300 group-hover:bg-accent group-hover:text-accent-fg ${
                compact ? 'scale-[0.875]' : ''
              }`}
            >
              {site.initials}
            </span>
            {/* Visually hidden (not removed) where space is tight, so the link always has a name. */}
            <span className="sr-only font-medium tracking-tight sm:max-md:not-sr-only lg:not-sr-only">{site.name}</span>
          </Link>
          {/* Active-section indicator: which part of the page you're reading. */}
          <AnimatePresence mode="wait" initial={false}>
            {compact && section && (
              <motion.span
                key={section}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="truncate font-mono text-xs text-muted md:max-lg:hidden"
                aria-hidden="true"
              >
                <span className="text-accent">/</span> {section}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `relative block rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                      isActive ? 'text-fg' : 'text-muted hover:text-fg'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 -z-10 rounded-full bg-surface ring-1 ring-line"
                          transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                        />
                      )}
                      {item.label}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1 md:flex">
            {socials.map((s) => {
              const Icon = SOCIAL_ICONS[s.icon];
              return (
                <ExternalLink
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  title={s.label}
                  data-magnetic="0.45"
                  className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:text-accent"
                >
                  <Icon size={17} />
                </ExternalLink>
              );
            })}
            <ExternalLink href={site.resume} className="btn btn-ghost ml-1 !px-3.5 !py-1.5">
              <ResumeIcon size={15} /> Resume
            </ExternalLink>
          </div>
          <ThemeToggle />
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="grid size-9 place-items-center rounded-full border border-line text-muted md:hidden"
          >
            {open ? <CloseIcon size={16} /> : <MenuIcon size={16} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden md:hidden"
          >
            <ul className="flex flex-col px-4 pb-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center justify-between border-b border-line py-3.5 text-lg ${isActive ? 'text-accent' : 'text-fg'}`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2 px-4 pb-5 pt-3">
              <ExternalLink href={site.resume} className="btn btn-primary">
                <ResumeIcon size={15} /> Resume
              </ExternalLink>
              {socials.map((s) => {
                const Icon = SOCIAL_ICONS[s.icon];
                return (
                  <ExternalLink
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="grid size-10 place-items-center rounded-full border border-line text-muted"
                  >
                    <Icon size={17} />
                  </ExternalLink>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Reading progress along the bottom edge; driven by a motion value, no re-renders. */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className={`absolute inset-x-0 -bottom-px h-px origin-left bg-accent transition-opacity duration-300 ${
          compact ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      />
      </header>
    </>
  );
}
