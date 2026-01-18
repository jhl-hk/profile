<template>
  <UApp>
    <div class="min-h-screen bg-default">
      <div class="flex flex-col lg:grid lg:grid-cols-6 min-h-screen w-full">
        <!-- Sidebar -->
        <aside class="lg:col-span-1 lg:border-r border-default bg-muted/30">
          <AppHeader />
        </aside>

        <!-- Main Content -->
        <div class="flex-1 lg:col-span-5 flex flex-col min-h-screen">
          <main class="flex-1 bg-default">
            <NuxtPage />
          </main>
          <AppFooter />
        </div>
      </div>
    </div>
  </UApp>
</template>
