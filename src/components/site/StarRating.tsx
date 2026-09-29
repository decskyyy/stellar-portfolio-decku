type Props = {
  value: number;
  size?: number;
  showLabel?: boolean;
};

function Star({ filled, size }: { filled: boolean; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2.6l2.65 6.03 6.55.56-4.96 4.3 1.49 6.41L12 16.5l-5.73 3.4 1.49-6.41-4.96-4.3 6.55-.56L12 2.6z"
        fill={filled ? '#FBBF24' : 'none'}
        stroke={filled ? '#FDE68A' : 'rgba(148,163,184,0.4)'}
        strokeWidth="1.2"
        strokeLinejoin="round"
        style={filled ? { filter: 'drop-shadow(0 0 4px rgba(251,191,36,0.55))' } : undefined}
      />
    </svg>
  );
}

/** Indikator rating bintang emas 1–5. */
export default function StarRating({ value, size = 16, showLabel = false }: Props) {
  const safe = Math.max(1, Math.min(5, Math.round(value || 0)));

  return (
    <div className="flex items-center gap-1.5" role="img" aria-label={`Rating ${safe} dari 5`}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} filled={i <= safe} size={size} />
        ))}
      </div>
      {showLabel && <span className="font-body text-xs font-semibold text-gold">{safe}.0</span>}
    </div>
  );
}
