import { memo, useEffect, useRef, useSyncExternalStore } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

/**
 * Custom cursor: a dot that tracks the pointer exactly and a ring that trails it on a spring.
 *
 * Hover behaviour is driven by the element under the pointer:
 * - `data-cursor="view"` (optionally `data-cursor-label="…"`): large accent ring with a label
 * - links, buttons, tabs: ring grows and inverts what's beneath it (mix-blend-mode: difference)
 * - `<p>` or `data-cursor="text"`: ring becomes a text caret sized to the line height
 * - `data-magnetic` (optionally `="0.4"` for strength): the element leans toward the pointer
 *
 * Everything runs through motion values and direct DOM writes (data attributes / CSS variables),
 * so pointer movement never re-renders React. Mounted once in Layout, outside the page
 * transition, so it survives route changes untouched.
 *
 * Disabled on touch / coarse pointers and with prefers-reduced-motion; the native cursor is used instead.
 */

const ENABLED_QUERY = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';
const ACTIVE_CLASS = 'has-custom-cursor';
const INTERACTIVE = 'a, button, [role="button"], [role="tab"], label, summary, select';
const SPRING = { stiffness: 380, damping: 32, mass: 0.55 };

type Mode = 'default' | 'link' | 'view' | 'text';

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(ENABLED_QUERY);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}

function useCursorEnabled() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(ENABLED_QUERY).matches,
    () => false,
  );
}

function resolveMode(el: Element | null): { mode: Mode; target: HTMLElement | null } {
  if (!el) return { mode: 'default', target: null };
  const view = el.closest<HTMLElement>('[data-cursor="view"]');
  if (view) return { mode: 'view', target: view };
  const interactive = el.closest<HTMLElement>(INTERACTIVE);
  if (interactive) return { mode: 'link', target: interactive };
  const text = el.closest<HTMLElement>('[data-cursor="text"], p');
  if (text) return { mode: 'text', target: text };
  return { mode: 'default', target: null };
}

function lineHeightOf(el: HTMLElement) {
  const style = getComputedStyle(el);
  const lh = parseFloat(style.lineHeight);
  return Number.isFinite(lh) ? lh : parseFloat(style.fontSize) * 1.4;
}

