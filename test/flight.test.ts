import { describe, expect, test } from 'bun:test';
import { fitWords, flightNumber, notamDate } from '../src/lib/flight';

describe('flight codes', () => {
	test('use the UTC calendar date of the post', () => {
		const date = new Date('2025-06-23T00:00:00Z');
		expect(flightNumber(date)).toBe('JH0623');
		expect(notamDate(date)).toBe('23JUN25');
		expect(notamDate(new Date('2024-01-05T23:59:59Z'))).toBe('05JAN24');
	});
});

describe('fitWords', () => {
	test('keeps whole words within the tile budget', () => {
		expect(fitWords('Memoir of VATJPN and Other Friends', 26)).toEqual(['Memoir', 'of', 'VATJPN', 'and', 'Other']);
		expect(fitWords('Memoir of VATJPN and Other Friends', 25)).toEqual(['Memoir', 'of', 'VATJPN', 'and']);
	});

	test('drops punctuation left dangling by the cut, keeps it on whole titles', () => {
		expect(fitWords('Cerulean Aviation Network: Building a Community', 30)).toEqual(['Cerulean', 'Aviation', 'Network']);
		expect(fitWords('How to deploy MCSManager Panel?', 40)).toEqual(['How', 'to', 'deploy', 'MCSManager', 'Panel?']);
	});

	test('cuts a single overlong word by characters, not code units', () => {
		expect(fitWords('逐渐成为IDC', 4)).toEqual(['逐渐成为']);
	});
});
