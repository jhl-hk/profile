<script lang="ts">
	import { MailIcon, MapPinIcon, CalendarIcon, GraduationCapIcon } from 'lucide-svelte';
	import GitHubIcon from '$components/icon/github.svelte';
	import LinkedInIcon from '$components/icon/linkedIn.svelte';
	import GlassCard from '$components/glassCard.svelte';
	import SkillCard from '$components/skillCard.svelte';
	import ExperienceCard from '$components/experienceCard.svelte';
	import { onMount } from 'svelte';

	let isVisible = false;

	onMount(() => {
		setTimeout(() => {
			isVisible = true;
		}, 100);
	});

	const education = [
		{
			title: 'NUCB International College',
			description: 'International Baccalaureate Diploma',
			period: '2024 - present'
		}
	];

	const experiences = [];

	const skills = [
		{
			title: 'Frontend',
			description: 'React, Vue, Svelte, TypeScript',
			icon: '🎨'
		},
		{
			title: 'Backend',
			description: 'Node.js, Python, Go',
			icon: '⚙️'
		},
		{
			title: 'Languages',
			description: 'Mandarin, English, Japanese',
			icon: '🌐'
		},
		{
			title: 'Tools',
			description: 'Git, Docker, Linux, CI/CD',
			icon: '🛠️'
		},
		{
			title: 'Database',
			description: 'PostgreSQL, MongoDB, Redis',
			icon: '💾'
		},
		{
			title: 'Cloud',
			description: 'AWS, Azure, Vercel',
			icon: '☁️'
		}
	];

	const socialLinks = [
		{
			href: 'https://github.com/jhl-hk',
			label: 'GitHub',
			icon: GitHubIcon,
			hoverColor: 'hover:text-gray-900',
			bgHover: 'hover:bg-gray-100/30'
		},
		{
			href: 'https://www.linkedin.com/in/jianyuehugoliang',
			label: 'LinkedIn',
			icon: LinkedInIcon,
			hoverColor: 'hover:text-blue-600',
			bgHover: 'hover:bg-blue-100/30'
		},
		{
			href: 'mailto:jhl@jhl.hk',
			label: 'Email',
			icon: MailIcon,
			hoverColor: 'hover:text-red-600',
			bgHover: 'hover:bg-red-100/30'
		}
	];
</script>

