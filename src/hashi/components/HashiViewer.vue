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
  HashiViewerLogger.debug('onBeforeMount');
  calculateDesiredSize();
});

onMounted(() => {
  const c = document.getElementById('canvas') as HTMLCanvasElement;

  const ctx = c.getContext('2d');
  if (ctx == null) throw new Error();
  vueCanvas.value = ctx;

  HashiViewerLogger.debug('mounted');
  draw();
});

onUpdated(() => {
  HashiViewerLogger.debug('onUpdated');
  draw();
});

watch(hashiStore, () => {
  HashiViewerLogger.debug('hashiStore changed');
  calculateDesiredSize();
  if (vueCanvas.value != null) {
    draw();
  }
});

const desiredCanvasSize = ref({ width: 300, height: 300 });

function calculateDesiredSize(): void {
  const hashiSize = new HashiUtil(hashiStore).getSize();
  const desired = desiredSize(hashiSize);
  HashiViewerLogger.debug('desired size: ', desired);
  desiredCanvasSize.value = desired;
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
