function normalizePath(path: string): string {
	return path === '/' ? '/' : `/${path.split('/').filter(Boolean).join('/')}`;
}

export function isNavigationPathActive(pathname: string, href: string, exact = false): boolean {
	const currentPath = normalizePath(pathname);
	const targetPath = normalizePath(href);
	if (exact || targetPath === '/') return currentPath === targetPath;
	return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
}
