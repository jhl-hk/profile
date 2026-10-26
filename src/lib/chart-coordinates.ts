/** Pixels between graticule lines; each line is ten arc-minutes apart. */
export const chartCell = 160;
export const chartStep = 10;
/** Arc-minutes at the top graticule line: N35°40′. */
export const chartTopLatitude = 35 * 60 + 40;

/** Formats arc-minutes as a chart label, e.g. 2140 → `N35°40′`. */
export function formatCoordinate(minutes: number, positive: 'N' | 'E', negative: 'S' | 'W'): string {
	const hemisphere = minutes < 0 ? negative : positive;
	const total = Math.abs(minutes);
	return `${hemisphere}${Math.floor(total / 60)}°${String(total % 60).padStart(2, '0')}′`;
}
