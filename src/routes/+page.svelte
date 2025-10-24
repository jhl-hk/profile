<script>
	const Hour = new Date().getHours();

	let greeting;
	if (Hour < 12) {
		greeting = 'Good morning!';
	} else if (Hour < 18) {
		greeting = 'Good afternoon!';
		console.log(greeting);
	} else {
		greeting = 'Good evening!';
	}
</script>

<div class="container mx-auto w-4xl border-x-2 border-solid border-neutral-700 p-6 antialiased">
	<h1 class="mt-8 py-2 text-4xl font-bold">{greeting}, <br /> I am Jianyue Hugo Liang</h1>
	<h2 class="py-2 text-2xl font-bold">Developer | Translator | Student</h2>
	<p class="py-2 text-lg">Based in 🇯🇵 Japan</p>
</div>
