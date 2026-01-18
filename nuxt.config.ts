// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["./app/assets/global.css"],
  modules: ["@nuxt/ui"],
  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    head: {
      title: "Jianyue Hugo Liang",
      meta: [
        {
          name: "description",
          content:
            "Founder & CEO @ JianyueLab Ltd. | IBDP Student @ NUCB International College",
        },
      ],
    },
  },
});
