<script setup lang="ts">
import HashiViewer from '../hashi/components/HashiViewer.vue';
import AlgorithmBuilder from '../algorithm/components/AlgorithmBuilder.vue';

import { useRoute } from 'vue-router';
import { getLevel, getNextLevel } from '@/Title-Screen/services/levels';
import { watch } from 'vue';
import { useHashiStore } from '@/hashi/stores/hashi';
import { useAlgorithmRunnerStore } from '@/algorithm/stores/AlgorithmRunnerStore';
import { HashiUtil } from '@/hashi/services/HashiUtil';
import { Modal } from 'bootstrap';
import type { Level } from '@/Title-Screen/stores/level';
import { getStartForLevel, getUrl } from '@/Story/service/stories';
import { assertNotNull } from '@/services/misc';
import { UiActionLogger } from '@/services/logging';
import { useProgressStore } from '@/stores/ProgressStore';
import { SaveProgress } from '@/services/storageService';

let level: Level;
let nextLevel: Level | null;
let successShown = false;

const hashiStore = useHashiStore();
const route = useRoute();
const progress = useProgressStore();
watch(() => route.params.level, loadLevelAndSet, { immediate: true });

progress.$subscribe((mutation, prog) => {
  SaveProgress(prog);
});

function loadLevelAndSet(levelStr: string | string[]) {
  successShown = false;
  level = getLevel(levelStr as string);
  nextLevel = getNextLevel(level);
  const hashi = level.load();
  hashiStore.setHashi(hashi.wrappedItem);
}

function nextLevelPath(): string {
  assertNotNull(nextLevel);
  const nextStart = getStartForLevel(nextLevel);
  return getUrl(nextStart);
}

const hashiRunnerStore = useAlgorithmRunnerStore();

hashiStore.$subscribe(() => {
  checkLevelComplete();
});
hashiRunnerStore.$subscribe(() => {
  checkLevelComplete();
});

function checkLevelComplete(): void {
  UiActionLogger.debug(`checkLevelComplete, successShown=${successShown}`);
  if (successShown) {
    return;
  }
  const algorithmStopped = hashiRunnerStore.ruleStates.every((state) => state === 'noMatch');
  const hashiSolved = new HashiUtil(hashiStore).IsSolved();

  if (algorithmStopped && hashiSolved) {
    progress.solved(level.number);
    successShown = true;
    const successModal = new Modal('#successModal');
    successModal.show();
  }
}
</script>

<template>
  <div class="row row-cols-1 g-4">
    <div class="col">
      <div class="card">
        <div class="card-body">
          <HashiViewer />
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card">
        <div class="card-body">
          <AlgorithmBuilder />
        </div>
      </div>
    </div>
  </div>

  <div
    class="modal fade"
    id="successModal"
    data-bs-backdrop="static"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title">Congratulations!</h1>
        </div>
        <div class="modal-body">
          <p>Your algorithm successfully solved the Hashy.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Stay Here</button>
          <button
            v-if="nextLevel != null"
            type="button"
            class="btn btn-primary"
            data-bs-dismiss="modal"
            @click="$router.push({ path: nextLevelPath() })"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
