import { defineStore } from 'pinia'

export const useAudioStore = defineStore("muAudioStore", () => {
  const audio = ref("");
  const title = ref("");
  const author = ref("");
  const image = ref("");
const play = ref(false);
  return { audio, title, author, image, play };
});