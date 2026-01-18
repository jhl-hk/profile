<script setup lang="ts">
const appConfig = useAppConfig();
const profile = appConfig.profile;
</script>

<template>
  <header class="lg:sticky lg:top-0 lg:h-screen p-6 lg:p-8 flex flex-col">
    <!-- Profile Section -->
    <div
      class="flex flex-col items-center lg:items-start text-center lg:text-left mb-8"
    >
      <!-- Avatar -->
      <div class="mb-4">
        <img
          src="~/assets/image/portrait.jpg"
          alt="Profile"
          class="w-32 h-32 rounded-full object-cover ring-4 ring-primary-500/20"
        />
      </div>

      <!-- Name & Title -->
      <h1 class="text-xl font-bold text-default mb-1 leading-tight">
        {{ profile.name }}
      </h1>
      <p class="text-primary-500 text-sm font-medium mb-3 leading-tight">
        {{ profile.title }}
      </p>

      <!-- Bio -->
      <p class="text-muted text-xs max-w-xs leading-relaxed">
        {{ profile.bio }}
      </p>
    </div>

    <!-- Navigation -->
    <nav class="mb-8">
      <ul
        class="flex flex-row lg:flex-col justify-center lg:justify-start gap-2"
      >
        <li v-for="item in profile.nav" :key="item.to">
          <NuxtLink
            :to="item.to"
            class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-muted hover:text-default hover:bg-elevated transition-all duration-200"
            active-class="!text-primary-500 !bg-primary-500/10 font-medium"
          >
            <UIcon :name="item.icon" class="w-5 h-5 flex-shrink-0" />
            <span class="hidden lg:inline">{{ item.label }}</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <!-- Spacer -->
    <div class="flex-1 hidden lg:block"></div>

    <!-- Social Links -->
    <div class="flex justify-center lg:justify-start gap-3">
      <a
        v-for="social in profile.social"
        :key="social.label"
        :href="social.url"
        :aria-label="social.label"
        target="_blank"
        rel="noopener noreferrer"
        class="p-2.5 rounded-lg text-muted hover:text-primary-500 hover:bg-elevated transition-all duration-200"
      >
        <UIcon :name="social.icon" class="w-5 h-5" />
      </a>
    </div>
  </header>
</template>
