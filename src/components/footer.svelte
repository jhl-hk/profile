<script lang="ts">
  import { onMount } from 'svelte';
  
  let footerRef: HTMLElement;
  let currentYear = new Date().getFullYear();
  let isVisible = false;
  
  // Social links with proper URLs and icons
  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/JHL-HK',
      icon: 'github',
      hoverColor: 'hover:text-gray-900',
      bgColor: 'hover:bg-gray-100/20',
      ariaLabel: 'Visit my GitHub profile'
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/jianyuehugoliang',
      icon: 'linkedin',
      hoverColor: 'hover:text-blue-600',
      bgColor: 'hover:bg-blue-100/20',
      ariaLabel: 'Connect with me on LinkedIn'
    },
    {
      name: 'Email',
      url: 'mailto:ja@jhl.hk',
      icon: 'mail',
      hoverColor: 'hover:text-red-600',
      bgColor: 'hover:bg-red-100/20',
      ariaLabel: 'Send me an email'
    },
  ];
  
  const quickLinks = [
    { name: 'About', href: '#about', description: 'Learn about my background' },
    { name: 'Blog', href: '#blog', description: 'Read my latest articles' },
    { name: 'Projects', href: '#projects', description: 'View my work' },
    { name: 'Contact', href: '#contact', description: 'Get in touch' }
  ];
  
  const techStack = [
    { name: 'TypeScript', icon: '🔷', category: 'language' },
    { name: 'Svelte', icon: '🧡', category: 'framework' },
    { name: 'React', icon: '⚛️', category: 'framework' },
    { name: 'Node.js', icon: '🟢', category: 'runtime' },
    { name: 'Python', icon: '🐍', category: 'language' },
    { name: 'Go', icon: '🔵', category: 'language' }
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
  
  // Get appropriate icon for social links
  const getIcon = (iconName: string) => {
    const icons = {
      github: '⚡',
      linkedin: '💼',
      mail: '✉️',
      twitter: '🐦'
    };
    return icons[iconName as keyof typeof icons] || '🔗';
  };
  
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
  class="p-4 pointer-events-none mt-16"
  aria-label="Site footer"
>
  <div class={`max-w-4xl mx-auto backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl pointer-events-auto overflow-hidden relative transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`} 
       style="background: linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.18) 50%, rgba(240, 242, 247, 0.22) 100%); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2);">
    
    <!-- Gradient overlay -->
    <div class="absolute inset-0 bg-gradient-to-br from-white/12 via-transparent to-slate-50/8 pointer-events-none" aria-hidden="true"></div>
    
    <div class="p-8 md:p-8 sm:p-6 relative z-10">
      <!-- Main Footer Content -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <!-- Brand Section -->
        <section class={`md:col-span-1 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`} 
                 style="animation-delay: 0.1s"
                 aria-labelledby="brand-heading">
          <div class="mb-4">
            <h2 id="brand-heading" class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 drop-shadow-sm">
              Jianyue Hugo Liang
            </h2>
            <div class="w-12 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full shadow-sm"></div>
          </div>
          
          <p class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4 font-medium drop-shadow-sm">
            Full-Stack Developer passionate about creating innovative solutions 
            and bridging cultures through technology and thoughtful design.
          </p>
          
          <div class="inline-flex items-center text-xs text-slate-600 dark:text-slate-500 bg-white/30 dark:bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/40 dark:border-white/20 shadow-sm font-medium">
            <span class="mr-2 text-amber-600" aria-hidden="true">🌍</span>
            <span>Based in Japan</span>
          </div>
        </section>
        
        <!-- Quick Links -->
        <nav class={`md:col-span-1 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
             style="animation-delay: 0.2s"
             aria-labelledby="quick-links-heading">
          <h3 id="quick-links-heading" class="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center drop-shadow-sm">
            <span class="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mr-2 shadow-sm" aria-hidden="true"></span>
            Quick Links
          </h3>
          
          <ul class="space-y-3">
            {#each quickLinks as link}
              <li>
                <a 
                  href={link.href}
                  class="text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200 flex items-center group font-medium drop-shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-sm py-1 hover:translate-x-1"
                  on:click|preventDefault={() => scrollToSection(link.href)}
                  aria-label={link.description}
                >
                  <span class="w-1 h-1 bg-slate-500 dark:bg-slate-400 rounded-full mr-3 group-hover:bg-indigo-600 group-hover:shadow-sm group-hover:scale-125 transition-all duration-200" aria-hidden="true"></span>
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
          <h3 id="social-heading" class="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center drop-shadow-sm">
            <span class="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-2 shadow-sm" aria-hidden="true"></span>
            Let's Connect
          </h3>
          
          <div class="grid grid-cols-2 gap-3">
            {#each socialLinks as social}
              <a 
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center text-sm text-slate-700 dark:text-slate-300 {social.hoverColor} dark:{social.hoverColor} {social.bgColor} dark:{social.bgColor} transition-all duration-300 bg-white/15 dark:bg-white/5 hover:bg-white/25 dark:hover:bg-white/10 rounded-lg px-3 py-2 group border border-white/25 dark:border-white/10 hover:border-white/35 dark:hover:border-white/20 backdrop-blur-sm shadow-sm hover:shadow-md drop-shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 hover:-translate-y-0.5"
                aria-label={social.ariaLabel}
              >
                <span class="mr-2 group-hover:scale-110 transition-transform duration-200" aria-hidden="true">{getIcon(social.icon)}</span>
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
              class="inline-flex items-center text-xs px-3 py-2 bg-white/20 dark:bg-white/5 text-slate-700 dark:text-slate-300 rounded-full border border-white/30 dark:border-white/10 hover:bg-white/30 dark:hover:bg-white/10 hover:border-white/40 dark:hover:border-white/20 transition-all duration-200 backdrop-blur-sm shadow-sm hover:shadow-md font-medium cursor-default hover:-translate-y-0.5"
              title={`${tech.name} - ${tech.category}`}
              role="img"
              aria-label={tech.name}
            >
              <span class="mr-2 text-sm" aria-hidden="true">{tech.icon}</span>
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
          <div class="w-full h-px bg-gradient-to-r from-transparent via-slate-400/50 dark:via-slate-500/50 to-transparent"></div>
        </div>
        <div class="relative flex justify-center">
          <div class="w-16 h-px bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-400 shadow-sm"></div>
        </div>
      </div>
      
      <!-- Bottom Section -->
      <div class={`flex flex-col md:flex-row justify-between items-center text-sm text-slate-600 dark:text-slate-400 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
           style="animation-delay: 0.6s">
        <div class="flex items-center mb-2 md:mb-0 font-medium drop-shadow-sm">
          <span class="mr-1 text-slate-500 dark:text-slate-400" aria-hidden="true">©</span>
          <span>{currentYear} JHL-HK. All rights reserved.</span>
        </div>
        
        <div class="flex items-center font-medium drop-shadow-sm">
          <span>Built with</span>
          <span class="text-rose-500 mx-1 animate-pulse" aria-hidden="true">❤️</span>
          <span>using SvelteKit</span>
        </div>
      </div>
    </div>
  </div>
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
