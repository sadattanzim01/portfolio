export function Tag({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-chip bg-surface px-2 py-0.5 text-xs text-muted ring-1 ring-line ring-inset">
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
