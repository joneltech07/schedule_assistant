// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss"],
  // css: ["@/assets/css/tailwind.css"],
  app: {
    head: {
      title: "Schedule Assistant - AI-Powered Scheduling",
      link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
      meta: [
        {
          name: "description",
          content:
            "Automate your scheduling with AI. Convert text and images into calendar events instantly.",
        },
      ],
    },
  },
});
