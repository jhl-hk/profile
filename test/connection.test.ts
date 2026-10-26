import { describe, expect, test } from 'bun:test';
import { connectionReadout, type NavigationTimingFields } from '../src/lib/connection';

const timing = (overrides: Partial<NavigationTimingFields>): NavigationTimingFields => ({
	nextHopProtocol: 'h2',
	domainLookupStart: 10,
	domainLookupEnd: 14.4,
	connectStart: 14.4,
	connectEnd: 40,
	secureConnectionStart: 23,
	responseStart: 61.2,
	transferSize: 5200,
	decodedBodySize: 18000,
	...overrides,
});

describe('connectionReadout', () => {
	test('splits the TLS handshake out of the TCP connect time', () => {
		expect(connectionReadout(timing({}), 'cached')).toBe('H2 · DNS 4ms · TCP 9ms · TLS 17ms · TTFB 61ms');
	});

	test('reports the whole connect as TCP without TLS', () => {
		expect(connectionReadout(timing({ nextHopProtocol: 'http/1.1', secureConnectionStart: 0 }), 'cached')).toBe(
			'HTTP/1.1 · DNS 4ms · TCP 26ms · TTFB 61ms',
		);
	});

	test('names a cache hit instead of reporting zero timings', () => {
		expect(connectionReadout(timing({ transferSize: 0 }), 'served from cache')).toBe('served from cache');
	});

	test('omits an unknown protocol', () => {
		expect(connectionReadout(timing({ nextHopProtocol: '' }), 'cached')).toBe('DNS 4ms · TCP 9ms · TLS 17ms · TTFB 61ms');
	});
});
