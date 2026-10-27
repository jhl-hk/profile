import { describe, expect, test } from 'bun:test';
import { isNavigationPathActive } from '../src/lib/navigation';

describe('primary navigation state', () => {
	test('keeps the localized Home item exact while section items include descendants', () => {
		expect(isNavigationPathActive('/', '/', true)).toBe(true);
		expect(isNavigationPathActive('/blog/', '/', true)).toBe(false);
		expect(isNavigationPathActive('/blog/', '/blog/')).toBe(true);
		expect(isNavigationPathActive('/blog/post/', '/blog/')).toBe(true);
		expect(isNavigationPathActive('/ja/', '/ja/', true)).toBe(true);
		expect(isNavigationPathActive('/ja/blog/post/', '/ja/blog/')).toBe(true);
	});
});
