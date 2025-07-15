<script setup lang="ts">
import { onBeforeMount, onMounted, onUpdated, ref, watch } from 'vue';
import { desiredSize, HashiCanvasService, Rescale } from '@/hashi/services/HashiCanvasService';
import { useHashiStore } from '@/hashi/stores/hashi';
import { HashiUtil } from '@/hashi/services/HashiUtil';
import { useCustomPropertyStore } from '@/stores/CustomPropertyDef';
import { assertNotNull } from '@/services/misc';
import { HashiViewerLogger } from '@/services/logging';
if (import.meta.hot) {
  import.meta.hot.on('vite:afterUpdate', () => {
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
  const c = document.getElementById('canvas') as HTMLCanvasElement;

  const ctx = c.getContext('2d');
  if (ctx == null) throw new Error();
  vueCanvas.value = ctx;
  //  draw();
});

onUpdated(() => {
  draw();
});

watch(hashiStore, () => {
  calculateDesiredSize();
  draw();
});

const desiredCanvasSize = ref({ width: 300, height: 300 });

function calculateDesiredSize(): void {
  const hashiSize = new HashiUtil(hashiStore).getSize();
  desiredCanvasSize.value = desiredSize(hashiSize);
  // console.log('desired size', desiredCanvasSize.value);
}

function draw() {
  HashiViewerLogger.debug('draw');
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
    :width="Rescale * desiredCanvasSize.width"
    :height="Rescale * desiredCanvasSize.height"
    :style="{
      width: desiredCanvasSize.width + 'px',
      height: desiredCanvasSize.height + 'px'
    }"
  ></canvas>
</template>

<style scoped></style>
