<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getNext, getUrl, Stories } from '../service/stories';
import { assertNotNull } from '@/services/misc';
import { type Story } from '../story';
import { UiActionLogger } from '@/services/logging';

const story = ref<Story>({} as Story);

const route = useRoute();
watch(() => route.params.id, loadStory, { immediate: true });

async function loadStory(storyStr: string | string[]) {
  UiActionLogger.info('loadStory', storyStr);
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
  <div class="card spaced">
    <div class="card-body">
      <h1 class="card-title">{{ story.title }}</h1>
      <div v-html="story.text" />

      <div>
        <img v-if="story.pic != null" :src="story.pic" alt="..." class="center" />
      </div>
      <RouterLink class="btn btn-light mt-4" :to="nextPath()">Ok</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.spaced {
  margin: 2%;
}
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}
</style>
