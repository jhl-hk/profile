<script lang="ts">
	import { onMount } from 'svelte';

	let isMenuOpen = false;
	let scrollY = 0;
	let scrollProgress = 0;
	let headerRef: HTMLElement;

	const toggleMenu = () => {
		isMenuOpen = !isMenuOpen;

		// Focus management for mobile menu
		if (isMenuOpen) {
			// Focus first menu item when menu opens
			setTimeout(() => {
				const firstMenuItem = headerRef?.querySelector('.mobile-menu a');
				if (firstMenuItem instanceof HTMLElement) {
					firstMenuItem.focus();
				}
			}, 100);
		}
	};

	const closeMenu = () => {
		isMenuOpen = false;
	};

	// Keyboard navigation support
	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Escape' && isMenuOpen) {
			closeMenu();
			// Return focus to menu toggle button
			const menuToggle = headerRef?.querySelector('.menu-toggle');
			if (menuToggle instanceof HTMLElement) {
				menuToggle.focus();
			}
		}
	};

	// Close menu when clicking outside
	const handleOutsideClick = (event: MouseEvent) => {
		const target = event.target as HTMLElement;
		if (!target.closest('.mobile-menu') && !target.closest('.menu-toggle')) {
			closeMenu();
		}
	};

	// Throttled scroll handler for better performance
	let scrollTimeout: number;
	const handleScroll = () => {
		if (scrollTimeout) {
			cancelAnimationFrame(scrollTimeout);
		}
		scrollTimeout = requestAnimationFrame(() => {
			scrollY = window.scrollY;
			// Calculate scroll progress
			const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
			scrollProgress = windowHeight > 0 ? (scrollY / windowHeight) * 100 : 0;
		});
	};

	onMount(() => {
		window.addEventListener('scroll', handleScroll, { passive: true });
		document.addEventListener('click', handleOutsideClick);
		document.addEventListener('keydown', handleKeydown);

		return () => {
			window.removeEventListener('scroll', handleScroll);
			document.removeEventListener('click', handleOutsideClick);
			document.removeEventListener('keydown', handleKeydown);
			if (scrollTimeout) {
				cancelAnimationFrame(scrollTimeout);
			}
		};
	});

	const menuItems = [
		{ label: 'Blog', href: 'https://article.jhl.idv.hk' },
		{ label: 'Projects', href: '#projects' },
		{ label: 'Contact', href: '#contact' }
	];
</script>

<svelte:window bind:scrollY />

<header
	bind:this={headerRef}
	class="pointer-events-none fixed top-0 right-0 left-0 z-50 px-3 py-2 sm:p-4"
