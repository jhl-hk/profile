export type NavigationTimingFields = Pick<
	PerformanceNavigationTiming,
	| 'nextHopProtocol'
	| 'domainLookupStart'
	| 'domainLookupEnd'
	| 'connectStart'
	| 'connectEnd'
	| 'secureConnectionStart'
	| 'responseStart'
	| 'transferSize'
	| 'decodedBodySize'
>;

const ms = (value: number) => `${Math.max(0, Math.round(value))}ms`;

/**
 * Summarises how this page reached the browser, e.g. `H2 · DNS 4ms · TCP 9ms · TLS 12ms · TTFB 61ms`.
 * A reused connection reports 0ms for DNS and TCP.
 */
export function connectionReadout(timing: NavigationTimingFields, cachedLabel: string): string {
	if (timing.transferSize === 0 && timing.decodedBodySize > 0) return cachedLabel;
	const usesTls = timing.secureConnectionStart > 0;
	const parts = [
		timing.nextHopProtocol.toUpperCase(),
		`DNS ${ms(timing.domainLookupEnd - timing.domainLookupStart)}`,
		`TCP ${ms((usesTls ? timing.secureConnectionStart : timing.connectEnd) - timing.connectStart)}`,
		usesTls ? `TLS ${ms(timing.connectEnd - timing.secureConnectionStart)}` : '',
		`TTFB ${ms(timing.responseStart)}`,
	];
	return parts.filter(Boolean).join(' · ');
}