function CursorImpl() {
  const rootRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  // Dot: exact pointer position.
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  // Ring: springs toward a target (usually the pointer, pulled toward magnetic elements' centres).
  const targetX = useMotionValue(-100);
  const targetY = useMotionValue(-100);
  const ringX = useSpring(targetX, SPRING);
  const ringY = useSpring(targetY, SPRING);

  useEffect(() => {
    const root = rootRef.current!;
    const html = document.documentElement;

    let visible = false;
    let lastTarget: Element | null = null;
    let mode: Mode = 'default';
    let pointer = { x: -100, y: -100 };

    let magnet: HTMLElement | null = null;
    let magnetRect: DOMRect | null = null;

    let recheckFrame = 0;
    const timers = new Set<number>();

    const setMode = (next: Mode, target: HTMLElement | null) => {
      if (next === 'text' && target) root.style.setProperty('--caret-h', `${Math.round(lineHeightOf(target))}px`);
      if (next === 'view' && target && labelRef.current) {
        labelRef.current.textContent = target.dataset.cursorLabel ?? 'View';
      }
      if (next !== mode) {
        mode = next;
        root.dataset.mode = next;
      }
      // Match the palette of the surface under the pointer (e.g. the inverted bands on the home page).
      const onInvert = Boolean(lastTarget?.closest('.theme-invert'));
      root.classList.toggle('theme-invert', onInvert);
    };

    const releaseMagnet = () => {
      if (magnet) magnet.style.transform = '';
      magnet = null;
      magnetRect = null;
    };

    const updateMagnet = (el: Element | null) => {
      const next = el?.closest<HTMLElement>('[data-magnetic]') ?? null;
      if (next !== magnet) {
        releaseMagnet();
        if (next) {
          magnet = next;
          // Measure once on entry, before we move it, so the offset doesn't feed back into itself.
          magnetRect = next.getBoundingClientRect();
        }
      }

      if (!magnet || !magnetRect) {
        targetX.set(pointer.x);
        targetY.set(pointer.y);
        return;
      }

      const strength = Number(magnet.dataset.magnetic) || 0.3;
      const cx = magnetRect.left + magnetRect.width / 2;
      const cy = magnetRect.top + magnetRect.height / 2;
      const dx = (pointer.x - cx) * strength;
      const dy = (pointer.y - cy) * strength;
      magnet.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      // The ring hugs the (moving) element instead of the raw pointer.
      targetX.set(cx + dx * 1.25);
      targetY.set(cy + dy * 1.25);
    };

    const evaluate = (el: Element | null) => {
      lastTarget = el;
      const { mode: next, target } = resolveMode(el);
      setMode(next, target);
      updateMagnet(el);
    };

    const show = () => {
      if (visible) return;
      visible = true;
      root.dataset.visible = 'true';
    };

    const hide = () => {
      visible = false;
      root.dataset.visible = 'false';
      releaseMagnet();
    };

    /** Re-read the element under the (stationary) pointer after scrolls and page transitions. */
    const recheck = () => {
      cancelAnimationFrame(recheckFrame);
      recheckFrame = requestAnimationFrame(() => {
        if (!visible) return;
        releaseMagnet();
        evaluate(document.elementFromPoint(pointer.x, pointer.y));
      });
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') {
        hide();
        return;
      }
      pointer = { x: e.clientX, y: e.clientY };
      x.set(pointer.x);
      y.set(pointer.y);

      if (!visible) {
        // Jump (don't spring) in from off-screen on first appearance.
        targetX.jump(pointer.x);
        targetY.jump(pointer.y);
        ringX.jump(pointer.x);
        ringY.jump(pointer.y);
        html.classList.add(ACTIVE_CLASS);
        show();
      }

      const el = e.target as Element | null;
      if (el !== lastTarget) evaluate(el);
      else updateMagnet(el);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') root.dataset.pressed = 'true';
    };
    const onPointerUp = () => {
      root.dataset.pressed = 'false';
    };

    const onClick = () => {
      // Route changes swap the DOM under a still pointer; re-check once the transition settles.
      for (const delay of [60, 420, 800]) {
        const id = window.setTimeout(() => {
          timers.delete(id);
          recheck();
        }, delay);
        timers.add(id);
      }
    };

    const onLeave = (e: MouseEvent) => {
      if (!e.relatedTarget) hide();
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('scroll', recheck, { passive: true });
    window.addEventListener('click', onClick, { passive: true });
    window.addEventListener('popstate', onClick);
    window.addEventListener('blur', hide);
    document.addEventListener('mouseout', onLeave);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('scroll', recheck);
      window.removeEventListener('click', onClick);
      window.removeEventListener('popstate', onClick);
      window.removeEventListener('blur', hide);
      document.removeEventListener('mouseout', onLeave);
      cancelAnimationFrame(recheckFrame);
      timers.forEach((id) => window.clearTimeout(id));
      releaseMagnet();
      html.classList.remove(ACTIVE_CLASS);
    };
  }, [x, y, targetX, targetY, ringX, ringY]);

  return (
    <div ref={rootRef} className="cursor-root" data-mode="default" data-visible="false" aria-hidden="true">
      <motion.div className="cursor-ring-wrap" style={{ x: ringX, y: ringY }}>
        <div className="cursor-ring">
          <span ref={labelRef} className="cursor-label">
            View
          </span>
        </div>
      </motion.div>
      <motion.div className="cursor-dot-wrap" style={{ x, y }}>
        <div className="cursor-dot" />
      </motion.div>
    </div>
  );
}

export const Cursor = memo(function Cursor() {
  const enabled = useCursorEnabled();
  return enabled ? <CursorImpl /> : null;
});
