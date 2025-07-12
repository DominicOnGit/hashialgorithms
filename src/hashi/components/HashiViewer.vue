<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { HashiCanvasService } from '@/hashi/services/HashiCanvasService';
import { useHashiStore } from '@/hashi/stores/hashi';
import { HashiUtil } from '@/hashi/services/HashiUtil';
import { useCustomPropertyStore } from '@/stores/CustomPropertyDef';
import { assertNotNull } from '@/services/misc';

const hashiStore = useHashiStore();
const customPropertiesStore = useCustomPropertyStore();

const vueCanvas = ref<CanvasRenderingContext2D>();

onMounted(() => {
  console.debug('mounted');
  const c = document.getElementById('canvas') as HTMLCanvasElement;

  const ctx = c.getContext('2d');
  if (ctx == null) throw new Error();
  vueCanvas.value = ctx;

  draw();
});

watch(hashiStore, () => {
  console.debug('changed');
  draw();
});

function draw() {
  console.debug('draw');
  assertNotNull(vueCanvas.value, 'vueCanvas is null');
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
