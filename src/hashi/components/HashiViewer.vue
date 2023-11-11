<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { HashiCanvasService } from '@/hashi/services/HashiCanvasService';
import { useHashiStore } from '@/hashi/stores/hashi';
import { HashiUtil } from '@/hashi/services/HashiUtil';
import { useCustomPropertyStore } from '@/stores/CustomPropertyDef';

const hashiStore = useHashiStore();
const customPropertiesStore = useCustomPropertyStore();

const vueCanvas = ref<CanvasRenderingContext2D>();

onMounted(() => {
  console.log('mounted');
  const c = document.getElementById('canvas') as HTMLCanvasElement;

  const ctx = c.getContext('2d');
  if (ctx == null) throw new Error();
  vueCanvas.value = ctx;

  draw();
});

watch(hashiStore, () => {
  console.log('changed');
  draw();
});

function draw() {
  console.log('draw');

  if (vueCanvas.value == null) {
    throw new Error();
  }
  new HashiCanvasService(
    vueCanvas.value,
    new HashiUtil(hashiStore),
    customPropertiesStore.defs
  ).draw();
}
</script>

<template>
  <canvas id="canvas" width="400" height="400"></canvas>
</template>

<style scoped>
#canvas {
  border: 1px solid gray;
}
</style>
