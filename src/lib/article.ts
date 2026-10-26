/**
 * Marks the table of contents as a flight plan: the section being read gets
 * `aria-current="location"`, and the waypoints before it get `data-passed`.
 */
export function trackFlightPlan(toc: HTMLElement): void {
	const waypoints = [...toc.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')].flatMap((link) => {
		const heading = document.getElementById(decodeURIComponent(link.hash.slice(1)));
		return heading ? [{ link, heading }] : [];
	});
	if (waypoints.length === 0) return;

	let frame = 0;
	const update = () => {
		frame = 0;
		const readingLine = innerHeight * 0.25;
		const atBottom = innerHeight + scrollY >= document.documentElement.scrollHeight - 2;
		let active = atBottom ? waypoints.length - 1 : -1;
		if (!atBottom) {
			waypoints.forEach(({ heading }, index) => {
				if (heading.getBoundingClientRect().top <= readingLine) active = index;
			});
		}
		waypoints.forEach(({ link }, index) => {
			link.parentElement?.toggleAttribute('data-passed', index < active);
			if (index === active) link.setAttribute('aria-current', 'location');
			else link.removeAttribute('aria-current');
		});
	};
	const schedule = () => {
		if (!frame) frame = requestAnimationFrame(update);
	};
	addEventListener('scroll', schedule, { passive: true });
	addEventListener('resize', schedule);
	update();
}
