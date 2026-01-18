<script setup lang="ts">
const appConfig = useAppConfig();
const profile = appConfig.profile;

// Skills data
const skills = {
  business: [
    { name: "スタートアップ経営", level: 90 },
    { name: "事業開発", level: 85 },
    { name: "プロジェクト管理", level: 88 },
  ],
  technical: [
    { name: "TypeScript", level: 90 },
    { name: "Web開発", level: 88 },
    { name: "サーバー管理", level: 82 },
    { name: "ドメイン管理", level: 85 },
  ],
  languages: [
    { name: "中国語（ネイティブ）", level: 100 },
    { name: "英語（ビジネス）", level: 85 },
    { name: "日本語（日常会話）", level: 70 },
  ],
};

// Experience timeline
const experience = [
  {
    title: "Founder & CEO",
    company: "JianyueLab Ltd.",
    location: "イギリス",
    period: "2025年12月 - 現在",
    description:
      "テクノロジー企業を設立。Web開発、ドメイン管理、アプリケーション開発事業を展開。",
  },
  {
    title: "Web Developer",
    company: "BetaMajor",
    location: "バーミンガム",
    period: "2025年11月 - 2025年12月",
    description: "英国の中国人バスケットボール協会のWebサイト開発を担当。",
  },
  {
    title: "Founder",
    company: "Postal Wiki",
    location: "東京",
    period: "2023年9月 - 現在",
    description:
      "郵便システム、ポストカード等に特化したWikiプロジェクトを立ち上げ、運営中。",
  },
  {
    title: "Owner",
    company: "JianyueLab（個人プロジェクト）",
    location: "千代田",
    period: "2022年12月 - 2025年12月",
    description:
      "仮想サーバー、ドメイン管理、アプリケーション開発に焦点を当てた個人ホームラボプロジェクト。",
  },
];

// Education
const education = [
  {
    school: "NUCB International College",
    degree: "International Baccalaureate Diploma",
    period: "2024年4月 - 2027年6月（予定）",
    description: "IBDPプログラムで学習中。",
  },
  {
    school: "USC Marshall School of Business",
    degree: "Summer Program - Global Youth Leadership Program",
    period: "2024年8月",
    description: "グローバルリーダーシップについて学ぶサマープログラムに参加。",
  },
];

// Certifications
const certifications = [{ name: "Open Water Diver", issuer: "PADI" }];
</script>

