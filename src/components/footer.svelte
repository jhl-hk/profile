<script lang="ts">
	import { onMount } from 'svelte';
	import GitHubIcon from '$components/icon/github.svelte';
	import LinkedInIcon from '$components/icon/linkedIn.svelte';
	import { MailIcon } from 'lucide-svelte';
	import GlassCard from '$components/glassCard.svelte';

	let footerRef: HTMLElement;
	let currentYear = new Date().getFullYear();
	let isVisible = false;

	// Social links with proper URLs and icons
	const socialLinks = [
		{
			name: 'GitHub',
			url: 'https://github.com/JHL-HK',
			icon: GitHubIcon,
			hoverColor: 'hover:text-gray-900',
			bgColor: 'hover:bg-gray-100/20',
			ariaLabel: 'Visit my GitHub profile'
		},
		{
			name: 'LinkedIn',
			url: 'https://linkedin.com/in/jianyuehugoliang',
			icon: LinkedInIcon,
			hoverColor: 'hover:text-blue-600',
			bgColor: 'hover:bg-blue-100/20',
			ariaLabel: 'Connect with me on LinkedIn'
		},
		{
			name: 'Email',
			url: 'mailto:ja@jhl.hk',
			icon: MailIcon,
			hoverColor: 'hover:text-red-600',
			bgColor: 'hover:bg-red-100/20',
			ariaLabel: 'Send me an email'
		}
	];

	const quickLinks = [
		{ name: 'Blog', href: 'https://article.jhl.idv.hk', description: 'Read my latest articles' },
		{ name: 'Projects', href: '#projects', description: 'View my work' },
		{ name: 'Contact', href: '#contact', description: 'Get in touch' }
	];

	const techStack = [
		{ name: 'TypeScript', category: 'language' },
		{ name: 'Svelte', category: 'framework' },
		{ name: 'React', category: 'framework' },
		{ name: 'Node.js', category: 'runtime' },
		{ name: 'Python', category: 'language' },
		{ name: 'Go', category: 'language' }
	];

	// Intersection Observer for fade-in animation
	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						isVisible = true;
					}
				});
			},
			{ threshold: 0.1 }
		);

		if (footerRef) {
			observer.observe(footerRef);
		}

		return () => {
			if (footerRef) {
				observer.unobserve(footerRef);
			}
		};
	});

	// Smooth scroll to section
	const scrollToSection = (href: string) => {
		if (href.startsWith('#')) {
			const element = document.querySelector(href);
			if (element) {
				element.scrollIntoView({ behavior: 'smooth' });
			}
		}
	};
</script>

