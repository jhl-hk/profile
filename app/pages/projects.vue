<script setup lang="ts">
// Define projects data
const projects = [
  {
    title: "JianyueLab Ltd.",
    description:
      "英国で設立したテクノロジー企業。Web開発、ドメイン管理、アプリケーション開発事業を展開。スタートアップとして、クライアントのデジタルトランスフォーメーションをサポート。",
    tags: ["起業", "Web開発", "TypeScript", "事業経営"],
    url: "https://jianyuelab.co",
    github: null,
    featured: true,
    period: "2025年12月 - 現在",
    location: "イギリス",
  },
  {
    title: "Postal Wiki",
    description:
      "郵便システム、ポストカード、切手等に特化したWikiプロジェクト。世界中の郵便文化をドキュメント化し、コミュニティで共有することを目指す。",
    tags: ["Wiki", "コミュニティ", "郵便文化", "オープンソース"],
    url: "https://postal.wiki",
    github: null,
    featured: true,
    period: "2023年9月 - 現在",
    location: "東京",
  },
  {
    title: "JianyueLab Org.",
    description:
      "JianyueLab Ltd.のオープンソース・コミュニティプロジェクト。開発者コミュニティへの貢献と知識共有を目指す。",
    tags: ["オープンソース", "コミュニティ", "Web開発"],
    url: "https://jianyuelab.org",
    github: null,
    featured: false,
    period: "2025年 - 現在",
    location: "オンライン",
  },
  {
    title: "JianyueLab（ホームラボ）",
    description:
      "個人のホームラボプロジェクト。仮想サーバーの構築・運用、ドメイン管理、各種アプリケーションのセルフホスティングを通じて、インフラ管理スキルを習得。",
    tags: ["ホームラボ", "サーバー管理", "Docker", "ネットワーク"],
    url: null,
    github: null,
    featured: false,
    period: "2022年12月 - 2025年12月",
    location: "千代田",
  },
];

const featuredProjects = projects.filter((p) => p.featured);
const otherProjects = projects.filter((p) => !p.featured);
</script>

<template>
  <main class="p-6 lg:p-8 lg:py-12">
    <!-- Page Header -->
    <section class="mb-12">
      <h1 class="text-3xl lg:text-4xl font-bold text-default mb-4">
        プロジェクト
      </h1>
      <p class="text-muted text-lg max-w-2xl">
        これまでに手がけたプロジェクトの一覧です。起業から個人開発まで、様々な経験を積んできました。
      </p>
    </section>

    <!-- Featured Projects -->
    <section class="mb-16">
      <h2
        class="text-xl font-semibold text-default mb-6 flex items-center gap-2"
      >
        <UIcon name="i-heroicons-star" class="w-5 h-5 text-primary-500" />
        メインプロジェクト
      </h2>

      <div class="grid gap-8">
        <UCard
          v-for="project in featuredProjects"
          :key="project.title"
          class="overflow-hidden"
        >
          <div class="flex flex-col">
            <div class="flex-1 flex flex-col">
              <div class="flex items-start justify-between gap-4 mb-3">
                <h3 class="text-xl font-semibold text-default">
                  {{ project.title }}
                </h3>
                <UBadge
                  color="primary"
                  variant="subtle"
                  size="sm"
                  class="text-xs whitespace-nowrap"
                >
                  {{ project.period }}
                </UBadge>
              </div>

              <p class="text-muted text-sm mb-2">
                <UIcon name="i-heroicons-map-pin" class="w-4 h-4 inline mr-1" />
                {{ project.location }}
              </p>

              <p class="text-muted mb-4 flex-1">
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

              <!-- Links -->
              <div class="flex gap-4">
                <a
                  v-if="project.url && project.url !== '#'"
                  :href="project.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium transition-colors"
                >
                  <UIcon
                    name="i-heroicons-arrow-top-right-on-square"
                    class="w-4 h-4"
                  />
                  サイトを見る
                </a>
                <a
                  v-if="project.github"
                  :href="project.github"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 text-muted hover:text-default font-medium transition-colors"
                >
                  <UIcon name="i-simple-icons-github" class="w-4 h-4" />
                  ソースコード
                </a>
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </section>

    <!-- Other Projects -->
    <section>
      <h2
        class="text-xl font-semibold text-default mb-6 flex items-center gap-2"
      >
        <UIcon name="i-heroicons-folder" class="w-5 h-5 text-muted" />
        その他のプロジェクト
      </h2>

      <div class="grid gap-6 md:grid-cols-2">
        <UCard
          v-for="project in otherProjects"
          :key="project.title"
          class="group hover:ring-primary-500/50 transition-all duration-300"
        >
          <div class="flex items-start justify-between mb-3">
            <div
              class="w-10 h-10 rounded-lg bg-elevated flex items-center justify-center"
            >
              <UIcon
                name="i-heroicons-folder"
                class="w-5 h-5 text-primary-500"
              />
            </div>
            <UBadge
              color="neutral"
              variant="subtle"
              size="sm"
              class="text-xs whitespace-nowrap"
            >
              {{ project.period }}
            </UBadge>
          </div>

          <h3
            class="text-lg font-semibold text-default mb-2 group-hover:text-primary-500 transition-colors"
          >
            {{ project.title }}
          </h3>

          <p class="text-muted text-xs mb-2">
            <UIcon name="i-heroicons-map-pin" class="w-3 h-3 inline mr-1" />
            {{ project.location }}
          </p>

          <p class="text-muted text-sm mb-4 line-clamp-3">
            {{ project.description }}
          </p>

          <!-- Tags -->
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in project.tags"
              :key="tag"
              class="text-xs text-muted"
            >
              {{ tag
              }}<span
                v-if="project.tags.indexOf(tag) < project.tags.length - 1"
                class="ml-2"
                >·</span
              >
            </span>
          </div>
        </UCard>
      </div>
    </section>
  </main>
</template>
