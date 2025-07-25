// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  modules: [
    "@pinia/nuxt",
    "@nuxt/eslint",
    "@nuxtjs/tailwindcss",
    "nuxt-headlessui",
    [
      "@vee-validate/nuxt",
      {
        // 啟用 auto imports
        autoImports: true,
        // 自訂 components 名稱
        componentNames: {
          Form: "VForm",
          Field: "VField",
        },
      },
    ],
  ],
  css: ["~/assets/css/tailwind.css"],
  runtimeConfig: {
    public: {
      apiUrl: "",
    },
  },
  app: {
    head: {
      title: "啾啾｜Chirp",
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      meta: [
        { "http-equiv": "X-UA-Compatible", content: "IE=edge" },
        { "http-equiv": "X-Content-Type-Options", content: "nosniff" },
        { name: "author", content: "啾啾開發小隊" },
        {
          name: "keywords",
          content: "啾啾,Chirp,社群網站,留言,按讚,追蹤,發文,社交平台",
        },
        {
          name: "description",
          content: "啾啾是一個輕量自由的社群平台，讓你用一則貼文啾出生活點滴。",
        },
        { property: "og:locale", content: "zh-TW" },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://chirp-app.example.com/" },
        {
          property: "og:title",
          content: "啾啾 | Chirp",
        },
        {
          property: "og:image",
          content: "https://chirp-app.example.com/og-image.png",
        },
        {
          property: "og:description",
          content: "在啾啾用你的聲音分享生活、連結好友，一起自由發聲。",
        },
        { property: "og:site_name", content: "啾啾" },
        { property: "og:updated_time", content: "2025-07-01T00:00:00Z" },
      ],
      link: [
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@100..900&display=swap",
        },
      ],
    },
  },
});
