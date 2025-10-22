<script lang="ts">
	import { CalendarIcon, BookOpenIcon } from 'lucide-svelte';
	export let title: string;
	export let description: string;
	export let period: string;
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

	<!-- Left accent bar -->
	<div
		class="absolute top-0 bottom-0 left-0 z-[3] w-1 bg-gradient-to-b from-stone-600 to-stone-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
		aria-hidden="true"
	></div>

	<div class="relative z-10 space-y-3">
		<div class="flex items-start justify-between gap-4">
			<div class="flex min-w-0 flex-1 items-start gap-3">
				<div
					class="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-stone-600/20 to-stone-400/20 transition-transform duration-300 group-hover:scale-110"
				>
					<BookOpenIcon class="h-4 w-4 text-stone-700" />
				</div>
				<div class="min-w-0 flex-1">
					<h4
						class="mb-1 text-lg font-semibold text-stone-900 transition-colors group-hover:text-stone-800"
					>
						{title}
					</h4>
					<p class="text-sm leading-relaxed text-stone-700">{description}</p>
				</div>
			</div>
		</div>
		<div class="flex items-center gap-2 text-stone-600">
			<CalendarIcon class="h-4 w-4 flex-shrink-0" />
			<p class="text-sm font-medium">{period}</p>
		</div>
	</div>
</div>
