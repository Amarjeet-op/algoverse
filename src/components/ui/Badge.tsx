interface BadgeProps {
  label: string;
  value: string;
}

export function Badge({ label, value }: BadgeProps) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-mono bg-gray-100 dark:bg-gray-800 text-[var(--color-muted)]">
      <span className="font-semibold">{label}:</span> {value}
    </span>
  );
}
