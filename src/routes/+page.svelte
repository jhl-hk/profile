<script lang="ts">
  import { MailIcon } from 'lucide-svelte';
  import GitHubIcon from '$components/icon/github.svelte';
  import LinkedInIcon from '$components/icon/linkedIn.svelte';
  import GlassCard from '$components/glassCard.svelte';
  import SkillCard from '$components/skillCard.svelte';
  import ExperienceCard from '$components/experienceCard.svelte';

  const education = [
    {
      title: 'NUCB International College',
      description: 'International Baccalaureate Diploma',
      period: '2024 - present',
    },
  ];

  const experiences = [
  ];
</script>

<GlassCard className="mt-30">
  <!-- Profile section -->
  <div class="flex flex-col items-center space-y-6">
    <!-- Portrait with hover effect -->
    <div class="relative group">
      <img src="/portrait.jpg" 
           alt="Profile" 
           class="w-48 h-48 rounded-full object-cover transition-transform duration-300 group-hover:scale-105 shadow-lg"
           loading="eager">
      <div class="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
    
    <!-- Name and title -->
    <div class="text-center">
      <h1 class="text-3xl font-bold text-stone-900 mb-2">Jianyue Hugo Liang</h1>
      <p class="text-lg text-stone-700">Student at NUCB Internationall College</p>
      <p class="text-md text-stone-600 mt-2">Full Stack Developer | Translator | Student</p>
    </div>
    
    <!-- Social links -->
    <div class="flex space-x-4">
      <a href="https://github.com/jhl-hk" class="text-stone-700 hover:text-gray-900 transition-colors" aria-label="GitHub">
        <GitHubIcon />
      </a>
      <a href="https://www.linkedin.com/in/jianyuehugoliang" class="text-stone-700 hover:text-blue-600 transition-colors" aria-label="LinkedIn">
        <LinkedInIcon />
      </a>
      <a href="mailto:jhl@jhl.hk" class="text-stone-700 hover:text-red-600 transition-colors" aria-label="Email">
        <MailIcon />
      </a>
    </div>
  </div>
</GlassCard>

<GlassCard className="mt-6">
  <!-- About section -->
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-stone-900">About Me</h2>
    <p class="text-stone-700 leading-relaxed">
      I am a international student studying in Japan. Passionate about technology and aviation. 
      I am still learning and trying to become a more professional full-stack developer.
      At same time, I am also a translator who contributing to the open-source community.
    </p>
    
    <!-- Skills section -->
    <div class="mt-8">
      <h3 class="text-xl font-semibold text-stone-900 mb-4">Skills</h3>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <SkillCard title="Frontend" description="React, Vue, Svelte, TypeScript" />
        <SkillCard title="Backend" description="Node.js, Python, Go" />
        <SkillCard title="Languages" description="Mandarin, English, Japanese" />
      </div>
    </div>
  </div>
</GlassCard>

<GlassCard className="mt-6">
  <!-- Education and Experience section -->
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-stone-900">Education & Experience</h2>
    
    <!-- Education -->
    <div class="space-y-4">
      <h3 class="text-xl font-semibold text-stone-900">Education</h3>
      {#each education as edu}
        <ExperienceCard 
          title={edu.title}
          description={edu.description}
          period={edu.period}
        />
      {/each}
    </div>

    <!-- Experience -->
    <div class="space-y-4">
      <h3 class="text-xl font-semibold text-stone-900">Experience</h3>
      {#each experiences as experience}
        <ExperienceCard 
          title={experience.title}
          description={experience.description}
          period={experience.period}
        />
      {/each}
    </div>
  </div>
</GlassCard>
