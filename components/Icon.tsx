export function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const p = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "bold":
      return (
        <svg {...p} strokeWidth={2.4}>
          <path d="M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z" />
        </svg>
      );
    case "italic":
      return (
        <svg {...p}>
          <path d="M19 5h-9M14 19H5M15 5l-6 14" />
        </svg>
      );
    case "underline":
      return (
        <svg {...p}>
          <path d="M7 4v6a5 5 0 0 0 10 0V4M5 20h14" />
        </svg>
      );
    case "strike":
      return (
        <svg {...p}>
          <path d="M5 12h14M8 8a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3M16 16a3 3 0 0 1-3 3h-2a3 3 0 0 1-3-3" />
        </svg>
      );
    case "h1":
      return (
        <svg {...p}>
          <path d="M4 6v12M12 6v12M4 12h8M17 18v-8l-2 1.5" />
        </svg>
      );
    case "h2":
      return (
        <svg {...p}>
          <path d="M4 6v12M11 6v12M4 12h7M15 10a2 2 0 1 1 4 0c0 1.5-4 3.5-4 8h4" />
        </svg>
      );
    case "h3":
      return (
        <svg {...p}>
          <path d="M4 6v12M11 6v12M4 12h7M15 9a2 2 0 1 1 2.8 1.8A2 2 0 1 1 16 15" />
        </svg>
      );
    case "p":
      return (
        <svg {...p}>
          <path d="M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12v7" />
        </svg>
      );
    case "ul":
      return (
        <svg {...p}>
          <path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01" strokeWidth={2.4} />
        </svg>
      );
    case "ol":
      return (
        <svg {...p}>
          <path d="M10 6h10M10 12h10M10 18h10M4 5h1v3M4 11h2l-2 3h2M4 17h2l-1 1.5L4 20h2" />
        </svg>
      );
    case "quote":
      return (
        <svg {...p}>
          <path d="M8 7H5.5A2.5 2.5 0 0 0 3 9.5V13a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3M8 7v3a4 4 0 0 1-2 3.5M20 7h-2.5A2.5 2.5 0 0 0 15 9.5V13a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3M20 7v3a4 4 0 0 1-2 3.5" />
        </svg>
      );
    case "code":
      return (
        <svg {...p}>
          <path d="M8 8l-4 4 4 4M16 8l4 4-4 4M14 5l-4 14" />
        </svg>
      );
    case "pre":
      return (
        <svg {...p}>
          <path d="M3 5h18v14H3zM7 10l-2 2 2 2M13 10l2 2-2 2" />
        </svg>
      );
    case "link":
      return (
        <svg {...p}>
          <path d="M10 13a4 4 0 0 0 5.7.4l3-3a4 4 0 0 0-5.7-5.7l-1.2 1.2M14 11a4 4 0 0 0-5.7-.4l-3 3a4 4 0 0 0 5.7 5.7l1.2-1.2" />
        </svg>
      );
    case "image":
      return (
        <svg {...p}>
          <path d="M3 5h18v14H3z" />
          <circle cx="8.5" cy="9.5" r="1.5" />
          <path d="M21 16l-5-5-6 6-2-2-5 4" />
        </svg>
      );
    case "table":
      return (
        <svg {...p}>
          <path d="M3 5h18v14H3zM3 10h18M3 14.5h18M9.5 10v9M15 10v9" />
        </svg>
      );
    case "hr":
      return (
        <svg {...p}>
          <path d="M4 12h16" />
        </svg>
      );
    case "alignLeft":
      return (
        <svg {...p}>
          <path d="M4 6h16M4 10h10M4 14h16M4 18h10" />
        </svg>
      );
    case "alignCenter":
      return (
        <svg {...p}>
          <path d="M4 6h16M7 10h10M4 14h16M7 18h10" />
        </svg>
      );
    case "alignRight":
      return (
        <svg {...p}>
          <path d="M4 6h16M10 10h10M4 14h16M10 18h10" />
        </svg>
      );
    case "undo":
      return (
        <svg {...p}>
          <path d="M4 8h11a5 5 0 0 1 0 10H9M4 8l4-4M4 8l4 4" />
        </svg>
      );
    case "redo":
      return (
        <svg {...p}>
          <path d="M20 8H9a5 5 0 0 0 0 10h6M20 8l-4-4M20 8l-4 4" />
        </svg>
      );
    case "clear":
      return (
        <svg {...p}>
          <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13M10 11v6M14 11v6" />
        </svg>
      );
    case "omega":
      return (
        <svg {...p}>
          <path d="M6 8h12M6 16h12M9 8c0 5 6 5 6 8M15 8c0 5-6 5-6 8" />
        </svg>
      );
    case "symbols":
      return (
        <svg {...p}>
          <path d="M4 20L9 6l5 14M6 15h7M15 10l5 10M16 20h4" />
        </svg>
      );
    case "chevron":
      return (
        <svg {...p}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      );
    case "eye":
      return (
        <svg {...p}>
          <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" />
          <circle cx="12" cy="12" r="2.8" />
        </svg>
      );
    case "save":
      return (
        <svg {...p}>
          <path d="M5 3h11l3 3v15H5zM8 3v6h7V3M8 21v-6h8v6" />
        </svg>
      );
    case "expand":
      return (
        <svg {...p}>
          <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
        </svg>
      );
    default:
      return null;
  }
}
