import { expect, test } from 'bun:test';
import { isCurrent } from '../src/lib/timeline';

test('a record is current from its start month through its end month', () => {
	const now = new Date('2026-10-27T00:00:00Z');
	expect(isCurrent({ start: '2024-04', end: '2027-06' }, now)).toBe(true);
	expect(isCurrent({ start: '2024-04', end: null }, now)).toBe(true);
	expect(isCurrent({ start: '2024-04', end: '2026-10' }, now)).toBe(true);
	expect(isCurrent({ start: '2024-04', end: '2026-09' }, now)).toBe(false);
	expect(isCurrent({ start: '2026-11', end: null }, now)).toBe(false);
	expect(isCurrent({ end: null }, now)).toBe(false);
});
