import { createLayout } from 'animejs';
import { easeOut, reducedMotion } from './motion';

/**
 * Returns an updater that FLIP-animates `children` of `root` across the
 * show/hide changes made by its callback. Applies changes instantly when
 * motion is reduced.
 */
export function createListLayout(root: HTMLElement, children: string): (apply: () => void) => void {
	if (reducedMotion.matches) return (apply) => apply();
	const layout = createLayout(root, {
		children,
		duration: 260,
		ease: easeOut,
		enterFrom: { opacity: 0, transform: 'translateY(8px)' },
		leaveTo: { opacity: 0 },
		swapAt: { opacity: 1 },
	});
	return (apply) => {
		layout.update(() => {
			// A finished leaveTo leaves inline opacity on hidden children; the next
			// enter would measure it as the target state.
			for (const child of root.querySelectorAll<HTMLElement>(children)) child.style.removeProperty('opacity');
			apply();
		});
	};
}
