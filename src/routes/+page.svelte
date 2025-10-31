<script>
	import Protrait from '$images/portrait.jpg';
	const Hour = new Date().getHours();
	const Year = new Date().getFullYear();

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
		{
			time: '2024 - Present',
			name: 'NUCB International College',
			color: '#36746f',
			web: 'https://ic.nucba.ac.jp'
		},
		{
			time: '2022 - 2024',
			name: 'Kojimachi Junior High School',
			color: '#a0a0a0',
			web: 'https://www.fureai-cloud.jp/kojimachi-j/'
		}
	];

	const Experience = [
		{
			time: '2025 - Present',
			title: 'Developer',
			name: 'Japan Airline Virtual',
			color: '#dc2f21',
			web: 'https://jalvirtual.com/'
		},
		{
			time: '2024 - Present',
			title: 'Translator & Dev.',
			name: 'TecoStudio',
			color: '#228E76',
			web: 'https://tecostudio.cn'
		},
		{
			time: '2025',
			title: 'CTO',
			name: 'ANA Virtual Group',
			color: '#a0a0a0',
			web: 'https://anavirtualgroup.com/'
		}
	];
</script>

<div class="container mx-auto w-4xl border-x-2 border-solid border-neutral-700 p-6 antialiased">
	<h1 class="mt-8 py-2 text-4xl font-bold">{greeting} <br /> I am Jianyue Hugo Liang</h1>
	<h2 class="py-2 text-2xl font-bold">Developer | Translator | Student</h2>
	<p class="py-2 text-lg">Based in 🇯🇵 Japan</p>

	<!-- Photo Section -->
	<div></div>

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
					<li class="flex items-center gap-2">
						<span class="whitespace-nowrap">{item.time}</span>
						<div class="flex-1 border-t border-gray-300 dark:border-white/15"></div>
						<span class="whitespace-nowrap">
							<a href={item.web} target="_blank" class="font-bold" style="color: {item.color}">
								{item.name}
							</a>
						</span>
					</li>
				{/each}
			</ul>

			<h3 class="mt-4 text-xl font-bold">Experience</h3>
			<ul>
				{#each Experience as item (item.name)}
					<li class="flex items-center gap-2">
						<span class="whitespace-nowrap">{item.time}</span>
						<div class="flex-1 border-t border-gray-300 dark:border-white/15"></div>
						<span class="whitespace-nowrap">
							{item.title} at
							<a
								href={item.web}
								target="_blank"
								class="font-bold"
								style="color: {item.color}; hover:text-neutral-400"
							>
								{item.name}
							</a>
						</span>
					</li>
				{/each}
			</ul>
		</div>
	</div>

	<p class="mt-8 text-center text-neutral-400">
		&copy; {Year} Jianyue Hugo Liang, a.k.a. JHL-HK, All Rights Reserved. Powered by
		<a
			href="https://svelte.dev/"
			class="underline transition-all duration-300 hover:text-neutral-300">SvelteKit</a
		>
		&
		<a
			href="https://jianyuelab.org"
			class="underline transition-all duration-300 hover:text-neutral-300">JianyueLab</a
		>.
	</p>
</div>
