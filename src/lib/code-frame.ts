import type { ShikiConfig } from 'astro';

type ShikiTransformer = NonNullable<ShikiConfig['transformers']>[number];
type HastRoot = Parameters<NonNullable<ShikiTransformer['root']>>[0];
type HastElement = Extract<HastRoot['children'][number], { type: 'element' }>;

const element = (tagName: string, className: string, children: HastElement['children'] = [], properties = {}): HastElement => ({
	type: 'element',
	tagName,
	properties: { className: [className], ...properties },
	children,
});

/**
 * Wraps each highlighted code block in the site's `.code-window` frame: a
 * header with the language and a copy button. The post script labels and
 * reveals the button, so without JS it stays hidden.
 */
export const codeFrameTransformer: ShikiTransformer = {
	name: 'code-frame',
	root(root) {
		const language = this.options.lang;
		const label = !language || language === 'plaintext' || language === 'text' ? 'text' : language;
		const blocks = root.children.filter((node): node is HastElement => node.type === 'element');
		const header = element('figcaption', 'code-header', [
			element('span', 'code-label', [{ type: 'text', value: label }]),
			element('button', 'code-copy', [], { type: 'button', hidden: true, dataCodeCopy: true }),
		]);
		return { ...root, children: [element('figure', 'code-window', [header, ...blocks])] };
	},
};
