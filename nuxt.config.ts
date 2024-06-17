// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/supabase", "@pinia/nuxt", "@primevue/nuxt-module"],
  primevue: {
    importTheme: { from: "@/themes/mytheme.js" },
  }
});