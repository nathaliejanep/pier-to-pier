const Pier2PierIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" fill="none">
      {/* <!-- Network Nodes and Connections --> */}
      <g stroke="currentColor" strokeWidth="2">
        {/* <!-- Nodes --> */}
        <circle cx="16" cy="32" r="4" fill="#88c0d0" />
        <circle cx="32" cy="16" r="4" fill="#88c0d0" />
        <circle cx="48" cy="32" r="4" fill="#88c0d0" />
        <circle cx="32" cy="48" r="4" fill="#88c0d0" />
        {/* <!-- Connections --> */}
        <line x1="16" y1="32" x2="32" y2="16" strokeLinecap="round" />
        <line x1="32" y1="16" x2="48" y2="32" strokeLinecap="round" />
        <line x1="48" y1="32" x2="32" y2="48" strokeLinecap="round" />
        <line x1="32" y1="48" x2="16" y2="32" strokeLinecap="round" />
      </g>

      {/* <!-- Ship/Anchor Motif --> */}
      <g fill="#5e81ac">
        {/* <!-- Ship Body --> */}
        <path d="M24 44c0 2 4 6 8 6s8-4 8-6l-4-12h-8l-4 12z" />
        {/* <!-- Anchor --> */}
        <path d="M32 12c2 0 4 2 4 4v4h-8v-4c0-2 2-4 4-4z" />
      </g>

      {/* <!-- Decorative Waves --> */}
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
