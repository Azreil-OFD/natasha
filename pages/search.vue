<template>
  <div class="main_block">
    <div class="main_h1">
      <p style="padding: 15px 0">Поиск</p>
    </div>

    <div class="search">
      <div class="info_row">
        <input v-model="searchText" type="text" />
      </div>

      <div class="search-grid">
<div
          class="podcast-card"
          v-for="podcast in podcasts.filter(podcast => podcast.title.toLowerCase().includes(searchText.toLowerCase()))"
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

const searchText = ref('')
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
