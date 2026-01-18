<script setup lang="ts">
const appConfig = useAppConfig();
const profile = appConfig.profile;

// Featured projects
const featuredProjects = [
  {
    title: "JianyueLab Ltd.",
    description:
      "英国で設立したテクノロジー企業。Web開発、ドメイン管理、アプリケーション開発を手がける。",
    tags: ["起業", "Web開発", "TypeScript"],
    url: "https://jianyuelab.co",
    image: null,
  },
  {
    title: "Postal Wiki",
    description:
      "郵便システム、ポストカード等に特化したWikiプロジェクト。2023年から運営中。",
    tags: ["Wiki", "コミュニティ", "郵便"],
    url: "https://postal.wiki",
    image: null,
  },
  {
    title: "JianyueLab Org.",
    description: "JianyueLab Ltd.のオープンソース・コミュニティプロジェクト。",
    tags: ["オープンソース", "コミュニティ"],
    url: "https://jianyuelab.org",
    image: null,
  },
];
</script>

<template>
  <main class="p-6 lg:p-8 lg:py-12">
    <!-- Hero Section -->
    <section class="mb-16">
      <div class="max-w-2xl">
        <p class="text-primary-500 font-medium mb-2">こんにちは、私は</p>
        <h1 class="text-4xl lg:text-5xl font-bold text-default mb-4">
          {{ profile.name }}
        </h1>
        <p class="text-xl text-muted mb-6 leading-relaxed">
          {{ profile.bio }}
          <br class="hidden sm:block" />
          スタートアップ経営とWeb開発に情熱を注ぐ、東京在住の起業家です。
        </p>
        <div class="flex flex-wrap gap-3">
          <UButton to="/projects" color="primary" size="lg">
            プロジェクトを見る
            <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 ml-1" />
          </UButton>
          <UButton to="/about" color="neutral" variant="outline" size="lg">
            プロフィール
          </UButton>
        </div>
      </div>
    </section>

    <!-- Featured Projects Section -->
    <section class="mb-16">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-2xl font-bold text-default">注目のプロジェクト</h2>
        <NuxtLink
          to="/projects"
          class="text-primary-500 hover:text-primary-600 font-medium text-sm flex items-center gap-1 transition-colors"
        >
          すべて見る
          <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
        </NuxtLink>
      </div>

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <UCard
          v-for="project in featuredProjects"
          :key="project.title"
          class="group hover:ring-primary-500/50 transition-all duration-300"
        >
          <h3
            class="text-lg font-semibold text-default mb-2 group-hover:text-primary-500 transition-colors"
          >
            {{ project.title }}
          </h3>
          <p class="text-muted text-sm mb-4 line-clamp-2">
            {{ project.description }}
          </p>

          <!-- Tags -->
          <div class="flex flex-wrap gap-1.5 mb-4">
            <UBadge
              v-for="tag in project.tags"
              :key="tag"
              color="neutral"
              variant="subtle"
              size="sm"
              class="text-xs"
            >
              {{ tag }}
            </UBadge>
          </div>

          <!-- Link -->
          <a
            :href="project.url"
            class="text-primary-500 hover:text-primary-600 text-sm font-medium flex items-center gap-1 transition-colors"
          >
            詳細を見る
            <UIcon
              name="i-heroicons-arrow-top-right-on-square"
              class="w-4 h-4"
            />
          </a>
        </UCard>
      </div>
    </section>

    <!-- Skills Overview -->
    <section class="mb-16">
      <h2 class="text-2xl font-bold text-default mb-8">概要</h2>
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div class="p-6 rounded-xl bg-elevated/50 border border-default">
          <div
            class="w-12 h-12 rounded-lg bg-primary-500/10 flex items-center justify-center mb-4"
          >
            <UIcon
              name="i-heroicons-rocket-launch"
              class="w-6 h-6 text-primary-500"
            />
          </div>
          <h3 class="text-lg font-semibold text-default mb-2">
            スタートアップ経営
          </h3>
          <p class="text-muted text-sm">
            JianyueLab
            Ltd.の創業者兼CEOとして、事業戦略、チームビルディング、プロダクト開発を推進。
          </p>
        </div>

        <div class="p-6 rounded-xl bg-elevated/50 border border-default">
          <div
            class="w-12 h-12 rounded-lg bg-primary-500/10 flex items-center justify-center mb-4"
          >
            <UIcon
              name="i-heroicons-code-bracket"
              class="w-6 h-6 text-primary-500"
            />
          </div>
          <h3 class="text-lg font-semibold text-default mb-2">Web開発</h3>
          <p class="text-muted text-sm">
            TypeScriptを中心に、モダンなWebアプリケーションの設計・開発を担当。
          </p>
        </div>

        <div class="p-6 rounded-xl bg-elevated/50 border border-default">
          <div
            class="w-12 h-12 rounded-lg bg-primary-500/10 flex items-center justify-center mb-4"
          >
            <UIcon name="i-heroicons-server" class="w-6 h-6 text-primary-500" />
          </div>
          <h3 class="text-lg font-semibold text-default mb-2">インフラ管理</h3>
          <p class="text-muted text-sm">
            仮想サーバー、ドメイン管理、クラウドインフラの構築・運用経験。
          </p>
        </div>
      </div>
    </section>

    <!-- Contact CTA -->
    <section
      class="text-center py-12 px-6 rounded-2xl bg-elevated/50 border border-default"
    >
      <h2 class="text-2xl font-bold text-default mb-4">お問い合わせ</h2>
      <p class="text-muted mb-6 max-w-md mx-auto">
        新しいプロジェクトや協業のご相談をお待ちしています。
      </p>
      <UButton href="mailto:contact@jianyuehugo.com" color="primary" size="lg">
        <UIcon name="i-heroicons-envelope" class="w-5 h-5 mr-2" />
        メールを送る
      </UButton>
    </section>
  </main>
</template>