<template>
  <main class="p-6 lg:p-8 lg:py-12">
    <!-- Page Header -->
    <section class="mb-12">
      <h1 class="text-3xl lg:text-4xl font-bold text-default mb-4">
        プロフィール
      </h1>
      <p class="text-muted text-lg max-w-2xl">
        私の経歴、スキル、そして目指すビジョンについてご紹介します。
      </p>
    </section>

    <!-- Bio Section -->
    <section class="mb-16">
      <div class="flex flex-col lg:flex-row gap-8 items-start">
        <!-- Profile Image -->
        <div class="w-full lg:w-1/3 flex-shrink-0">
          <img
            src="~/assets/image/portrait.jpg"
            alt="Jianyue Hugo Liang"
            class="w-full max-w-sm mx-auto lg:mx-0 rounded-2xl object-cover aspect-square ring-4 ring-primary-500/10"
          />
        </div>

        <!-- Bio Content -->
        <div class="flex-1">
          <h2 class="text-2xl font-bold text-default mb-2">
            {{ profile.name }}
          </h2>
          <p class="text-primary-500 font-medium mb-4">{{ profile.title }}</p>

          <div class="prose prose-neutral dark:prose-invert max-w-none">
            <p class="text-muted mb-4">
              東京・千代田区を拠点に活動する起業家兼Web開発者です。 NUCB
              International CollegeでIBDPプログラムを学びながら、 JianyueLab
              Ltd.のFounder & CEOとしてテクノロジー事業を展開しています。
            </p>
            <p class="text-muted mb-4">
              2022年から個人プロジェクトとしてJianyueLab（ホームラボ）を運営し、
              仮想サーバーやドメイン管理の経験を積んできました。
              2025年には英国でJianyueLab
              Ltd.を法人化し、Web開発・アプリケーション開発事業を本格始動しました。
            </p>
            <p class="text-muted mb-4">
              TypeScriptを中心としたモダンなWeb技術に精通し、
              スタートアップ経営と技術の両面からプロジェクトを推進しています。
            </p>
          </div>

          <!-- Quick Facts -->
          <div class="grid grid-cols-2 gap-4 mt-6">
            <div class="p-4 rounded-xl bg-elevated/50 border border-default">
              <div class="text-2xl font-bold text-primary-500">3+</div>
              <div class="text-sm text-muted">年の開発経験</div>
            </div>
            <div class="p-4 rounded-xl bg-elevated/50 border border-default">
              <div class="text-2xl font-bold text-primary-500">1</div>
              <div class="text-sm text-muted">設立企業</div>
            </div>
            <div class="p-4 rounded-xl bg-elevated/50 border border-default">
              <div class="text-2xl font-bold text-primary-500">3</div>
              <div class="text-sm text-muted">言語</div>
            </div>
            <div class="p-4 rounded-xl bg-elevated/50 border border-default">
              <div class="text-2xl font-bold text-primary-500">IBDP</div>
              <div class="text-sm text-muted">在学中</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Skills Section -->
    <section class="mb-16">
      <h2 class="text-2xl font-bold text-default mb-8">スキル</h2>

      <div class="grid gap-8 lg:grid-cols-3">
        <!-- Business Skills -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center"
              >
                <UIcon
                  name="i-heroicons-briefcase"
                  class="w-5 h-5 text-primary-500"
                />
              </div>
              <h3 class="text-lg font-semibold text-default">ビジネス</h3>
            </div>
          </template>

          <div class="space-y-4">
            <div v-for="skill in skills.business" :key="skill.name">
              <div class="flex justify-between mb-1">
                <span class="text-sm text-default">{{ skill.name }}</span>
                <span class="text-sm text-muted">{{ skill.level }}%</span>
              </div>
              <div class="h-2 bg-elevated rounded-full overflow-hidden">
                <div
                  class="h-full bg-primary-500 rounded-full transition-all duration-500"
                  :style="{ width: `${skill.level}%` }"
                ></div>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Technical Skills -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center"
              >
                <UIcon
                  name="i-heroicons-code-bracket"
                  class="w-5 h-5 text-primary-500"
                />
              </div>
              <h3 class="text-lg font-semibold text-default">技術</h3>
            </div>
          </template>

          <div class="space-y-4">
            <div v-for="skill in skills.technical" :key="skill.name">
              <div class="flex justify-between mb-1">
                <span class="text-sm text-default">{{ skill.name }}</span>
                <span class="text-sm text-muted">{{ skill.level }}%</span>
              </div>
              <div class="h-2 bg-elevated rounded-full overflow-hidden">
                <div
                  class="h-full bg-primary-500 rounded-full transition-all duration-500"
                  :style="{ width: `${skill.level}%` }"
                ></div>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Languages -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center"
              >
                <UIcon
                  name="i-heroicons-language"
                  class="w-5 h-5 text-primary-500"
                />
              </div>
              <h3 class="text-lg font-semibold text-default">言語</h3>
            </div>
          </template>

          <div class="space-y-4">
            <div v-for="skill in skills.languages" :key="skill.name">
              <div class="flex justify-between mb-1">
                <span class="text-sm text-default">{{ skill.name }}</span>
                <span class="text-sm text-muted">{{ skill.level }}%</span>
              </div>
              <div class="h-2 bg-elevated rounded-full overflow-hidden">
                <div
                  class="h-full bg-primary-500 rounded-full transition-all duration-500"
                  :style="{ width: `${skill.level}%` }"
                ></div>
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </section>

    <!-- Experience Section -->
    <section class="mb-16">
      <h2 class="text-2xl font-bold text-default mb-8">経歴</h2>

      <div class="relative">
        <!-- Timeline line -->
        <div
          class="absolute left-4 top-0 bottom-0 w-px bg-default hidden lg:block"
        ></div>

        <div class="space-y-8">
          <div
            v-for="(exp, index) in experience"
            :key="index"
            class="relative lg:pl-12"
          >
            <!-- Timeline dot -->
            <div
              class="absolute left-0 top-1.5 w-8 h-8 rounded-full bg-primary-500/10 border-2 border-primary-500 hidden lg:flex items-center justify-center"
            >
              <div class="w-2 h-2 rounded-full bg-primary-500"></div>
            </div>

            <UCard>
              <div
                class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3"
              >
                <div>
                  <h3 class="text-lg font-semibold text-default">
                    {{ exp.title }}
                  </h3>
                  <p class="text-primary-500 font-medium">{{ exp.company }}</p>
                  <p class="text-muted text-sm">{{ exp.location }}</p>
                </div>
                <UBadge
                  color="neutral"
                  variant="subtle"
                  size="sm"
                  class="text-xs whitespace-nowrap"
                >
                  {{ exp.period }}
                </UBadge>
              </div>
              <p class="text-muted">{{ exp.description }}</p>
            </UCard>
          </div>
        </div>
      </div>
    </section>

    <!-- Education Section -->
    <section class="mb-16">
      <h2 class="text-2xl font-bold text-default mb-8">学歴</h2>

      <div class="grid gap-6 md:grid-cols-2">
        <UCard v-for="(edu, index) in education" :key="index">
          <div class="flex items-start gap-4">
            <div
              class="w-12 h-12 rounded-lg bg-primary-500/10 flex items-center justify-center flex-shrink-0"
            >
              <UIcon
                name="i-heroicons-academic-cap"
                class="w-6 h-6 text-primary-500"
              />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-default">
                {{ edu.school }}
              </h3>
              <p class="text-primary-500 font-medium text-sm">
                {{ edu.degree }}
              </p>
              <p class="text-muted text-sm mt-1">{{ edu.period }}</p>
              <p class="text-muted text-sm mt-2">{{ edu.description }}</p>
            </div>
          </div>
        </UCard>
      </div>
    </section>

    <!-- Certifications Section -->
    <section class="mb-16">
      <h2 class="text-2xl font-bold text-default mb-8">資格</h2>

      <div class="flex flex-wrap gap-4">
        <UCard v-for="cert in certifications" :key="cert.name" class="w-fit">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center"
            >
              <UIcon
                name="i-heroicons-trophy"
                class="w-5 h-5 text-primary-500"
              />
            </div>
            <div>
              <p class="font-semibold text-default">{{ cert.name }}</p>
              <p class="text-muted text-sm">{{ cert.issuer }}</p>
            </div>
          </div>
        </UCard>
      </div>
    </section>

    <!-- Contact CTA -->
    <section
      class="text-center py-12 px-6 rounded-2xl bg-elevated/50 border border-default"
    >
      <h2 class="text-2xl font-bold text-default mb-4">お問い合わせ</h2>
      <p class="text-muted mb-6 max-w-md mx-auto">
        新しい機会やプロジェクトについてのご相談をお待ちしています。
      </p>
      <div class="flex flex-wrap justify-center gap-4">
        <UButton
          href="mailto:contact@jianyuehugo.com"
          color="primary"
          size="lg"
        >
          <UIcon name="i-heroicons-envelope" class="w-5 h-5 mr-2" />
          メールを送る
        </UButton>
        <UButton
          href="https://www.linkedin.com/in/jhl-hk/"
          target="_blank"
          color="neutral"
          variant="outline"
          size="lg"
        >
          <UIcon name="i-simple-icons-linkedin" class="w-5 h-5 mr-2" />
          LinkedIn
        </UButton>
      </div>
    </section>
  </main>
</template>
