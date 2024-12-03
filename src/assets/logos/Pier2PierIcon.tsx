const Pier2PierIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" fill="none">
      {/* Chain Links */}
      <g stroke="currentColor" strokeWidth="2">
        <circle cx="16" cy="32" r="6" fill="#88c0d0" />
        <circle cx="32" cy="32" r="6" fill="#88c0d0" />
        <circle cx="48" cy="32" r="6" fill="#88c0d0" />
        <line x1="20" y1="32" x2="28" y2="32" strokeLinecap="round" />
        <line x1="36" y1="32" x2="44" y2="32" strokeLinecap="round" />
      </g>

      {/* Anchor/Port Motif */}
      <g fill="#5e81ac">
        <path d="M32 6c2 0 4 2 4 4v20h-8V10c0-2 2-4 4-4z" />
        <path d="M24 46c0-4 4-8 8-8s8 4 8 8c0 4-4 8-8 8s-8-4-8-8z" />
      </g>

      {/* Decorative Wave Base */}
      <path
        d="M12 54c4 0 4-4 8-4s4 4 8 4 4-4 8-4 4 4 8 4 4-4 8-4"
        stroke="#5e81ac"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Pier2PierIcon;
