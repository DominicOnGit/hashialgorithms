<script setup lang="ts">
import { onBeforeMount, onMounted, onUpdated, ref, watch } from 'vue';
import { desiredSize, HashiCanvasService, Rescale } from '@/hashi/services/HashiCanvasService';
import { useHashiStore } from '@/hashi/stores/hashi';
import { HashiUtil } from '@/hashi/services/HashiUtil';
import { useCustomPropertyStore } from '@/stores/CustomPropertyDef';
import { assertNotNull } from '@/services/misc';

if (import.meta.hot) {
  import.meta.hot.on('vite:afterUpdate', () => {
    console.log('HOT');
    draw();
  });
}

const hashiStore = useHashiStore();
const customPropertiesStore = useCustomPropertyStore();

const vueCanvas = ref<CanvasRenderingContext2D>();

onBeforeMount(() => {
  calculateDesiredSize();
});

onMounted(() => {
  console.debug('mounted');
  const c = document.getElementById('canvas') as HTMLCanvasElement;

  const ctx = c.getContext('2d');
  if (ctx == null) throw new Error();
  vueCanvas.value = ctx;

  draw();
});

onUpdated(() => {
  console.log('updated');
});

watch(hashiStore, () => {
  draw();
});

const desiredCanvasSize = ref({ width: 300, height: 300 });

watch(
  () => hashiStore.vertices,
  () => {
    calculateDesiredSize();
  }
);

function calculateDesiredSize(): void {
  const hashiSize = new HashiUtil(hashiStore).getSize();
  desiredCanvasSize.value = desiredSize(hashiSize);
  console.log('desired size', desiredCanvasSize.value);
}

function draw() {
  console.debug('draw ');
  assertNotNull(vueCanvas.value, 'vueCanvas is null');
  new HashiCanvasService(
    vueCanvas.value,
    new HashiUtil(hashiStore),
    customPropertiesStore.defs
  ).draw();
}
</script>

<template>
  <canvas
    id="canvas"
    :width="Rescale * desiredCanvasSize.width + 'px'"
    :height="Rescale * desiredCanvasSize.height + 'px'"
    :style="{
      width: desiredCanvasSize.width + 'px',
      height: desiredCanvasSize.height + 'px'
    }"
  ></canvas>
</template>

<style scoped>
#canvas {
  border: 1px solid gray;
}
</style>
