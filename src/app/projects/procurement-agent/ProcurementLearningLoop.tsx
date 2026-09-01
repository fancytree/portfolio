import { caseRadiusPx, fontFamily } from '@/lib/design-tokens';

const center = { x: 540, y: 360 } as const;
const radius = 296;
const stationWidth = 192;
const stationHeight = 104;
const hubWidth = 224;
const hubHeight = 120;

const stations = [
  { index: '01', name: 'Supplier confirmation', value: '30', sublabel: 'Supplier commitment', x: 540, y: 64 },
  { index: '02', name: 'DDT', value: '30', sublabel: 'Shipment evidence', x: 796, y: 212 },
  { index: '03', name: 'Receiving', value: '33', sublabel: 'Physical quantity', x: 796, y: 508 },
  { index: '04', name: 'Variance', value: '+3', sublabel: 'Compared with DDT', x: 540, y: 656 },
  { index: '05', name: 'Outcome', value: 'Over-delivered', sublabel: 'Future evidence', x: 284, y: 508 },
  { index: '06', name: 'Learn', value: 'Review', sublabel: 'Candidate, not truth', x: 284, y: 212, focal: true },
] as const;

type Point = { x: number; y: number };

function angleOf(point: Point) {
  return (Math.atan2(point.y - center.y, point.x - center.x) + Math.PI * 2) % (Math.PI * 2);
}

