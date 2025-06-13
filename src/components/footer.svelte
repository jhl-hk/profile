<script lang="ts">
  import { onMount } from 'svelte';
  import GitHubIcon from '$components/icon/github.svelte';
  import LinkedInIcon from '$components/icon/linkedIn.svelte';
  import { MailIcon } from 'lucide-svelte';
  import GlassCard from '$components/glassCard.svelte';
  
  let footerRef: HTMLElement;
  let currentYear = new Date().getFullYear();
  let isVisible = false;
  
  // Social links with proper URLs and icons
  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/JHL-HK',
      icon: GitHubIcon,
      hoverColor: 'hover:text-gray-900',
      bgColor: 'hover:bg-gray-100/20',
      ariaLabel: 'Visit my GitHub profile'
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/jianyuehugoliang',
      icon: LinkedInIcon,
      hoverColor: 'hover:text-blue-600',
      bgColor: 'hover:bg-blue-100/20',
      ariaLabel: 'Connect with me on LinkedIn'
    },
    {
      name: 'Email',
      url: 'mailto:ja@jhl.hk',
      icon: MailIcon,
      hoverColor: 'hover:text-red-600',
      bgColor: 'hover:bg-red-100/20',
      ariaLabel: 'Send me an email'
    },
  ];
  
  const quickLinks = [
    { name: 'Blog', href: '#blog', description: 'Read my latest articles' },
    { name: 'Projects', href: '#projects', description: 'View my work' },
    { name: 'Contact', href: '#contact', description: 'Get in touch' }
  ];
  
  const techStack = [
    { name: 'TypeScript', category: 'language' },
    { name: 'Svelte', category: 'framework' },
    { name: 'React', category: 'framework' },
    { name: 'Node.js', category: 'runtime' },
    { name: 'Python', category: 'language' },
    { name: 'Go', category: 'language' }
  ];
  
  // Intersection Observer for fade-in animation
  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible = true;
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (footerRef) {
      observer.observe(footerRef);
    }
    
    return () => {
      if (footerRef) {
        observer.unobserve(footerRef);
      }
    };
  });
  
  // Smooth scroll to section
  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
</script>

<footer
  bind:this={footerRef}
  class="mt-6"
  aria-label="Site footer"
