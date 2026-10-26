// Generates src/data/hero-map.ts for the home hero map: Natural Earth 50m land,
// clipped and simplified, plus great-circle legs between the airports.
// Usage: bun scripts/hero-map.ts <path to ne_50m_land.geojson>
// Source: https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_50m_land.geojson
import { readFileSync, writeFileSync } from 'node:fs';

type Point = [number, number];

// Frame with margin around the route so the map edges can fade out without hiding an airport.
const bbox = { west: 113, east: 143, south: 25.5, north: 40.5 };
const refLat = 33;
const width = 560;
const scale = width / ((bbox.east - bbox.west) * Math.cos((refLat * Math.PI) / 180));
const height = Math.round((bbox.north - bbox.south) * scale);

const project = ([lon, lat]: Point): Point => [
	(lon - bbox.west) * Math.cos((refLat * Math.PI) / 180) * scale,
	(bbox.north - lat) * scale,
];

// Sutherland–Hodgman clip of a ring against the lon/lat box.
function clip(ring: Point[]): Point[] {
	const edges: [(p: Point) => boolean, (a: Point, b: Point) => Point][] = [
		[(p) => p[0] >= bbox.west, (a, b) => intersectX(a, b, bbox.west)],
		[(p) => p[0] <= bbox.east, (a, b) => intersectX(a, b, bbox.east)],
		[(p) => p[1] >= bbox.south, (a, b) => intersectY(a, b, bbox.south)],
		[(p) => p[1] <= bbox.north, (a, b) => intersectY(a, b, bbox.north)],
	];
	let output = ring;
	for (const [inside, intersect] of edges) {
		const input = output;
		output = [];
		for (let i = 0; i < input.length; i++) {
			const current = input[i];
			const previous = input[(i + input.length - 1) % input.length];
			if (inside(current)) {
				if (!inside(previous)) output.push(intersect(previous, current));
				output.push(current);
			} else if (inside(previous)) {
				output.push(intersect(previous, current));
			}
		}
		if (output.length === 0) break;
	}
	return output;
}
function intersectX(a: Point, b: Point, x: number): Point {
	const t = (x - a[0]) / (b[0] - a[0]);
	return [x, a[1] + t * (b[1] - a[1])];
}
function intersectY(a: Point, b: Point, y: number): Point {
	const t = (y - a[1]) / (b[1] - a[1]);
	return [a[0] + t * (b[0] - a[0]), y];
}

// Ramer–Douglas–Peucker on projected points.
function simplify(points: Point[], tolerance: number): Point[] {
	if (points.length < 3) return points;
	const [a, b] = [points[0], points[points.length - 1]];
	let maxDistance = 0;
	let index = 0;
	for (let i = 1; i < points.length - 1; i++) {
		const distance = perpendicular(points[i], a, b);
		if (distance > maxDistance) {
			maxDistance = distance;
			index = i;
		}
	}
	if (maxDistance <= tolerance) return [a, b];
	return [...simplify(points.slice(0, index + 1), tolerance).slice(0, -1), ...simplify(points.slice(index), tolerance)];
}
function perpendicular(p: Point, a: Point, b: Point): number {
	const dx = b[0] - a[0];
	const dy = b[1] - a[1];
	const length = Math.hypot(dx, dy);
	if (length === 0) return Math.hypot(p[0] - a[0], p[1] - a[1]);
	return Math.abs(dy * p[0] - dx * p[1] + b[0] * a[1] - b[1] * a[0]) / length;
}

