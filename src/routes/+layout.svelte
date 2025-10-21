<script lang="ts">
	import '../app.css';
	import Header from '$components/header.svelte';
	import Footer from '$components/footer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>JHL-HK</title>
</svelte:head>

<div class="mx-auto max-w-3/4">
	<Header />
	{@render children()}
	<Footer />
</div>
