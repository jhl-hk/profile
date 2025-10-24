<script lang="ts">
	import { Github, Linkedin } from 'lucide-svelte';

	const Socials = [
		{ label: 'GitHub', icon: Github, path: '#github' },
		{ label: 'LinkedIn', icon: Linkedin, path: '#linkedin' }
	];
</script>

<!-- Header Absolute Positon on Left> -->
<header class="absolute top-1/2 right-0 h-auto -translate-y-1/2 pr-2">
	<nav class="rounded-lg p-2">
		<ul>
			{#each Socials as item (item.path)}
				<li>
					<a href={item.path} class="flex items-center gap-2 py-2"><item.icon /></a>
				</li>
			{/each}
		</ul>
	</nav>
</header>
