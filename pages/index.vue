<template>
  <div class="main_h1">
    <p style="padding: 20px 0">Главная</p>
  </div>

  <div class="main_top" v-if="podcasts">
    <div class="main_top_news">
      <div class="h2_top_news">
        <h2 class="top_news_h2">Топ новинок</h2>
      </div>
      <div class="podcast-grid">
        <div
          class="podcast-card"
          v-for="podcast in podcasts.sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )"
          @click="() => {
            audio = podcast.audio
            title = podcast.title
            author = podcast.author
            image = podcast.image
          }"
          :key="podcast.id"
        >
          <img :src="podcast.image" alt="Podcast 1" />
          <h3>{{ podcast.title }} -</h3>
          <p>{{ podcast.author }}</p>
          <div class="podcast_bottom">
            <img src="/img/bookmark-regular.svg" alt="" class="favorites" />
            <img src="/img/heart-regular.svg" alt="" class="like" />
          </div>
        </div>
      </div>
    </div>

    <div class="main_top10">
      <div class="top_10_h2">
        <h2 class="top10">Топ 10</h2>
      </div>
      <div class="podcast-grid2">
         <div
          class="podcast-card"
          v-for="podcast in podcasts"
          @click="() => {
            audio = podcast.audio
            title = podcast.title
            author = podcast.author
            image = podcast.image
          }"
          :key="podcast.id"
        >
          <img :src="podcast.image" alt="Podcast 1" />
          <h3>{{ podcast.title }} -</h3>
          <p>{{ podcast.author }}</p>
          <div class="podcast_bottom">
            <img src="/img/bookmark-regular.svg" alt="" class="favorites" />
            <img src="/img/heart-regular.svg" alt="" class="like" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const supabase = useSupabaseClient();

const podcasts = ref([]);
const audioStore = useAudioStore();
const { audio, title, author, image, play } = storeToRefs(audioStore);
onMounted(async () => {
  const { data: podcast } = await supabase.from("podcast").select();
  if (podcast) podcasts.value = podcast;
});
</script>

<style></style>
