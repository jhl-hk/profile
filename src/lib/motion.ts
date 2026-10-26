import { animate, createTimeline, cubicBezier, scrambleText, splitText, stagger, steps, utils } from 'animejs';
import type { AnimationParams, Timeline } from 'animejs';

// Same curve as --ease-out in global.css.
export const easeOut = cubicBezier(0.23, 1, 0.32, 1);
export const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

const revealDistance = 16;
const revealDuration = 640;
const revealStagger = 70;
const revealStaggerTotal = 420;
const wordStagger = 45;
const typingPerChar = 18;
const countDuration = 1400;
// global.css reveals [data-reveal] on its own at 2000ms; past this point JS leaves the page alone.
const fallbackDeadline = 1800;

const pendingReveals = new Set<HTMLElement>();
// Parts animated in place of their [data-reveal] element: words or code lines.
const revealParts = new Map<HTMLElement, HTMLElement[]>();
let revealObserver: IntersectionObserver | undefined;

const lineHidden = 'inset(0% 100% 0% 0%)';
const lineShown = 'inset(0% 0% 0% 0%)';

// utils.cleanInlineStyles would restore the hidden state written by utils.set, so clear by hand.
function clearRevealStyles(targets: HTMLElement[]): void {
	for (const target of targets) {
		target.style.removeProperty('opacity');
		target.style.removeProperty('transform');
		target.style.removeProperty('clip-path');
	}
}

/** Split-flap tiles cycle through glyphs and land on their own text at slightly different times. */
export function flipParams(settle = 520): AnimationParams {
	return {
		innerHTML: scrambleText({ chars: 'A-Z0-9', settleRate: 18, duration: () => 280 + Math.random() * settle }),
		delay: stagger(10),
		// Each flip scrambles on its own, independent of earlier flips on the same tiles.
		composition: 'none',
	};
}

/** Types each `[data-line]` out left to right, one line after another. */
function addTyping(timeline: Timeline, lines: HTMLElement[], at: number): void {
	let offset = at;
	for (const line of lines) {
		const chars = Math.max(1, (line.textContent ?? '').length);
		const duration = chars * typingPerChar;
		timeline.add(line, { clipPath: [lineHidden, lineShown], duration, ease: steps(chars) }, offset);
		offset += duration + 60;
	}
}

/** Counts each `[data-count]` up from zero to its value. */
function addCounters(timeline: Timeline, element: HTMLElement, at: number): void {
	for (const counter of element.querySelectorAll<HTMLElement>('[data-count]')) {
		const target = Number(counter.dataset.count);
		const width = counter.textContent?.length ?? 2;
		const value = { n: 0 };
		timeline.add(
			value,
			{
				n: target,
				duration: countDuration,
				ease: easeOut,
				onUpdate: () => {
					counter.textContent = String(Math.round(value.n)).padStart(width, '0');
				},
			},
			at,
		);
	}
}

function playReveal(batch: HTMLElement[]): void {
	const step = Math.min(revealStagger, revealStaggerTotal / Math.max(batch.length - 1, 1));
	const timeline = createTimeline({ defaults: { duration: revealDuration, ease: easeOut } });
	const animated: HTMLElement[] = [];
	batch.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
	batch.forEach((element, index) => {
		pendingReveals.delete(element);
		const at = index * step;
		const mode = element.dataset.reveal;
		const parts = revealParts.get(element);
		if (mode === 'lines' && parts) {
			animated.push(...parts);
			addTyping(timeline, parts, at);
			return;
		}
		if (parts) {
			animated.push(...parts);
			timeline.add(parts, { opacity: 1, translateY: 0, delay: stagger(wordStagger) }, at);
			return;
		}
		animated.push(element);
		timeline.add(element, { opacity: 1, translateY: 0 }, at);
		addCounters(timeline, element, at);
		if (mode === 'flaps') timeline.add(element.querySelectorAll('.flap:not([data-blank])'), flipParams(), at);
	});
	timeline.then(() => clearRevealStyles(animated));
}

/**
 * Reveals every `[data-reveal]` element as it scrolls into view.
 * `data-reveal="words"` staggers the element's words; `"lines"` types out its
 * `[data-line]` children; `"flaps"` also flips its `.flap` tiles. `[data-count]`
 * descendants count up.
 */
export function initReveals(): void {
	const root = document.documentElement;
	if (root.dataset.motion !== 'pending') return;
	if (performance.now() > fallbackDeadline || !('IntersectionObserver' in window)) {
		delete root.dataset.motion;
		return;
	}

	const targets = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];
	for (const element of targets) {
		pendingReveals.add(element);
		const mode = element.dataset.reveal;
		if (mode === 'words') {
			const { words } = splitText(element, { words: true });
			revealParts.set(element, words);
			utils.set(words, { opacity: 0, translateY: revealDistance });
		} else if (mode === 'lines') {
			const lines = [...element.querySelectorAll<HTMLElement>('[data-line]')];
			revealParts.set(element, lines);
			utils.set(lines, { clipPath: lineHidden });
		} else {
			utils.set(element, { opacity: 0, translateY: revealDistance });
		}
	}
	root.dataset.motion = 'ready';

	revealObserver = new IntersectionObserver(
		(entries) => {
			const entering = entries.filter((entry) => entry.isIntersecting).map((entry) => entry.target as HTMLElement);
			if (entering.length === 0) return;
			for (const element of entering) revealObserver?.unobserve(element);
			playReveal(entering);
		},
		{ rootMargin: '0px 0px -8% 0px' },
	);
	for (const element of targets) revealObserver.observe(element);
}

/** Shows every not-yet-revealed element inside `container` immediately. */
export function settleReveals(container: ParentNode): void {
	for (const element of pendingReveals) {
		if (!container.contains(element)) continue;
		pendingReveals.delete(element);
		revealObserver?.unobserve(element);
		clearRevealStyles(revealParts.get(element) ?? [element]);
	}
}

/**
 * Animates a trigger-anchored menu in or out. Retargets from the current
 * values when interrupted. The returned promise resolves when the motion ends.
 */
export function animateMenu(menu: HTMLElement, open: boolean, fromHidden = false): Promise<unknown> {
	const reduce = reducedMotion.matches;
	const offscreen: AnimationParams = reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97, translateY: -4 };
	const onscreen: AnimationParams = reduce ? { opacity: 1 } : { opacity: 1, scale: 1, translateY: 0 };
	if (open && fromHidden) utils.set(menu, offscreen);
	return animate(menu, { ...(open ? onscreen : offscreen), duration: open ? 160 : 120, ease: easeOut }).then();
}
