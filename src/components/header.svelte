<script lang="ts">
	import { Home } from 'lucide-svelte';

	const Navigation = [{ label: 'Home', icon: Home, path: '/' }];
</script>

<!-- Header Absolute Positon on Left> -->
<header class="absolute top-1/2 left-0 h-auto -translate-y-1/2 pl-2">
	<nav class="rounded-lg p-2">
		<ul>
			{#each Navigation as item (item.path)}
				<li>
					<a href={item.path} class="flex items-center gap-2 py-2">
						<item.icon /><span class="hidden group-hover:inline">{item.label}</span></a
					>
				</li>
			{/each}
		</ul>
	</nav>
</header>
