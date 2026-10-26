function codeText(pre: HTMLElement): string {
	// CodeWindow renders each line as a block span with no newline characters.
	const lines = pre.querySelectorAll('[data-line]');
	const text = lines.length > 0 ? Array.from(lines, (line) => line.textContent ?? '').join('\n') : (pre.textContent ?? '');
	return text.replace(/\n$/, '');
}

/**
 * Labels and reveals every `[data-code-copy]` button inside a `.code-window`.
 * Labels come from `data-copy-label` / `data-copied-label` on `root`.
 */
export function initCodeCopy(root: HTMLElement): void {
	if (!navigator.clipboard) return;
	const copyLabel = root.dataset.copyLabel ?? 'Copy';
	const copiedLabel = root.dataset.copiedLabel ?? 'Copied';

	for (const button of root.querySelectorAll<HTMLButtonElement>('[data-code-copy]')) {
		const pre = button.closest('.code-window')?.querySelector('pre');
		if (!pre) continue;
		let reset: number | undefined;
		button.textContent = copyLabel;
		button.setAttribute('aria-live', 'polite');
		button.hidden = false;
		button.addEventListener('click', async () => {
			try {
				await navigator.clipboard.writeText(codeText(pre));
			} catch {
				return;
			}
			button.textContent = copiedLabel;
			button.dataset.copied = '';
			clearTimeout(reset);
			reset = window.setTimeout(() => {
				button.textContent = copyLabel;
				delete button.dataset.copied;
			}, 1600);
		});
	}
}
