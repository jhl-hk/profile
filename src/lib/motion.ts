import { animate, createTimeline, cubicBezier, splitText, stagger, utils } from 'animejs';
import type { AnimationParams } from 'animejs';

// Same curve as --ease-out in global.css.
export const easeOut = cubicBezier(0.23, 1, 0.32, 1);
export const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

const revealDistance = 16;
const revealDuration = 640;
const revealStagger = 70;
const revealStaggerTotal = 420;
const wordStagger = 45;
// global.css reveals [data-reveal] on its own at 2000ms; past this point JS leaves the page alone.
const fallbackDeadline = 1800;

const pendingReveals = new Set<HTMLElement>();
const splitWords = new Map<HTMLElement, HTMLElement[]>();
let revealObserver: IntersectionObserver | undefined;

// utils.cleanInlineStyles would restore the hidden state written by utils.set, so clear by hand.
function clearRevealStyles(targets: HTMLElement[]): void {
	for (const target of targets) {
		target.style.removeProperty('opacity');
		target.style.removeProperty('transform');
	}
}

function playReveal(batch: HTMLElement[]): void {
	const step = Math.min(revealStagger, revealStaggerTotal / Math.max(batch.length - 1, 1));
	const timeline = createTimeline({ defaults: { duration: revealDuration, ease: easeOut } });
	const animated: HTMLElement[] = [];
	batch.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
	batch.forEach((element, index) => {
		pendingReveals.delete(element);
		const words = splitWords.get(element);
		const targets = words ?? [element];
		animated.push(...targets);
		timeline.add(targets, { opacity: 1, translateY: 0, delay: words ? stagger(wordStagger) : 0 }, index * step);
	});
	timeline.then(() => clearRevealStyles(animated));
}

/**
 * Reveals every `[data-reveal]` element as it scrolls into view.
 * `data-reveal="words"` staggers the element's words instead of the element.
 * Runs only when the head script marked the page `data-motion="pending"`.
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
		if (element.dataset.reveal !== 'words') {
			utils.set(element, { opacity: 0, translateY: revealDistance });
			continue;
		}
		const { words } = splitText(element, { words: true });
		splitWords.set(element, words);
		utils.set(words, { opacity: 0, translateY: revealDistance });
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
		clearRevealStyles(splitWords.get(element) ?? [element]);
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
