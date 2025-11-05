<script lang="ts">
	import '../app.css';
	import Header from '$components/header.svelte';
	import SocialIcons from '$components/socialIcons.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>Jianyue Hugo Liang</title>
</svelte:head>

<Header />
{@render children?.()}
<SocialIcons />