>
  <GlassCard>
    <div class="">
      <!-- Main Footer Content -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <!-- Brand Section -->
        <section class={`md:col-span-1 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`} 
                 style="animation-delay: 0.1s"
                 aria-labelledby="brand-heading">
          <div class="mb-4">
            <h2 id="brand-heading" class="text-xl font-bold text-stone-800 mb-2 drop-shadow-sm">
              Jianyue Hugo Liang
            </h2>
            <div class="w-12 h-0.5 bg-gradient-to-r from-stone-600 via-stone-500 to-stone-400 rounded-full shadow-sm"></div>
          </div>
          
          <p class="text-sm text-stone-600 leading-relaxed mb-4 font-medium drop-shadow-sm">
            An international student who is passionate about technology and aviation.
          </p>
          
          <div class="inline-flex items-center text-xs text-stone-600 bg-white/30 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/40 shadow-sm font-medium">
            <span class="mr-2 text-amber-600" aria-hidden="true">🌍</span>
            <span>Based in Japan</span>
          </div>
        </section>
        
        <!-- Quick Links -->
        <nav class={`md:col-span-1 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
             style="animation-delay: 0.2s"
             aria-labelledby="quick-links-heading">
          <h3 id="quick-links-heading" class="text-sm font-semibold text-stone-700 mb-4 flex items-center drop-shadow-sm">
            <span class="w-2 h-2 bg-gradient-to-r from-stone-600 to-stone-500 rounded-full mr-2 shadow-sm" aria-hidden="true"></span>
            Quick Links
          </h3>
          
          <ul class="space-y-3">
            {#each quickLinks as link}
              <li>
                <a 
                  href={link.href}
                  class="text-sm text-stone-600 hover:text-stone-800 transition-all duration-200 flex items-center group font-medium drop-shadow-sm focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 rounded-sm py-1 hover:translate-x-1"
                  on:click|preventDefault={() => scrollToSection(link.href)}
                  aria-label={link.description}
                >
                  <span class="w-1 h-1 bg-stone-400 dark:bg-stone-400 rounded-full mr-3 group-hover:bg-stone-600 group-hover:shadow-sm group-hover:scale-125 transition-all duration-200" aria-hidden="true"></span>
                  <span>{link.name}</span>
                </a>
              </li>
            {/each}
          </ul>
        </nav>
        
        <!-- Social Links -->
        <section class={`md:col-span-1 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                 style="animation-delay: 0.3s"
                 aria-labelledby="social-heading">
          <h3 id="social-heading" class="text-sm font-semibold text-stone-700 mb-4 flex items-center drop-shadow-sm">
            <span class="w-2 h-2 bg-gradient-to-r from-stone-600 to-stone-500 rounded-full mr-2 shadow-sm" aria-hidden="true"></span>
            Let's Connect
          </h3>
          
          <div class="grid grid-cols-2 gap-3">
            {#each socialLinks as social}
              <a 
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center text-sm text-stone-600 {social.hoverColor} {social.bgColor} transition-all duration-300 bg-white/15 hover:bg-white/25 rounded-lg px-3 py-2 group border border-white/25 hover:border-white/35 backdrop-blur-sm shadow-sm hover:shadow-md drop-shadow-sm focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 hover:-translate-y-0.5"
                aria-label={social.ariaLabel}
              >
                <span class="mr-2 group-hover:scale-110 transition-transform duration-200" aria-hidden="true">
                  <social.icon />
                </span>
                <span class="truncate font-medium">{social.name}</span>
              </a>
            {/each}
          </div>
        </section>
      </div>
      
      <!-- Tech Stack -->
      <section class={`mb-8 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
               style="animation-delay: 0.4s"
               aria-labelledby="tech-heading">
        <h3 id="tech-heading" class="sr-only">Technologies I work with</h3>
        <div class="flex flex-wrap gap-2 justify-center">
          {#each techStack as tech}
            <span 
              class="inline-flex items-center text-xs px-3 py-2 bg-white/20 text-stone-600 rounded-full border border-white/30 hover:bg-white/30 hover:border-white/40 transition-all duration-200 backdrop-blur-sm shadow-sm hover:shadow-md font-medium cursor-default hover:-translate-y-0.5"
              title={`${tech.name} - ${tech.category}`}
              role="img"
              aria-label={tech.name}
            >
              <span>{tech.name}</span>
            </span>
          {/each}
        </div>
      </section>
      
      <!-- Divider -->
      <div class={`relative mb-6 transition-all duration-700 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
           style="animation-delay: 0.5s"
           aria-hidden="true">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full h-px bg-gradient-to-r from-transparent via-stone-300/50 to-transparent"></div>
        </div>
        <div class="relative flex justify-center">
          <div class="w-16 h-px bg-gradient-to-r from-stone-500 via-stone-400 to-stone-300 shadow-sm"></div>
        </div>
      </div>
      
      <!-- Bottom Section -->
      <div class={`flex flex-col md:flex-row justify-between items-center text-sm text-stone-400 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
           style="animation-delay: 0.6s">
        <div class="flex items-center mb-2 md:mb-0 font-medium drop-shadow-sm">
          <span class="mr-1 text-stone-400" aria-hidden="true">©</span>
          <span class="text-stone-400">{currentYear} JHL-HK. All rights reserved.</span>
        </div>
        
        <div class="flex items-center font-medium drop-shadow-sm">
          <span class="text-stone-400">Built with</span>
          <span class="text-rose-500 mx-1 animate-pulse" aria-hidden="true">❤️</span>
          <span class="text-stone-400">using SvelteKit</span>
        </div>
      </div>
    </div>
  </GlassCard>
</footer>

<style>
  /* Screen Reader Only */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* Custom animations for reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
</style>
