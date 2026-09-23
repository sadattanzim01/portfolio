export function Tag({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-md border border-line bg-surface px-2 py-0.5 font-mono text-[11px] text-muted">
      {children}
    </span>
  );
}

export function TagList({ items, className = '' }: { items: string[]; className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-1.5 ${className}`} aria-label="Technologies">
      {items.map((item) => (
        <li key={item}>
          <Tag>{item}</Tag>
        </li>
      ))}
    </ul>
  );
}
