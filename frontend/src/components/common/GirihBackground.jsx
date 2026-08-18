export default function GirihBackground() {
  return (
    <svg
      className="fixed inset-0 w-full h-full pointer-events-none opacity-[0.05] z-0"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern id="girih" width="80" height="80" patternUnits="userSpaceOnUse">
          <g stroke="#D4AF37" strokeWidth="1" fill="none">
            {/* 8-pointed star lattice unit */}
            <polygon points="40,10 46,30 66,30 50,42 56,62 40,50 24,62 30,42 14,30 34,30" />
            <circle cx="40" cy="40" r="38" strokeOpacity="0.4" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#girih)" />
    </svg>
  );
}
