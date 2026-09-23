import { describe, expect, test } from 'bun:test';
import { isNavigationPathActive } from '../src/lib/navigation';

describe('primary navigation state', () => {
	test('keeps the localized Home item exact while section items include descendants', () => {
		expect(isNavigationPathActive('/en/', '/en/', true)).toBe(true);
		expect(isNavigationPathActive('/en/blog/', '/en/', true)).toBe(false);
		expect(isNavigationPathActive('/en/blog/', '/en/blog/')).toBe(true);
		expect(isNavigationPathActive('/en/blog/post/', '/en/blog/')).toBe(true);
	});
});
