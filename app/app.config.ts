export default defineAppConfig({
  profile: {
    name: "Janyue Aosugi, a.k.a. Jianyue Hugo Liang",
    title: "Founder & CEO @ JianyueLab Ltd.",
    bio: "IBDP Student @ NUCB International College | 起業家・Web開発者",
    location: "東京都千代田区",
    social: [
      {
        icon: "i-simple-icons-github",
        url: "https://github.com/jhl-hk",
        label: "GitHub",
      },
      {
        icon: "i-simple-icons-linkedin",
        url: "https://www.linkedin.com/in/jhl-hk/",
        label: "LinkedIn",
      },
      {
        icon: "i-heroicons-globe-alt",
        url: "https://jhl.idv.hk",
        label: "Portfolio",
      },
      {
        icon: "i-heroicons-envelope",
        url: "mailto:ja@jhl.hk",
        label: "メール",
      },
    ],
    nav: [
      { icon: "i-heroicons-home", to: "/", label: "ホーム" },
      { icon: "i-heroicons-folder", to: "/projects", label: "プロジェクト" },
      { icon: "i-heroicons-user", to: "/about", label: "プロフィール" },
    ],
  },
  ui: {
    colors: {
      primary: "amber",
      neutral: "neutral",
    },
    card: {
      variants: {
        variant: {
          "authn-card": {
            root: "bg-default md:shadow-lg",
          },
          "no-bg": {
            root: "ring ring-default",
          },
        },
      },
    },
    pageCard: {
      variants: {
        variant: {
          "no-bg": {
            root: "ring ring-default",
          },
        },
      },
    },
  },
});
