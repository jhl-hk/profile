<script lang="ts">
	import { Github, Linkedin, Instagram, Mail } from 'lucide-svelte';

	const Socials = [
		{ label: 'Mail', icon: Mail, path: 'mailto:ja@jhl.hk' },
		{ label: 'GitHub', icon: Github, path: 'https://github.com/jhl-hk' },
		{ label: 'LinkedIn', icon: Linkedin, path: 'https://linkedin.com/in/jhl-hk' },
		{ label: 'Instagram', icon: Instagram, path: 'https://instagram.com/jianyuehugo' }
	];
</script>

<!-- Header Absolute Positon on Left> -->
<footer class="absolute top-1/2 right-0 h-auto -translate-y-1/2 pr-2">
	<nav class="rounded-lg p-2">
		<ul>
			{#each Socials as item (item.path)}
				<li>
					<a href={item.path} class="flex items-center gap-2 py-2"><item.icon /></a>
				</li>
			{/each}
		</ul>
	</nav>
</footer>
