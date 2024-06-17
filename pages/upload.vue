<template>
  <Toast />
  <Tabs value="0">
    <TabList>
      <h2 style="padding: 10px">Режим</h2>
      <Tab value="0">Создать категорию</Tab>
      <Tab value="1">Добавить подкаст</Tab>
    </TabList>
    <TabPanels>
      <TabPanel value="0">
        <div class="info_row">
          <p>Название</p>
          <input v-model="titleCategory" type="text" />
        </div>
        <div class="info_row1">
          <p>Обложка категории:</p>
          <p>{{ selectImageNameCategory }}</p>
        </div>
        <div class="group_btns">
          <button class="upload_cover" @click="uploadImage">
            Загрузить обложку
          </button>
          <button class="save_group" @click="createCategory">
            Создать категорию 
          </button>
        </div>
      </TabPanel>
      <TabPanel value="1">
        <div class="group_info">
          <div class="info_row">
            <p>Название</p>
            <input v-model="selectTitlePodcast" type="text" />
          </div>
          <div class="info_row">
            <p>Автор</p>
            <input v-model="selectAuthorPodcast" type="text" />
          </div>
          <div class="info_row">
            <p>Категория</p>
            <Dropdown
              id="dropdown"
              v-model="selectedCategoryPodcast"
              :options="category_list"
              optionLabel="title"
              optionValue="id"
              placeholder="Выберите категорию"
              class="p-d-block"
            />
          </div>

          <div class="info_row1">
            <p>Аудиофайл:</p>
            <p>{{ selectAudioNamePodcast }}</p>
          </div>

          <div class="info_row1">
            <p>Обложка:</p>
            <p>{{ selectImageNameCategory }}</p>
          </div>
        </div>

        <div class="group_btns">
          <button class="upload_cover" @click="uploadImage">
            Загрузить обложку
          </button>
          <button class="upload_cover" @click="uploadAudio">
            Загрузить аудиофайл
          </button>
          <button class="save_group" @click="createPodcast" :disabled="load">{{ load ? 'Загрузка...' : 'Сохранить подкаст' }} </button>
        </div>
      </TabPanel>
    </TabPanels>
  </Tabs>
</template>

<script lang="ts" setup>

const load = ref(false)

const toast = useToast();

const supabase = useSupabaseClient();

const selectImageNameCategory = ref("");

const selectAudioNamePodcast = ref("");
const titleCategory = ref("");
const category_list = ref([]);

const selectTitlePodcast = ref("")
const selectAuthorPodcast = ref("")
const selectImageCategory = ref("");
const selectAudioPodcast = ref("");
const selectedCategoryPodcast = ref(null);

onMounted(async () => {
  let { data: category, error } = await supabase.from("category").select("*");
  if (category) category_list.value = category;
});

supabase
  .channel("custom-all-channel")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "category" },
    async () => {
      let { data: category, error } = await supabase
        .from("category")
        .select("*");
      if (category) category_list.value = category;
    }
  )
  .subscribe();

async function uploadImage() {
  // Open file picker
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/png";
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Generate a unique file name
      const fileName = `${Date.now()}.png`;

      // Upload file to the bucket
      const { data, error } = await supabase.storage
        .from("images")
        .upload(fileName, file);

      if (error) {
        console.error("Error uploading file:", error.message);
        return;
      }

      // Get the URL of the uploaded file
      const {
        data: { publicUrl },
      } = supabase.storage.from("images").getPublicUrl(data.path);
      selectImageCategory.value = publicUrl;
      if (selectImageCategory.value) {
        selectImageNameCategory.value = file.name;
      }
    }
  };
  input.click();
}
async function uploadAudio() {
  // Open file picker
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".mp3";
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Generate a unique file name
      const fileName = `${Date.now()}.mp3`;

      // Upload file to the bucket
      const { data, error } = await supabase.storage
        .from("images")
        .upload(fileName, file);

      if (error) {
        console.error("Error uploading file:", error.message);
        return;
      }

      // Get the URL of the uploaded file
      const {
        data: { publicUrl },
      } = supabase.storage.from("images").getPublicUrl(data.path);
      selectAudioPodcast.value = publicUrl;
      if (selectAudioPodcast.value) {
        selectAudioNamePodcast.value = file.name;
      }
    }
  };
  input.click();
}
const createCategory = async () => {
  // Check if image is selected
  if (!selectImageCategory.value) {
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: "Пожалуйста, загрузите обложку категории.",
      life: 3000,
    });
    return;
  }

  // Check if title is provided
  if (!titleCategory.value.trim()) {
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: "Пожалуйста, введите название категории.",
      life: 3000,
    });
    return;
  }

  // Create category record in the database
  const { data, error } = await supabase.from("category").insert({
    title: titleCategory.value,
    image: selectImageCategory.value,
  });

  if (error) {
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: `Ошибка при создании категории: ${error.message}`,
      life: 3000,
    });
  } else {
    toast.add({
      severity: "success",
      summary: "Успех",
      detail: "Категория успешно создана!",
      life: 3000,
    });
    // Clear the input fields
    titleCategory.value = "";
    selectImageCategory.value = "";
    selectImageNameCategory.value = "";
  }
};


const createPodcast = async () => {
    load.value = true
  // Check if image is selected
  if (!selectImageCategory.value) {
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: "Пожалуйста, загрузите обложку.",
      life: 3000,
    });
    load.value = false

    return;
  }

  // Check if audio file is selected
  if (!selectAudioPodcast.value) {
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: "Пожалуйста, загрузите аудиофайл.",
      life: 3000,
    });
    load.value = false

    return;
  }

  // Check if title is provided
  if (!selectTitlePodcast.value.trim()) {
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: "Пожалуйста, введите название подкаста.",
      life: 3000,
    });
    load.value = false

    return;
  }

  // Check if author is provided
  if (!selectAuthorPodcast.value.trim()) {
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: "Пожалуйста, введите автора подкаста.",
      life: 3000,
    });
    load.value = false
    
    return;
  }

  // Check if category is selected
  if (!selectedCategoryPodcast.value) {
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: "Пожалуйста, выберите категорию.",
      life: 3000,
    });
    load.value = false

    return;
  }

  // Create podcast record in the database
  const { data, error } = await supabase.from("podcast").insert({
    title: selectTitlePodcast.value,
    author: selectAuthorPodcast.value,
    image: selectImageCategory.value,
    audio: selectAudioPodcast.value,
    category: selectedCategoryPodcast.value,
  });

  if (error) {
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: `Ошибка при создании подкаста: ${error.message}`,
      life: 3000,
    });
    load.value = false

  } else {
    toast.add({
      severity: "success",
      summary: "Успех",
      detail: "Подкаст успешно создан!",
      life: 3000,
    });
    // Clear the input fields
    selectTitlePodcast.value = "";
    selectAuthorPodcast.value = "";
    selectImageCategory.value = "";
    selectAudioPodcast.value = "";
    selectedCategoryPodcast.value = null;
    selectImageNameCategory.value = "";
    selectAudioNamePodcast.value = "";
    load.value = false
  }
};

</script>

<style></style>
