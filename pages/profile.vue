<template>
  <div class="main_h1">
    <p>Профиль</p>
  </div>

  <div class="profile">
    <div class="profile_block">
      <div v-html="profile_image" class="profile_img"></div>
      <div class="user_info">
        <h2>{{ profiles }}</h2>
      </div>
    </div>

   
  </div>
</template>

<script lang="ts" setup>
import { toSvg } from "jdenticon/standalone";
const profile_image = ref("");
const supabase = useSupabaseClient();
const profiles = ref("");
nextTick(async () => {
  const user = await supabase.auth.getUser();
  if (user.data.user) {
    const svg = toSvg(user.data.user?.id, 200);
    profile_image.value = svg;
    let { data: profile, error } = await supabase
      .from("profile")
      .select("*")
      .eq("user_id", user.data.user.id.toString());
    if (profile?.length !== 0) {
      profiles.value = profile[0].username;
    } else {
      navigateTo("/login");
    }
  } else {
    navigateTo("/login");
  }
});
</script>
