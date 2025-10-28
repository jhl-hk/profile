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

	const Education = [
		{ time: '2024 - Present', name: 'NUCB International College' },
		{ time: '2022 - 2024', name: 'Kojimachi Junior High School' }
	];
	const Experience = [
		{ time: '2025 - Present', title: 'Developer', name: 'Japan Airline Virtual' },
		{ time: '2025', title: 'CTO', name: 'ANA Virtual Group' }
	];
</script>

<div class="container mx-auto w-4xl border-x-2 border-solid border-neutral-700 p-6 antialiased">
	<h1 class="mt-8 py-2 text-4xl font-bold">{greeting} <br /> I am Jianyue Hugo Liang</h1>
	<h2 class="py-2 text-2xl font-bold">Developer | Translator | Student</h2>
	<p class="py-2 text-lg">Based in 🇯🇵 Japan</p>

	<!-- Personal Information -->
	<div class="mt-6 grid grid-cols-2 gap-4">
		<div>
			<h3 class="text-xl font-bold">About Me</h3>
			<p>
				I am an international student studying in Japan, passionate about technology and aviation.
				Currently learning and striving to become a more professional full-stack developer. I also
				contribute to the open-source community as a translator, bridging language barriers in
				technology.
			</p>
		</div>
		<div>
			<h3 class="text-xl font-bold">Education</h3>
			<ul>
				{#each Education as item (item.name)}
					<li>{item.time} <span class=" font-bold">{item.name}</span></li>
				{/each}
			</ul>

			<h3 class="mt-4 text-xl font-bold">Experience</h3>
			<ul>
				{#each Experience as item (item.name)}
					<li>{item.time} {item.title} at <span class=" font-bold"> {item.name}</span></li>
				{/each}
			</ul>
		</div>
	</div>

	<!-- Blog -->
	<div></div>
</div>
