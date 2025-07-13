<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getNext, getUrl, Stories } from '../service/stories';
import { assertNotNull } from '@/services/misc';
import { isStory, type Story } from '../story';

const story = ref<Story>({} as Story);

const route = useRoute();
watch(() => route.params.id, loadStory, { immediate: true });

async function loadStory(storyStr: string | string[]) {
  console.log('loadStory', storyStr);
  story.value = Stories[storyStr as string];
  assertNotNull(story.value, 'Story not found');
}

function nextPath(): string {
  const next = getNext(story.value);
  assertNotNull(next);
  return getUrl(next);
}
</script>

<template>
  <h1>{{ story.title }}</h1>
  <div v-html="story.text" />

  <button class="btn" @click="$router.push({ path: nextPath() })">Ok</button>
</template>

<style scoped></style>
