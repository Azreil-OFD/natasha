<template>
  <div class="body">
    <div class="common_block">
      <div class="left_menu">
        <div class="header_logos">
          <img src="/img/music-solid.svg" alt="" class="header_logo" />
          <p class="header_txt_logo">Подкасты!</p>
        </div>
        <div class="header_menu">
          <ul>
            <li class="header_menu_li" @click="navigateTo('/')">Главная</li>
            <li class="header_menu_li" @click="navigateTo('/category')">
              Категории
            </li>
            <li class="header_menu_li" @click="navigateTo('/search')">Поиск</li>
            <li class="header_menu_li" @click="navigateTo('/profile')">
              Профиль
            </li>
            <li class="header_menu_li" @click="navigateTo('/upload')">
              Загрузить контент
            </li>
          </ul>
          <div class="bottom_btn" v-if="route.name !== 'login'" @click="supabase.auth.signOut(); navigateTo('/login')">Выход</div>
        </div>
      </div>

      <div class="main_block">
        <NuxtPage />
        <div
          class="main_bottom"
          v-if="route.name !== 'login' && audio.length !== 0"
        >
          <img
            :src="play ? '/img/pause-solid.svg' : '/img/play-solid.svg'"
            alt=""
            class="play"
            @click="togglePlay"
          />
          <h2 class="podcast_info">{{ author }} - {{ title }}</h2>
        </div>
      </div>
    </div>
  </div>
 <audio ref="audioElement"></audio>
</template>

<script setup>
import "@/assets/styles.css";
const route = useRoute();
const audioStore = useAudioStore();
const { audio, title, author, play } = storeToRefs(audioStore);
const audioElement = ref(null);
const supabase = useSupabaseClient()
// Function to load and play the audio
const loadAndPlayAudio = () => {
  if (audio.value && audioElement.value) {
    audioElement.value.src = audio.value;
    audioElement.value.load();
    if (play.value) {
      audioElement.value.play();
    }
  }
};

// Function to toggle play/pause
const togglePlay = () => {
  if (play.value) {
    audioElement.value?.pause();
    play.value = false;
  } else {
    audioElement.value?.play();
    play.value = true;
  }
};

// Watch for changes in the audio URL and play state
watch([audio, play], () => {
  loadAndPlayAudio();
});

// Ensure the audio element is controlled when component mounts and unmounts
onMounted(() => {
  if (audioElement.value) {
    audioElement.value.addEventListener('play', () => {
      play.value = true;
    });
    audioElement.value.addEventListener('pause', () => {
      play.value = false;
    });
    loadAndPlayAudio();
  }
});

onBeforeUnmount(() => {
  if (audioElement.value) {
    audioElement.value.removeEventListener('play', () => {
      play.value = true;
    });
    audioElement.value.removeEventListener('pause', () => {
      play.value = false;
    });
  }
});
</script>
