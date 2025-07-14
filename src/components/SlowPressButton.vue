<script setup lang="ts">
import { computed, ref } from 'vue';

const TOTAL_TIME = 500;
const STEPS = 20;

const emit = defineEmits<{
  activated: [];
}>();

const isRunning = ref(false);
const counter = ref(0);
let isArmed = false;

const progressWidth = computed(() => {
  const rel = (100 * counter.value) / STEPS;
  const bounded = Math.min(rel, 100);
  return bounded + '%';
});

function run(): void {
  if (!isRunning.value) return;

  counter.value = counter.value + 1;
  if (counter.value > STEPS) {
    isRunning.value = false;
    isArmed = true;
  }
  setTimeout(() => {
    run();
  }, TOTAL_TIME / STEPS);
}

function startRunning(): void {
  isRunning.value = true;
  run();
}

function clickStopped(allowEmit: boolean): void {
  isRunning.value = false;
  counter.value = 0;
  if (isArmed && allowEmit) {
    emit('activated');
  }
}
</script>

<template>
  <button
    class="outer"
    @mousedown="startRunning"
    @mouseup="() => clickStopped(true)"
    @mouseleave="() => clickStopped(false)"
  >
    <span class="slot"><slot></slot></span>

    <span class="level" :style="{ width: progressWidth }"></span>
  </button>
</template>

<style>
.outer {
  position: relative;
}
.slot {
  position: relative;
  left: 0px;
  top: 0px;
  height: 100%;
  width: 100%;
  z-index: 2;
}
.level {
  position: absolute;
  left: 0px;
  top: 0px;
  height: 100%;
  width: 50%;
  background-color: lightblue;
  z-index: 1;
}
</style>
