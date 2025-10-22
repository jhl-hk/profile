<script lang="ts">
	export let title: string;
	export let description: string;
	export let icon: string = '💼';
</script>

<div
	class="group relative overflow-hidden rounded-xl border border-white/30 bg-white/30 p-5 backdrop-blur-[20px] transition-all duration-300 hover:-translate-y-1 hover:border-white/50 hover:shadow-lg"
	style="backdrop-filter: blur(20px) brightness(0.92); -webkit-backdrop-filter: blur(20px) brightness(0.92);"
>
	<!-- Soft white transparent overlay -->
	<div class="pointer-events-none absolute inset-0 z-[1] bg-white/30" aria-hidden="true"></div>

	<!-- Darkening gradient overlay -->
	<div
		class="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/[0.04] to-black/[0.1]"
		aria-hidden="true"
	></div>

	<!-- Hover shine effect -->
	<div
		class="pointer-events-none absolute inset-0 z-[2] -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full"
		aria-hidden="true"
	></div>

	<div class="relative z-10 space-y-3">
		<div class="flex items-center gap-3">
			<span
				class="text-3xl transition-transform duration-300 group-hover:scale-110"
				aria-hidden="true">{icon}</span
			>
			<h4 class="text-lg font-semibold text-stone-900 transition-colors group-hover:text-stone-800">
				{title}
			</h4>
		</div>
		<p class="text-sm leading-relaxed text-stone-700">{description}</p>
	</div>
</div>
