<script setup lang="ts">
const appConfig = useAppConfig();
const profile = appConfig.profile;
</script>

<template>
  <footer class="border-t border-default px-6 lg:px-8 py-6 text-center">
    <p class="text-xs text-muted">
      &copy; {{ new Date().getFullYear() }} {{ profile.name }}
    </p>
   <a href="https://icp.gov.moe/?keyword=20260331" target="_blank">萌ICP备20260331号</a>
  </footer>
</template>
