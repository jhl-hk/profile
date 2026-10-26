import { animate, createTimeline, onScroll, stagger, svg, utils } from 'animejs';
import { easeOut, flipParams, reducedMotion } from './motion';

/**
 * Top-of-page flight progress. Drives `--progress` (0–1) on `root` from the
 * scroll position; CSS draws the flown track and moves the plane from it.
 * Shows only on pages long enough to scroll.
 */
export function initFlightProgress(root: HTMLElement): void {
	if (reducedMotion.matches) return;
	if (document.documentElement.scrollHeight - innerHeight < 200) return;
	root.dataset.active = '';
	animate(root, {
		'--progress': [0, 1],
		ease: 'linear',
		autoplay: onScroll({ target: document.body, enter: 'top top', leave: 'bottom bottom', sync: true }),
	});
}

/** Section headings wipe in from the left as they scroll up the viewport. */
export function initScrollHeadings(): void {
	if (reducedMotion.matches) return;
	for (const heading of document.querySelectorAll<HTMLElement>('[data-scroll-heading]')) {
		animate(heading, {
			opacity: [0, 1],
			translateX: [-48, 0],
			clipPath: ['inset(0% 100% 0% 0%)', 'inset(0% 0% 0% 0%)'],
			ease: 'linear',
			autoplay: onScroll({ target: heading, enter: 'bottom top', leave: '70% bottom', sync: 0.4 }),
		});
	}
}

/** Cards lean toward the pointer. Fine pointers only. */
export function initTilt(): void {
	if (reducedMotion.matches || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
	for (const card of document.querySelectorAll<HTMLElement>('[data-tilt]')) {
		card.addEventListener('pointermove', (event) => {
			const box = card.getBoundingClientRect();
			const x = (event.clientX - box.left) / box.width - 0.5;
			const y = (event.clientY - box.top) / box.height - 0.5;
			animate(card, { rotateY: x * 10, rotateX: -y * 10, translateZ: 12, duration: 400, ease: easeOut });
		});
		card.addEventListener('pointerleave', () => {
			animate(card, { rotateY: 0, rotateX: 0, translateZ: 0, duration: 700, ease: 'out(4)' });
		});
	}
}

/**
 * Home hero: waypoints appear, then a plane flies the great-circle track on a
 * loop with the flown track drawing behind it. The layer drifts on scroll.
 */
export function initHeroRoute(hero: HTMLElement): void {
	if (reducedMotion.matches) return;
	const layer = hero.querySelector<HTMLElement>('[data-hero-route]');
	const path = hero.querySelector<SVGPathElement>('[data-hero-path]');
	const plane = hero.querySelector<SVGGElement>('[data-hero-plane]');
	const copy = hero.querySelector<HTMLElement>('[data-hero-copy]');
	if (!layer || !path || !plane) return;

	const waypoints = hero.querySelectorAll('[data-hero-waypoint]');
	utils.set(waypoints, { opacity: 0, scale: 0.3 });
	animate(waypoints, { opacity: 1, scale: 1, duration: 500, delay: stagger(350, { start: 300 }), ease: 'out(3)' });

	const flight = 12000;
	const landing = 900;
	const track = svg.createDrawable(path);
	plane.removeAttribute('transform');
	utils.set(plane, { opacity: 0 });
	createTimeline({ delay: 1400, loop: true, loopDelay: 1000 })
		.add(plane, { opacity: [0, 1], duration: 400, ease: 'linear' }, 0)
		.add(plane, { ...svg.createMotionPath(path), duration: flight, ease: 'inOutSine' }, 0)
		.add(track, { draw: ['0 0', '0 1'], duration: flight, ease: 'inOutSine' }, 0)
		.add(plane, { opacity: 0, duration: 500, ease: 'linear' }, flight - 200)
		// The flown track recedes into the destination before the next departure.
		.add(track, { draw: ['0 1', '1 1'], duration: landing, ease: 'inOut(2)' }, flight + 200);

	const scroll = { target: hero, enter: 'top top', leave: 'top bottom', sync: true } as const;
	animate(layer, { translateY: [0, 160], ease: 'linear', autoplay: onScroll(scroll) });
	if (copy) animate(copy, { translateY: [0, -60], opacity: [1, 0.35], ease: 'linear', autoplay: onScroll(scroll) });
}

/** Departure board life: rows re-flip on hover and one random row refreshes every few seconds. */
export function initBoardLife(board: HTMLElement): void {
	if (reducedMotion.matches) return;
	const rows = [...board.querySelectorAll<HTMLElement>('.board-rows a')];
	const flip = (row: HTMLElement) => animate(row.querySelectorAll('.flap:not([data-blank])'), flipParams(260));

	if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
		for (const row of rows) row.addEventListener('pointerenter', () => flip(row));
	}
	setInterval(() => {
		if (document.hidden || rows.length === 0) return;
		const box = board.getBoundingClientRect();
		if (box.bottom < 0 || box.top > innerHeight) return;
		flip(rows[Math.floor(Math.random() * rows.length)]);
	}, 7000);
}
