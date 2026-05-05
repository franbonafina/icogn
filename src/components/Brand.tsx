type BrandProps = {
  compact?: boolean;
};

export function Brand({ compact = false }: BrandProps) {
  return (
    <div className="flex items-center gap-3">
      <img
        alt="inucogn"
        className="h-9 w-9 rounded-2xl"
        height="36"
        src="/logo.svg"
        width="36"
      />
      {!compact ? (
        <div className="space-y-0.5">
          <p className="text-xs uppercase tracking-[0.3em] text-textMuted">inucogn</p>
          <p className="text-sm font-medium text-text">Focus-driven cognition</p>
        </div>
      ) : null}
    </div>
  );
}
