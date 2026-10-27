import { locales, type Locale } from '../../lib/i18n';
import { localeFeed } from '../../lib/rss';

// The default locale keeps its legacy prefixed feed so existing subscriptions still resolve.
export function getStaticPaths() {
	return locales.map((locale) => ({ params: { lang: locale }, props: { locale } }));
}

export function GET(context: { props: { locale: Locale }; site: URL | undefined }) {
	return localeFeed(context.props.locale, context.site);
}