<footer bind:this={footerRef} class="my-6" aria-label="Site footer">
	<GlassCard>
		<div class="">
			<!-- Main Footer Content -->
			<div class="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
				<!-- Brand Section -->
				<section
					class={`transition-all duration-700 ease-out md:col-span-1 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}
					style="animation-delay: 0.1s"
					aria-labelledby="brand-heading"
				>
					<div class="mb-4 flex items-center gap-3">
						<div
							class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-stone-700 via-stone-600 to-stone-500 shadow-lg ring-2 ring-white/20"
						>
							<span class="text-base font-bold text-white">JHL</span>
						</div>
						<div class="min-w-0 flex-1">
							<h2 id="brand-heading" class="mb-1 text-xl font-bold text-stone-900 drop-shadow-sm">
								Jianyue Hugo Liang
							</h2>
							<div
								class="h-0.5 w-16 rounded-full bg-gradient-to-r from-stone-600 via-stone-500 to-stone-400 shadow-sm"
							></div>
						</div>
					</div>

					<p class="mb-4 text-sm leading-relaxed text-stone-700">
						An international student passionate about technology and aviation, contributing to
						open-source projects.
					</p>

					<div
						class="inline-flex items-center rounded-xl border border-white/40 bg-white/20 px-3 py-2 text-xs font-medium text-stone-700 shadow-sm backdrop-blur-sm transition-colors duration-200 hover:bg-white/30"
					>
						<span class="mr-2 text-amber-600" aria-hidden="true">🌍</span>
						<span>Based in Japan</span>
					</div>
				</section>

				<!-- Quick Links -->
				<nav
					class={`transition-all duration-700 ease-out md:col-span-1 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}
					style="animation-delay: 0.2s"
					aria-labelledby="quick-links-heading"
				>
					<h3
						id="quick-links-heading"
						class="mb-4 flex items-center text-sm font-semibold text-stone-700 drop-shadow-sm"
					>
						<span
							class="mr-2 h-2 w-2 rounded-full bg-gradient-to-r from-stone-600 to-stone-500 shadow-sm"
							aria-hidden="true"
						></span>
						Quick Links
					</h3>

					<ul class="space-y-3">
						{#each quickLinks as link}
							<li>
								<a
									href={link.href}
									class="group flex items-center rounded-sm py-1 text-sm font-medium text-stone-800 drop-shadow-sm transition-all duration-200 hover:translate-x-1 hover:text-stone-600 focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 focus:outline-none"
									on:click|preventDefault={() => scrollToSection(link.href)}
									aria-label={link.description}
								>
									<span
										class="mr-3 h-1 w-1 rounded-full bg-stone-800 transition-all duration-200 group-hover:scale-125 group-hover:bg-stone-600 group-hover:shadow-sm"
										aria-hidden="true"
									></span>
									<span>{link.name}</span>
								</a>
							</li>
						{/each}
					</ul>
				</nav>

				<!-- Social Links -->
				<section
					class={`transition-all duration-700 ease-out md:col-span-1 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}
					style="animation-delay: 0.3s"
					aria-labelledby="social-heading"
				>
					<h3
						id="social-heading"
						class="mb-4 flex items-center text-sm font-semibold text-stone-700 drop-shadow-sm"
					>
						<span
							class="mr-2 h-2 w-2 rounded-full bg-gradient-to-r from-stone-600 to-stone-500 shadow-sm"
							aria-hidden="true"
						></span>
						Let's Connect
					</h3>

					<div class="grid grid-cols-2 gap-3">
						{#each socialLinks as social}
							<a
								href={social.url}
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center text-sm text-stone-800 {social.hoverColor} {social.bgColor} group rounded-lg border border-white/25 bg-white/15 px-3 py-2 shadow-sm drop-shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/35 hover:bg-white/25 hover:shadow-md focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 focus:outline-none"
								aria-label={social.ariaLabel}
							>
								<span
									class="mr-2 transition-transform duration-200 group-hover:scale-110"
									aria-hidden="true"
								>
									<social.icon />
								</span>
								<span class="truncate font-medium">{social.name}</span>
							</a>
						{/each}
					</div>
				</section>
			</div>

			<!-- Tech Stack -->
			<section
				class={`mb-8 transition-all duration-700 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}
				style="animation-delay: 0.4s"
				aria-labelledby="tech-heading"
			>
				<h3 id="tech-heading" class="sr-only">Technologies I work with</h3>
				<div class="flex flex-wrap justify-center gap-2">
					{#each techStack as tech}
						<span
							class="inline-flex cursor-default items-center rounded-full border border-white/30 bg-white/20 px-3 py-2 text-xs font-medium text-stone-600 shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/30 hover:shadow-md"
							title={`${tech.name} - ${tech.category}`}
							role="img"
							aria-label={tech.name}
						>
							<span>{tech.name}</span>
						</span>
					{/each}
				</div>
			</section>

			<!-- Divider -->
			<div
				class={`relative mb-6 transition-all duration-700 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
				style="animation-delay: 0.5s"
				aria-hidden="true"
			>
				<div class="absolute inset-0 flex items-center">
					<div
						class="h-px w-full bg-gradient-to-r from-transparent via-stone-300/50 to-transparent"
					></div>
				</div>
				<div class="relative flex justify-center">
					<div
						class="h-px w-16 bg-gradient-to-r from-stone-500 via-stone-400 to-stone-300 shadow-sm"
					></div>
				</div>
			</div>

			<!-- Bottom Section -->
			<div
				class={`flex flex-col items-center justify-between text-sm text-stone-400 transition-all duration-700 ease-out md:flex-row ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}
				style="animation-delay: 0.6s"
			>
				<div class="mb-2 flex items-center font-medium drop-shadow-sm md:mb-0">
					<span class="mr-1 text-stone-600" aria-hidden="true">©</span>
					<span class="text-stone-600">{currentYear} JHL-HK. All rights reserved.</span>
				</div>

				<div class="flex items-center font-medium drop-shadow-sm">
					<span class="text-stone-600">Built with</span>
					<span class="mx-1 animate-pulse text-rose-500" aria-hidden="true">❤️</span>
					<span class="text-stone-600">using SvelteKit</span>
				</div>
			</div>
		</div>
	</GlassCard>
</footer>

<style>
	/* Screen Reader Only */
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	/* Custom animations for reduced motion support */
	@media (prefers-reduced-motion: reduce) {
		* {
			animation-duration: 0.01ms !important;
			animation-iteration-count: 1 !important;
			transition-duration: 0.01ms !important;
		}
	}
</style>