>
	<div
		class={`pointer-events-auto relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-white/30 shadow-2xl backdrop-blur-md transition-all duration-300 ${scrollY > 50 ? 'py-1.5 sm:py-2' : 'py-2 sm:py-3'}`}
		style="background: linear-gradient(135deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.4) 50%, rgba(245, 243, 241, 0.42) 100%); backdrop-filter: blur(20px) brightness(0.92); -webkit-backdrop-filter: blur(20px) brightness(0.92); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3);"
	>
		<!-- Soft white transparent overlay -->
		<div class="pointer-events-none absolute inset-0 z-[1] bg-white/30" aria-hidden="true"></div>

		<!-- Darkening gradient overlay -->
		<div
			class="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/[0.04] to-black/[0.1]"
			aria-hidden="true"
		></div>

		<!-- Scroll progress indicator -->
		<div
			class="pointer-events-none absolute top-0 right-0 left-0 h-[2px] overflow-hidden bg-gradient-to-r from-transparent via-stone-300/30 to-transparent"
			aria-hidden="true"
		>
			<div
				class="h-full bg-gradient-to-r from-stone-600 via-stone-500 to-stone-400 shadow-lg transition-all duration-300 ease-out"
				style={`width: ${scrollProgress}%; box-shadow: 0 0 10px rgba(120, 113, 108, 0.5)`}
			></div>
		</div>

		<div class="relative z-10 flex items-center justify-between gap-2 px-2.5 sm:px-4 md:px-6">
			<!-- Logo/Brand -->
			<div class="flex min-w-0 flex-1 items-center md:flex-initial">
				<a
					href="/"
					class="group flex min-w-0 items-center gap-2 rounded-lg p-1 transition-all duration-200 hover:bg-white/10 focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 focus:outline-none sm:gap-2.5 sm:p-1.5"
					aria-label="Jianyue Hugo Liang - Home"
				>
					<!-- Avatar/Icon -->
					<div
						class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-stone-700 via-stone-600 to-stone-500 shadow-md ring-2 ring-white/20 transition-transform duration-200 group-hover:scale-105 sm:h-8 sm:w-8"
					>
						<span class="text-[10px] font-bold text-white sm:text-xs">JHL</span>
					</div>
					<div class="flex min-w-0 flex-col">
						<span
							class="truncate text-xs font-bold tracking-tight text-stone-900 sm:text-sm md:text-base"
							>Jianyue Hugo Liang</span
						>
						<span
							class="hidden truncate text-[9px] font-medium text-stone-600 opacity-90 sm:text-[10px] md:block"
							>Full-Stack Developer</span
						>
					</div>
				</a>
			</div>

			<!-- Desktop Navigation -->
			<nav class="hidden flex-shrink-0 md:block" aria-label="Main navigation">
				<ul class="flex items-center gap-2">
					{#each menuItems as item, index}
						<li>
							<a
								href={item.href}
								class="group relative flex items-center gap-2 overflow-hidden rounded-xl px-4 py-2 text-sm font-semibold text-stone-700 transition-all duration-300 hover:bg-white/20 hover:text-stone-900 focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 focus:outline-none"
								tabindex="0"
								role="menuitem"
							>
								<!-- Hover background effect -->
								<span
									class="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-stone-100/0 via-stone-100/50 to-stone-100/0 transition-transform duration-700 ease-in-out group-hover:translate-x-[100%]"
									aria-hidden="true"
								></span>

								<!-- Active indicator dot -->
								<span
									class="relative h-1.5 w-1.5 rounded-full bg-stone-400 opacity-0 transition-all duration-300 group-hover:scale-110 group-hover:opacity-100"
									aria-hidden="true"
								></span>

								<span class="relative">{item.label}</span>
							</a>
						</li>
					{/each}
				</ul>
			</nav>

			<!-- Mobile Menu Toggle -->
			<button
				class="menu-toggle flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-stone-300/40 bg-white/10 shadow-sm transition-all duration-200 hover:border-stone-400/60 hover:bg-white/20 focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 focus:outline-none md:hidden"
				on:click={toggleMenu}
				aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
				aria-expanded={isMenuOpen}
				aria-controls="mobile-navigation"
				aria-haspopup="true"
			>
				<span class="flex flex-col items-center justify-center gap-1" aria-hidden="true">
					<span
						class={`block h-0.5 w-4 rounded-full bg-stone-800 transition-all duration-200 ${isMenuOpen ? 'translate-y-[4.5px] rotate-45' : ''}`}
					></span>
					<span
						class={`block h-0.5 w-4 rounded-full bg-stone-800 transition-all duration-200 ${isMenuOpen ? 'scale-x-0 opacity-0' : ''}`}
					></span>
					<span
						class={`block h-0.5 w-4 rounded-full bg-stone-800 transition-all duration-200 ${isMenuOpen ? '-translate-y-[4.5px] -rotate-45' : ''}`}
					></span>
				</span>
			</button>
		</div>

		<!-- Mobile Navigation -->
		<nav
			id="mobile-navigation"
			class={`mobile-menu absolute right-0 left-0 mt-2 overflow-hidden rounded-xl border border-white/30 shadow-xl backdrop-blur-md transition-all duration-300 ${isMenuOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'}`}
			style="top: 100%; background: linear-gradient(135deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.4) 50%, rgba(245, 243, 241, 0.42) 100%); backdrop-filter: blur(20px) brightness(0.92); -webkit-backdrop-filter: blur(20px) brightness(0.92); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3);"
			aria-label="Mobile navigation"
			aria-hidden={!isMenuOpen}
		>
			<!-- Soft white transparent overlay -->
			<div class="pointer-events-none absolute inset-0 z-[1] bg-white/30" aria-hidden="true"></div>

			<!-- Darkening gradient overlay -->
			<div
				class="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/[0.04] to-black/[0.1]"
				aria-hidden="true"
			></div>

			<ul class="relative z-10 space-y-1 p-2" role="menu">
				{#each menuItems as item}
					<li role="none">
						<a
							href={item.href}
							class="group flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-stone-800 transition-all duration-200 hover:bg-white/20 hover:text-stone-900 focus:ring-2 focus:ring-stone-500 focus:outline-none"
							role="menuitem"
							tabindex={isMenuOpen ? 0 : -1}
							on:click={closeMenu}
						>
							<!-- Icon -->
							<span
								class="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-stone-700 transition-transform duration-200 group-hover:scale-125"
								aria-hidden="true"
							></span>

							<!-- Label -->
							<span>{item.label}</span>

							<!-- Arrow -->
							<span
								class="ml-auto -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
								aria-hidden="true"
							>
								<svg
									class="h-3.5 w-3.5 text-stone-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2.5"
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</span>
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</div>
</header>

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

	/* Smooth scroll behavior */
	:global(html) {
		scroll-behavior: smooth;
	}

	/* Add subtle hover lift animation */
	@keyframes float {
		0%,
		100% {
			transform: translateY(0px);
		}
		50% {
			transform: translateY(-2px);
		}
	}

	/* Reduce motion for accessibility */
	@media (prefers-reduced-motion: reduce) {
		* {
			animation-duration: 0.01ms !important;
			animation-iteration-count: 1 !important;
			transition-duration: 0.01ms !important;
		}

		:global(html) {
			scroll-behavior: auto;
		}
	}
</style>
