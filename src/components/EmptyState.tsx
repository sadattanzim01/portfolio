import type { ReactNode } from 'react';

export function EmptyState({ icon, title, children }: { icon: ReactNode; title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-line px-6 py-16 text-center">
      <div className="grid size-12 place-items-center rounded-full border border-line bg-surface text-accent">{icon}</div>
      <h2 className="mt-5 text-lg font-medium">{title}</h2>
      {children && <div className="mt-2 max-w-md text-sm leading-relaxed text-muted">{children}</div>}
    </div>
  );
}
