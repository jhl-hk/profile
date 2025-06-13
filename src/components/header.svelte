<script lang="ts">
  import { onMount } from 'svelte';
  
  let isMenuOpen = false;
  let scrollY = 0;
  let headerRef: HTMLElement;
  
  const toggleMenu = () => {
    isMenuOpen = !isMenuOpen;
    
    // Focus management for mobile menu
    if (isMenuOpen) {
      // Focus first menu item when menu opens
      setTimeout(() => {
        const firstMenuItem = headerRef?.querySelector('.mobile-menu a');
        if (firstMenuItem instanceof HTMLElement) {
          firstMenuItem.focus();
        }
      }, 100);
    }
  };
  
  const closeMenu = () => {
    isMenuOpen = false;
  };
  
  // Keyboard navigation support
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isMenuOpen) {
      closeMenu();
      // Return focus to menu toggle button
      const menuToggle = headerRef?.querySelector('.menu-toggle');
      if (menuToggle instanceof HTMLElement) {
        menuToggle.focus();
      }
    }
  };
  
  // Close menu when clicking outside
  const handleOutsideClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.mobile-menu') && !target.closest('.menu-toggle')) {
      closeMenu();
    }
  };
  
  // Throttled scroll handler for better performance
  let scrollTimeout: number;
  const handleScroll = () => {
    if (scrollTimeout) {
      cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = requestAnimationFrame(() => {
      scrollY = window.scrollY;
    });
  };
  
  onMount(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleKeydown);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleOutsideClick);
      document.removeEventListener('keydown', handleKeydown);
      if (scrollTimeout) {
        cancelAnimationFrame(scrollTimeout);
      }
    };
  });

  const menuItems = [
    { label: 'Blog', href: '#blog' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ];
</script>

<svelte:window bind:scrollY />

<header 
  bind:this={headerRef}
  class="fixed top-0 left-0 right-0 z-50 p-4 pointer-events-none"
>
  <div class={`max-w-4xl mx-auto backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl transition-all duration-300 pointer-events-auto relative overflow-hidden ${scrollY > 50 ? 'shadow-xl backdrop-blur-lg' : ''}`} 
       style="background: linear-gradient(135deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.38) 50%, rgba(245, 243, 241, 0.42) 100%); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3);">
    
    <!-- Gradient overlays -->
    <div class="absolute inset-0 bg-gradient-to-br from-stone-50/40 via-transparent to-stone-100/30 pointer-events-none" aria-hidden="true"></div>
    
    <div class="px-6 flex items-center justify-between relative z-10 py-3">
      <!-- Logo/Brand -->
      <div class="flex items-center">
        <a href="/" class="flex flex-col items-start group focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 rounded-lg p-1 -m-1 transition-all duration-300 hover:-translate-y-0.5" aria-label="Jianyue Hugo Liang - Home">
          <div class="flex items-center mb-1">
            <span class="text-2xl font-bold text-stone-800 drop-shadow-sm group-hover:text-stone-700 transition-colors duration-300 tracking-tight">Jianyue Hugo Liang</span>
            <div class="w-2.5 h-2.5 bg-gradient-to-r from-stone-600 via-stone-500 to-stone-400 rounded-full ml-3 shadow-sm group-hover:scale-110 group-hover:animate-pulse transition-transform duration-300" aria-hidden="true"></div>
          </div>
          <span class="text-sm text-stone-600 font-semibold drop-shadow-sm opacity-90 group-hover:opacity-100 transition-opacity duration-300">Full-Stack Developer | Translator | Student</span>
        </a>
      </div>
      
      <!-- Desktop Navigation -->
      <nav class="hidden md:block" aria-label="Main navigation">
        <ul class="flex items-center space-x-1">
          {#each menuItems as item, index}
            <li>
              <a 
                href={item.href} 
                class="text-stone-600 font-semibold text-sm px-5 py-2.5 rounded-lg hover:text-stone-800 hover:bg-white/10 hover:bg-white/5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 hover:-translate-y-0.5 hover:shadow-md"
                tabindex="0"
                role="menuitem"
              >
                {item.label}
              </a>
            </li>
          {/each}
        </ul>
      </nav>
      
      <!-- Mobile Menu Toggle -->
      <button 
        class="md:hidden flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 menu-toggle hover:bg-white/10 dark:hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 hover:scale-105"
        on:click={toggleMenu}
        aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isMenuOpen}
        aria-controls="mobile-navigation"
        aria-haspopup="true"
      >
        <span class="hamburger-container" aria-hidden="true">
          <span class={`block w-4.5 h-0.5 bg-stone-500 rounded transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
          <span class={`block w-4.5 h-0.5 bg-stone-500 rounded transition-all duration-300 mt-1 ${isMenuOpen ? 'opacity-0 scale-x-0' : ''}`}></span>
          <span class={`block w-4.5 h-0.5 bg-stone-500 rounded transition-all duration-300 mt-1 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
        </span>
      </button>
    </div>
    
    <!-- Mobile Navigation -->
    <nav 
      id="mobile-navigation"
      class={`mobile-menu absolute left-0 right-0 mt-2 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl transition-all duration-300 overflow-hidden ${isMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}
      style="top: 100%; background: linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.18) 50%, rgba(245, 243, 241, 0.22) 100%); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2);"
      aria-label="Mobile navigation"
      aria-hidden={!isMenuOpen}
    >
      <ul class="p-4 space-y-1 relative z-10" role="menu">
        {#each menuItems as item, index}
          <li role="none">
            <a 
              href={item.href} 
              class="block text-stone-700 font-semibold px-5 py-3.5 rounded-lg hover:text-stone-800 hover:bg-white/10 hover:bg-white/5 transition-all duration-300 group relative overflow-hidden drop-shadow-sm focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 hover:-translate-y-0.5"
              role="menuitem"
              tabindex={isMenuOpen ? 0 : -1}
              on:click={closeMenu}
            >
              {item.label}
            </a>
          </li>
        {/each}
      </ul>
    </nav>
  </div>
</header>

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

  /* Custom hamburger container for better spacing */
  .hamburger-container {
    display: flex;
    flex-direction: column;
    width: 1rem;
    height: 0.75rem;
    position: relative;
  }

  /* Reduce motion for accessibility */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
</style>
