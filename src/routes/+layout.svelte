<script lang="ts">
	import '../app.css';
	import Header from '$components/header.svelte';
	import Footer from '$components/footer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>JHL-HK</title>
</svelte:head>

<div class="min-h-screen">
	<Header />
	<main class="px-2 pt-28">
		{@render children()}
	</main>
	<Footer />
</div>
