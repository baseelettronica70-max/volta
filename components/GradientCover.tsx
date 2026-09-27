interface GradientCoverProps {
  slug: string;
  title?: string;
  className?: string;
}

export default function GradientCover({ slug, title, className = "" }: GradientCoverProps) {
  const hash = Array.from(slug).reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const gradIndex = hash % 8;

  return (
    <div className={`cover-gradient-${gradIndex} rounded-xl flex items-center justify-center ${className}`}>
      <div className="text-white/90 opacity-90">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
      </div>
      {title && (
        <span className="absolute bottom-3 left-4 text-white/90 text-xs font-medium truncate max-w-[80%]">
          {title}
        </span>
      )}
    </div>
  );
}