const round = (n: number) => Math.round(n * 10) / 10;
const toPath = (points: Point[], close: boolean) =>
	points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${round(x)} ${round(y)}`).join('') + (close ? 'Z' : '');

const landFile = process.argv[2];
if (!landFile) throw new Error('Usage: bun scripts/hero-map.ts <ne_50m_land.geojson>');
const land = JSON.parse(readFileSync(landFile, 'utf8'));
const landPaths: string[] = [];
for (const feature of land.features) {
	const polygons: Point[][][] = feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates] : feature.geometry.coordinates;
	for (const polygon of polygons) {
		const outer = polygon[0];
		const clipped = clip(outer);
		if (clipped.length < 3) continue;
		const projected = simplify(clipped.map(project), 0.45);
		if (projected.length < 3) continue;
		const xs = projected.map((p) => p[0]);
		const ys = projected.map((p) => p[1]);
		// Drop specks under ~2px across.
		if (Math.max(...xs) - Math.min(...xs) < 2 && Math.max(...ys) - Math.min(...ys) < 2) continue;
		landPaths.push(toPath(projected, true));
	}
}

// Great-circle interpolation.
const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;
function greatCircle(a: Point, b: Point, steps: number): Point[] {
	const [l1, p1, l2, p2] = [rad(a[0]), rad(a[1]), rad(b[0]), rad(b[1])];
	const d = 2 * Math.asin(Math.sqrt(Math.sin((p2 - p1) / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin((l2 - l1) / 2) ** 2));
	const points: Point[] = [];
	for (let i = 0; i <= steps; i++) {
		const f = i / steps;
		const A = Math.sin((1 - f) * d) / Math.sin(d);
		const B = Math.sin(f * d) / Math.sin(d);
		const x = A * Math.cos(p1) * Math.cos(l1) + B * Math.cos(p2) * Math.cos(l2);
		const y = A * Math.cos(p1) * Math.sin(l1) + B * Math.cos(p2) * Math.sin(l2);
		const z = A * Math.sin(p1) + B * Math.sin(p2);
		points.push([deg(Math.atan2(y, x)), deg(Math.atan2(z, Math.hypot(x, y)))]);
	}
	return points;
}
const nauticalMiles = (a: Point, b: Point) => {
	const [l1, p1, l2, p2] = [rad(a[0]), rad(a[1]), rad(b[0]), rad(b[1])];
	return 2 * Math.asin(Math.sqrt(Math.sin((p2 - p1) / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin((l2 - l1) / 2) ** 2)) * 3440.065;
};

const airports = [
	{ id: 'ZSHC', city: 'Hangzhou', position: [120.4344, 30.2295] as Point },
	{ id: 'ZSPD', city: 'Shanghai', position: [121.8052, 31.1434] as Point },
	{ id: 'RJTT', city: 'Tokyo', position: [139.7811, 35.5523] as Point },
];
const legs = airports.slice(1).map((to, i) => {
	const from = airports[i];
	return { from: from.id, to: to.id, nm: Math.round(nauticalMiles(from.position, to.position)), points: greatCircle(from.position, to.position, 48) };
});
const routePoints = legs.flatMap((leg, i) => (i === 0 ? leg.points : leg.points.slice(1))).map(project);

const meridians = [115, 120, 125, 130, 135, 140].map((lon) => ({ label: `E${lon}°`, x: round(project([lon, 0])[0]) }));
const parallels = [30, 35].map((lat) => ({ label: `N${lat}°`, y: round(project([0, lat])[1]) }));
const legSummaries = legs.map(({ from, to, nm }) => ({ from, to, nm }));

const output = `// Generated from Natural Earth 50m land (public domain) and great-circle legs between the airports.
// Equirectangular projection, ${bbox.west}–${bbox.east}°E × ${bbox.south}–${bbox.north}°N, scaled by cos ${refLat}°.

export const heroMapViewBox = '0 0 ${width} ${height}';

export const heroMapLand = ${JSON.stringify(landPaths.join(''))};

export const heroMapRoute = ${JSON.stringify(toPath(routePoints, false))};

export const heroMapAirports = ${JSON.stringify(
	airports.map((a) => {
		const [x, y] = project(a.position);
		return { id: a.id, city: a.city, x: round(x), y: round(y) };
	}),
	null,
	'\t',
)} as const;

export const heroMapLegs = ${JSON.stringify(legSummaries, null, '\t')} as const;

export const heroMapMeridians = ${JSON.stringify(meridians, null, '\t')} as const;

export const heroMapParallels = ${JSON.stringify(parallels, null, '\t')} as const;
`;
writeFileSync(new URL('../src/data/hero-map.ts', import.meta.url), output);
console.log({ height, landPaths: landPaths.length, bytes: output.length, legs: legSummaries });
