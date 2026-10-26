import { onScroll } from 'animejs';
import { chartCell, chartStep, chartTopLatitude, formatCoordinate } from './chart-coordinates';
import { reducedMotion } from './motion';

const parallax = 0.25;
const roseTurn = 0.06;

/**
 * Aeronautical chart backdrop: the graticule drifts with scroll at a quarter
 * of the page speed, latitude labels follow their lines, and the VOR rose turns.
 */
export function initChart(root: HTMLElement): void {
	const grid = root.querySelector<HTMLElement>('[data-chart-grid]');
	const latitudes = [...root.querySelectorAll<HTMLElement>('[data-chart-lat]')];
	const rose = root.querySelector<SVGElement>('[data-chart-rose]');
	if (!grid) return;

	const render = () => {
		const drift = scrollY * parallax;
		const first = Math.floor(drift / chartCell);
		const offset = first * chartCell - drift;
		grid.style.backgroundPositionY = `${offset}px`;
		latitudes.forEach((label, index) => {
			label.textContent = formatCoordinate(chartTopLatitude - (first + index) * chartStep, 'N', 'S');
			label.style.transform = `translateY(${offset + index * chartCell}px)`;
		});
		if (rose) rose.style.transform = `rotate(${drift * roseTurn}deg)`;
	};

	render();
	if (reducedMotion.matches) return;
	onScroll({ target: document.body, onUpdate: render });
}