function circleBoxIntersections(station: (typeof stations)[number]) {
  const left = station.x - stationWidth / 2;
  const right = station.x + stationWidth / 2;
  const top = station.y - stationHeight / 2;
  const bottom = station.y + stationHeight / 2;
  const points: Point[] = [];

  [left, right].forEach((x) => {
    const remainder = radius ** 2 - (x - center.x) ** 2;
    if (remainder < 0) return;
    const offset = Math.sqrt(remainder);
    [center.y - offset, center.y + offset].forEach((y) => {
      if (y >= top && y <= bottom) points.push({ x, y });
    });
  });

  [top, bottom].forEach((y) => {
    const remainder = radius ** 2 - (y - center.y) ** 2;
    if (remainder < 0) return;
    const offset = Math.sqrt(remainder);
    [center.x - offset, center.x + offset].forEach((x) => {
      if (x >= left && x <= right) points.push({ x, y });
    });
  });

  const stationAngle = angleOf(station);
  return points
    .map((point) => {
      const delta = ((angleOf(point) - stationAngle + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      return { point, delta };
    })
    .sort((a, b) => a.delta - b.delta);
}

function ringPath(index: number) {
  const sourceIntersections = circleBoxIntersections(stations[index]);
  const targetIntersections = circleBoxIntersections(stations[(index + 1) % stations.length]);
  const start = sourceIntersections[sourceIntersections.length - 1].point;
  const targetEntry = targetIntersections[0].point;
  const targetAngle = angleOf(targetEntry) - 1.2 / radius;
  const end = {
    x: center.x + radius * Math.cos(targetAngle),
    y: center.y + radius * Math.sin(targetAngle),
  };

  return `M ${start.x.toFixed(3)} ${start.y.toFixed(3)} A ${radius} ${radius} 0 0 1 ${end.x.toFixed(3)} ${end.y.toFixed(3)}`;
}

function spoke(station: (typeof stations)[number]) {
  const dx = station.x - center.x;
  const dy = station.y - center.y;
  const length = Math.hypot(dx, dy);
  const ux = dx / length;
  const uy = dy / length;
  const stationDistance = Math.min(
    Math.abs(ux) < 0.001 ? Number.POSITIVE_INFINITY : stationWidth / 2 / Math.abs(ux),
    Math.abs(uy) < 0.001 ? Number.POSITIVE_INFINITY : stationHeight / 2 / Math.abs(uy),
  );
  const hubDistance = Math.min(
    Math.abs(ux) < 0.001 ? Number.POSITIVE_INFINITY : hubWidth / 2 / Math.abs(ux),
    Math.abs(uy) < 0.001 ? Number.POSITIVE_INFINITY : hubHeight / 2 / Math.abs(uy),
  );

  return {
    x1: station.x - stationDistance * ux,
    y1: station.y - stationDistance * uy,
    x2: center.x + (hubDistance + 8) * ux,
    y2: center.y + (hubDistance + 8) * uy,
  };
}

export default function ProcurementLearningLoop() {
  return (
    <figure className="m-0">
      <div className="overflow-x-auto pb-2">
        <svg
          className="h-auto min-w-[820px] w-full"
          viewBox="0 0 1080 720"
          role="img"
          aria-labelledby="procurement-learning-loop-title procurement-learning-loop-description"
        >
          <title id="procurement-learning-loop-title">The procurement outcome and learning loop</title>
          <desc id="procurement-learning-loop-description">
            Supplier confirmation, DDT, receiving, variance, outcome and governed learning form a continuous loop. Each stage contributes evidence to the shared purchasing record at the center.
          </desc>

          <defs>
            <marker id="procurement-loop-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#777777" />
            </marker>
            <marker id="procurement-spoke-arrow" markerWidth="7" markerHeight="6" refX="6" refY="3" orient="auto">
              <polygon points="0 0, 7 3, 0 6" fill="#9f9f9f" />
            </marker>
          </defs>

          <g fill="none" stroke="#777777" strokeWidth="1.2" markerEnd="url(#procurement-loop-arrow)">
            {stations.map((station, index) => <path key={station.name} d={ringPath(index)} />)}
          </g>

          <g fill="none" stroke="rgb(255 255 255 / 0.34)" strokeWidth="1.2" strokeDasharray="6 5" markerEnd="url(#procurement-spoke-arrow)">
            {stations.map((station) => {
              const line = spoke(station);
              return <line key={station.name} {...line} />;
            })}
          </g>

          {stations.map((station) => {
            const left = station.x - stationWidth / 2;
            const top = station.y - stationHeight / 2;
            const focal = 'focal' in station && station.focal;

            return (
              <g key={station.name}>
                <rect
                  x={left}
                  y={top}
                  width={stationWidth}
                  height={stationHeight}
                  rx={caseRadiusPx.sm}
                  fill={focal ? 'rgb(33 85 232 / 0.22)' : '#202020'}
                  stroke={focal ? '#7fa2ff' : 'rgb(255 255 255 / 0.24)'}
                  strokeWidth={focal ? '1.2' : '1'}
                />
                <text x={left + 16} y={top + 28} fill={focal ? '#7fa2ff' : '#9f9f9f'} fontFamily={fontFamily.sans} fontSize="12" fontWeight="700">
                  {station.index}
                </text>
                <text x={left + 48} y={top + 28} fill={focal ? '#7fa2ff' : '#ffffff'} fontFamily={fontFamily.sans} fontSize="12" fontWeight="700">
                  {station.name}
                </text>
                <text x={left + 16} y={top + 64} fill="#ffffff" fontFamily={fontFamily.sans} fontSize={station.value.length > 10 ? '20' : '24'} fontWeight="700">
                  {station.value}
                </text>
                <text x={left + 16} y={top + 88} fill={focal ? '#b8caff' : '#b8b8b8'} fontFamily={fontFamily.sans} fontSize="12" fontWeight="500">
                  {station.sublabel}
                </text>
              </g>
            );
          })}

          <g>
            <rect x="428" y="300" width={hubWidth} height={hubHeight} rx={caseRadiusPx.sm} fill="#f4f4f4" stroke="#ffffff" />
            <text x="540" y="336" textAnchor="middle" fill="#777777" fontFamily={fontFamily.sans} fontSize="12" fontWeight="700">
              ACCUMULATED STATE
            </text>
            <text x="540" y="376" textAnchor="middle" fill="#161616" fontFamily={fontFamily.sans} fontSize="24" fontWeight="700">
              Decision evidence
            </text>
            <text x="540" y="404" textAnchor="middle" fill="#555555" fontFamily={fontFamily.sans} fontSize="12" fontWeight="600">
              recommendation · override · outcome
            </text>
          </g>
        </svg>
      </div>
    </figure>
  );
}
