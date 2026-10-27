interface Period {
	start?: string;
	end?: string | null;
}

/** Current from the start month through the end month; an end in the future is an expected date. */
export function isCurrent({ start, end }: Period, now = new Date()): boolean {
	if (!start) return false;
	const month = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
	return start <= month && (!end || end >= month);
}
