export type Theme = 'light' | 'dark';

interface ThemeRoot {
	dataset: { theme?: string };
}

interface ThemeButton {
	dataset: { lightLabel?: string; darkLabel?: string };
	setAttribute(name: string, value: string): void;
}

interface ThemeStorage {
	setItem(key: string, value: string): void;
}

type ThemeStorageAccessor = () => ThemeStorage;

export function syncThemeButton(button: ThemeButton, theme: Theme): void {
	const isDark = theme === 'dark';
	button.setAttribute('aria-pressed', String(isDark));
	button.setAttribute(
		'aria-label',
		isDark ? button.dataset.lightLabel ?? '' : button.dataset.darkLabel ?? '',
	);
}

export function applyThemeSelection(
	root: ThemeRoot,
	button: ThemeButton,
	theme: Theme,
	getStorage: ThemeStorageAccessor,
): void {
	root.dataset.theme = theme;
	syncThemeButton(button, theme);
	try {
		getStorage().setItem('theme', theme);
	} catch {
		// Theme selection still applies when storage is unavailable.
	}
}
