interface SectionHeaderProps {
  index: string;
  title: string;
  subtitle?: string;
}

export function SectionHeader({ index, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="text-3xl font-bold text-ink/10 sm:text-4xl" aria-hidden="true">
        {index}
      </span>
      <div>
        <h2 className="text-lg font-semibold text-ink sm:text-xl">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
      </div>
    </div>
  );
}