<!-- Hero Section -->
<GlassCard>
	<div
		class={`transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
	>
		<div class="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-8">
			<!-- Portrait with enhanced styling -->
			<div class="group relative flex-shrink-0">
				<div
					class="absolute -inset-1 animate-pulse rounded-full bg-gradient-to-r from-stone-600 via-stone-500 to-stone-400 opacity-75 blur transition duration-500 group-hover:opacity-100 group-hover:duration-200"
				></div>
				<div class="relative">
					<img
						src="/portrait.jpg"
						alt="Jianyue Hugo Liang Profile"
						class="h-32 w-32 rounded-full object-cover shadow-2xl ring-4 ring-white/20 transition-all duration-500 group-hover:scale-105 group-hover:ring-white/40 sm:h-40 sm:w-40 md:h-48 md:w-48"
						loading="eager"
					/>
					<div
						class="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
					></div>
					<!-- Status indicator -->
					<div
						class="absolute right-2 bottom-2 h-4 w-4 rounded-full border-4 border-white bg-green-500 shadow-lg sm:right-3 sm:bottom-3 sm:h-5 sm:w-5"
					></div>
				</div>
			</div>

			<!-- Info section -->
			<div class="min-w-0 flex-1 space-y-3 text-center md:space-y-4 md:text-left">
				<!-- Name and title -->
				<div>
					<h1 class="mb-2 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl md:text-4xl">
						Jianyue Hugo Liang
					</h1>
					<div
						class="mb-2 flex flex-wrap items-center justify-center gap-2 text-stone-700 md:justify-start"
					>
						<span
							class="inline-flex items-center gap-1.5 rounded-full bg-white/40 px-2.5 py-1 text-xs font-medium shadow-sm sm:px-3 sm:py-1.5 sm:text-sm"
						>
							<GraduationCapIcon class="h-3.5 w-3.5 sm:h-4 sm:w-4" />
							<span class="truncate">NUCB International College</span>
						</span>
					</div>
					<p class="text-sm font-medium text-stone-600 sm:text-base">
						Full Stack Developer | Translator | Aviation Enthusiast
					</p>
				</div>

				<!-- Quick facts -->
				<div class="flex flex-wrap justify-center gap-2 md:justify-start">
					<div
						class="inline-flex items-center gap-1.5 rounded-lg bg-white/30 px-2.5 py-1.5 text-xs text-stone-600 shadow-sm sm:px-3 sm:py-2 sm:text-sm"
					>
						<MapPinIcon class="h-3.5 w-3.5 text-stone-500 sm:h-4 sm:w-4" />
						<span>Japan</span>
					</div>
					<div
						class="inline-flex items-center gap-1.5 rounded-lg bg-white/30 px-2.5 py-1.5 text-xs text-stone-600 shadow-sm sm:px-3 sm:py-2 sm:text-sm"
					>
						<CalendarIcon class="h-3.5 w-3.5 text-stone-500 sm:h-4 sm:w-4" />
						<span>IB Diploma</span>
					</div>
				</div>

				<!-- Social links with enhanced styling -->
				<div class="flex flex-wrap justify-center gap-2 md:justify-start">
					{#each socialLinks as social}
						<a
							href={social.href}
							target="_blank"
							rel="noopener noreferrer"
							class="group inline-flex items-center gap-1.5 px-3 py-2 text-stone-700 {social.hoverColor} bg-white/30 {social.bgHover} rounded-lg border border-white/20 text-xs font-medium transition-all duration-200 hover:border-white/40 hover:shadow-md focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 focus:outline-none sm:gap-2 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm"
							aria-label={social.label}
						>
							<span class="transition-transform duration-200 group-hover:scale-110">
								<svelte:component this={social.icon} />
							</span>
							<span>{social.label}</span>
						</a>
					{/each}
				</div>
			</div>
		</div>
	</div>
</GlassCard>

<!-- About Section -->
<GlassCard className="mt-6">
	<div
		class={`space-y-8 transition-all delay-100 duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
	>
		<!-- Section header with decorative line -->
		<div class="space-y-3">
			<div class="flex items-center gap-3">
				<div
					class="h-8 w-1.5 rounded-full bg-gradient-to-b from-stone-600 to-stone-400 shadow-sm"
				></div>
				<h2 class="text-2xl font-bold tracking-tight text-stone-900 md:text-3xl">About Me</h2>
			</div>
			<div class="h-px bg-gradient-to-r from-stone-300 via-stone-200 to-transparent"></div>
		</div>

		<!-- About content -->
		<div class="space-y-4">
			<p class="text-base leading-relaxed font-medium text-stone-700 md:text-lg">
				I am an international student studying in Japan, passionate about <span
					class="font-semibold text-stone-900">technology</span
				>
				and <span class="font-semibold text-stone-900">aviation</span>.
			</p>
			<p class="text-base leading-relaxed text-stone-700 md:text-lg">
				Currently learning and striving to become a more professional full-stack developer. I also
				contribute to the open-source community as a translator, bridging language barriers in
				technology.
			</p>
		</div>

		<!-- Skills section -->
		<div class="space-y-6">
			<div class="flex items-center gap-3">
				<div class="h-6 w-1 rounded-full bg-gradient-to-b from-stone-500 to-stone-300"></div>
				<h3 class="text-xl font-semibold text-stone-900 md:text-2xl">Technical Skills</h3>
			</div>
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each skills as skill, index}
					<div
						class="transition-all duration-500"
						style={`transition-delay: ${index * 50 + 200}ms`}
						class:opacity-100={isVisible}
						class:translate-y-0={isVisible}
						class:opacity-0={!isVisible}
						class:translate-y-4={!isVisible}
					>
						<SkillCard title={skill.title} description={skill.description} icon={skill.icon} />
					</div>
				{/each}
			</div>
		</div>
	</div>
</GlassCard>

<!-- Education & Experience Section -->
<GlassCard className="mt-6">
	<div
		class={`space-y-8 transition-all delay-200 duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
	>
		<!-- Section header -->
		<div class="space-y-3">
			<div class="flex items-center gap-3">
				<div
					class="h-8 w-1.5 rounded-full bg-gradient-to-b from-stone-600 to-stone-400 shadow-sm"
				></div>
				<h2 class="text-2xl font-bold tracking-tight text-stone-900 md:text-3xl">
					Education & Experience
				</h2>
			</div>
			<div class="h-px bg-gradient-to-r from-stone-300 via-stone-200 to-transparent"></div>
		</div>

		<!-- Education -->
		<div class="space-y-4">
			<div class="flex items-center gap-3">
				<div class="h-6 w-1 rounded-full bg-gradient-to-b from-stone-500 to-stone-300"></div>
				<h3 class="text-xl font-semibold text-stone-900 md:text-2xl">Education</h3>
			</div>
			<div class="space-y-4">
				{#each education as edu, index}
					<div
						class="transition-all duration-500"
						style={`transition-delay: ${index * 100 + 300}ms`}
						class:opacity-100={isVisible}
						class:translate-y-0={isVisible}
						class:opacity-0={!isVisible}
						class:translate-y-4={!isVisible}
					>
						<ExperienceCard title={edu.title} description={edu.description} period={edu.period} />
					</div>
				{/each}
			</div>
		</div>

		<!-- Experience -->
		{#if experiences.length > 0}
			<div class="space-y-4">
				<div class="flex items-center gap-3">
					<div class="h-6 w-1 rounded-full bg-gradient-to-b from-stone-500 to-stone-300"></div>
					<h3 class="text-xl font-semibold text-stone-900 md:text-2xl">Experience</h3>
				</div>
				<div class="space-y-4">
					{#each experiences as experience, index}
						<div
							class="transition-all duration-500"
							style={`transition-delay: ${index * 100 + 400}ms`}
							class:opacity-100={isVisible}
							class:translate-y-0={isVisible}
							class:opacity-0={!isVisible}
							class:translate-y-4={!isVisible}
						>
							<ExperienceCard
								title={experience.title}
								description={experience.description}
								period={experience.period}
							/>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</GlassCard>
