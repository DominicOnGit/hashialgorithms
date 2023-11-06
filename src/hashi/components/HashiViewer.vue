<!-- <script setup lang="ts">
import { useHashiStore } from '@/stores/hashi'
console.log('setup')
const store = useHashiStore()

store.$subscribe((mutation, state) => {
  console.log('subscribe')
})
</script> -->

<script lang="ts">
import { defineComponent } from 'vue';
import { HashiCanvasService } from '@/hashi/services/HashiCanvasService';
import { mapStores } from 'pinia';
import { useHashiStore } from '@/hashi/stores/hashi';
import { HashiUtil } from '@/hashi/services/HashiUtil';
import { useCustomPropertyStore } from '@/stores/CustomPropertyDef';

export default defineComponent({
  data() {
    return {
      vueCanvas: undefined as CanvasRenderingContext2D | undefined | null
    };
  },
  computed: {
    ...mapStores(useHashiStore, useCustomPropertyStore)
  },
  mounted() {
    console.log('mounted');
    const c = document.getElementById('canvas') as HTMLCanvasElement;

    const ctx = c.getContext('2d');
    this.vueCanvas = ctx;

    this.draw();
  },
  methods: {
    draw() {
      console.log('draw');

      if (this.vueCanvas == null) {
        throw new Error();
      }
      new HashiCanvasService(
        this.vueCanvas,
        new HashiUtil(this.hashiStore),
        this.CustomPropertyStore.defs
      ).draw();
    }
  },
  watch: {
    hashiStore: {
      handler(): void {
        console.log('changed');
        this.draw();
      },
      deep: true
    }
  }
});
</script>

<template>
  <canvas id="canvas" width="400" height="400"></canvas>
</template>

<style scoped>
#canvas {
  border: 1px solid gray;
}
</style>
