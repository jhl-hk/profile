<script lang="ts">
  export let className = '';
</script>

<div class="max-w-4xl mx-auto backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl relative overflow-hidden {className}"
     style="background: linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.18) 50%, rgba(245, 243, 241, 0.22) 100%); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2);">
  
  <!-- Gradient overlay -->
  <div class="absolute inset-0 bg-gradient-to-br from-stone-50/20 via-transparent to-stone-100/10 pointer-events-none" aria-hidden="true"></div>
  
  <!-- Content container -->
  <div class="relative z-10 p-8 md:p-8 sm:p-6">
    <slot />
  </div>
</div> 