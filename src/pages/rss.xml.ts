import { defaultLocale } from '../lib/i18n';
import { localeFeed } from '../lib/rss';

export function GET(context: { site: URL | undefined }) {
	return localeFeed(defaultLocale, context.site);
}
