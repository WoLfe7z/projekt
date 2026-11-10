// Igrišče z 11 igralci v 4-3-3

const igralci = [
  // golman
  { st: 1, x: 34, y: 96 },
  // obramba
  { st: 2, x: 56, y: 80 },
  { st: 5, x: 41, y: 84 },
  { st: 4, x: 27, y: 84 },
  { st: 3, x: 12, y: 80 },
  // vezisti
  { st: 6, x: 34, y: 68 },
  { st: 8, x: 47, y: 60 },
  { st: 7, x: 21, y: 60 },
  // napad
  { st: 10, x: 56, y: 41 },
  { st: 9, x: 34, y: 36 },
  { st: 11, x: 12, y: 41 },
];

export default function Igrisce() {
  const crta = { fill: "none", stroke: "var(--color-kreda)", strokeWidth: 0.35, strokeOpacity: 0.75 };

  return (
    <svg viewBox="0 0 68 105" className="h-full w-full" role="img" aria-label="Igrišče z enajstimi igralci v formaciji 4-3-3">
      {/* črte igrišča */}
      <rect x="2" y="2" width="64" height="101" {...crta} />
      <line x1="2" y1="52.5" x2="66" y2="52.5" {...crta} />
      <circle cx="34" cy="52.5" r="9.15" {...crta} />
      <circle cx="34" cy="52.5" r="0.4" fill="var(--color-kreda)" fillOpacity="0.75" />
      {/* zgornji kazenski */}
      <rect x="13.84" y="2" width="40.32" height="16.5" {...crta} />
      <rect x="24.84" y="2" width="18.32" height="5.5" {...crta} />
      <path d="M 26.7 18.5 A 9.15 9.15 0 0 0 41.3 18.5" {...crta} />
      {/* spodnji kazenski */}
      <rect x="13.84" y="86.5" width="40.32" height="16.5" {...crta} />
      <rect x="24.84" y="97.5" width="18.32" height="5.5" {...crta} />
      <path d="M 26.7 86.5 A 9.15 9.15 0 0 1 41.3 86.5" {...crta} />

      {/* igralci */}
      {igralci.map((igralec, i) => (
        <g
          key={igralec.st}
          className="igralec"
          style={{ "--x": igralec.x, "--y": igralec.y, "--i": i } as React.CSSProperties}
        >
          <circle r="3.1" fill="var(--color-kreda)" />
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="3.3"
            fontWeight="700"
            fill="var(--color-trava-temna)"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {igralec.st}
          </text>
        </g>
      ))}
    </svg>
  );
}
