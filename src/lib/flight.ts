const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const pad = (value: number) => String(value).padStart(2, '0');

/** Flight number for a post, from its UTC publish date: 2025-06-23 → JH0623. */
export function flightNumber(date: Date): string {
	return `JH${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}`;
}

/** NOTAM-style UTC date: 2025-06-23 → 23JUN25. */
export function notamDate(date: Date): string {
	return `${pad(date.getUTCDate())}${months[date.getUTCMonth()]}${pad(date.getUTCFullYear() % 100)}`;
}

const danglingPunctuation = /[:;,、，：；&/\-–—]+$/u;

/**
 * Whole words of `title` that fit in `max` tiles; a single overlong word is cut.
 * When words are dropped, punctuation left dangling at the cut is removed.
 */
export function fitWords(title: string, max: number): string[] {
	const all = title.split(' ').filter(Boolean);
	const words: string[] = [];
	let used = 0;
	for (const word of all) {
		const length = Array.from(word).length + (words.length > 0 ? 1 : 0);
		if (used + length > max) break;
		words.push(word);
		used += length;
	}
	if (words.length < all.length && words.length > 0) {
		const last = words.pop()!.replace(danglingPunctuation, '');
		if (last) words.push(last);
	}
	return words.length > 0 ? words : [Array.from(title).slice(0, max).join('')];
}
