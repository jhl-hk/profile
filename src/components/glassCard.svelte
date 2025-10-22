<script lang="ts">
	export let className = '';
</script>

<div
	class="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-white/20 shadow-2xl backdrop-blur-md {className}"
	style="background: linear-gradient(135deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.4) 50%, rgba(245, 243, 241, 0.42) 100%); backdrop-filter: blur(20px) brightness(0.92); -webkit-backdrop-filter: blur(20px) brightness(0.92); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3);"
>
	<!-- Soft white transparent overlay -->
	<div class="pointer-events-none absolute inset-0 z-[1] bg-white/30" aria-hidden="true"></div>

	<!-- Darkening gradient overlay -->
	<div
		class="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/[0.04] to-black/[0.1]"
		aria-hidden="true"
	></div>

	<!-- Content container -->
	<div class="relative z-10 p-4 sm:p-6 md:p-8">
		<slot />
	</div>
</div>
