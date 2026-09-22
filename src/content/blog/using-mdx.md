---
title: 'Using MDX'
description: 'Lorem ipsum dolor sit amet'
pubDate: 'Jun 01 2024'
heroImage: '../../assets/blog-placeholder-5.jpg'
lang: en
topics:
  - Sample
featured: false
draft: false
sample: true
---

This theme comes with the [@astrojs/mdx](https://docs.astro.build/en/guides/integrations-guide/mdx/) integration installed and configured in your `astro.config.mjs` config file. If you prefer not to use MDX, you can disable support by removing the integration from your config file.

## Why MDX?

MDX is a special flavor of Markdown that supports embedded JavaScript and JSX syntax. This unlocks the ability to [mix JavaScript and UI Components into your Markdown content](https://docs.astro.build/en/guides/integrations-guide/mdx/#mdx-in-astro) for things like interactive charts or alerts.

If you have existing content authored in MDX, this integration will hopefully make migrating to Astro a breeze.

## Example

Here is how you import and use a UI component inside of MDX.

```mdx
import HeaderLink from '../../components/HeaderLink.astro';

<HeaderLink href="#" onclick="alert('clicked!')">
  Embedded component in MDX
</HeaderLink>
```

When you open an MDX page containing this code, the component can render as part of the page.

## More Links

- [MDX Syntax Documentation](https://mdxjs.com/docs/what-is-mdx)
- [Astro Usage Documentation](https://docs.astro.build/en/basics/astro-pages/#markdownmdx-pages)
- **Note:** [Client Directives](https://docs.astro.build/en/reference/directives-reference/) are still required to create interactive components. Otherwise, all components in your MDX will render as static HTML (no JavaScript) by default.
