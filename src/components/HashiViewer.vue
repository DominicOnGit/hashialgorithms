<!-- <script setup lang="ts">
import { useHashiStore } from '@/stores/hashi'
console.log('setup')
const store = useHashiStore()

store.$subscribe((mutation, state) => {
  console.log('subscribe')
})
</script> -->

<script lang="ts">
import { defineComponent } from 'vue'
import { HashiCanvasService } from '@/services/HashiCanvasService'
import { mapStores } from 'pinia'
import { useHashiStore } from '@/stores/hashi'

export default defineComponent({
  data() {
    return {
      vueCanvas: undefined as CanvasRenderingContext2D | undefined | null
    }
  },
  computed: {
    ...mapStores(useHashiStore)
  },
  mounted() {
    console.log('mounted')
    const c = document.getElementById('canvas') as HTMLCanvasElement

    const ctx = c.getContext('2d')
    this.vueCanvas = ctx

    this.draw()
  },
  methods: {
    draw() {
      console.log('draw')

      if (this.vueCanvas == null) {
        throw new Error()
      }
      new HashiCanvasService(this.vueCanvas, this.hashiStore).draw()
    }
  },
  watch: {
    hashiStore: {
      handler(): void {
        console.log('changed')
        this.draw()
      },
      deep: true
    }
  }
})
</script>

<template>
  <canvas id="canvas" width="400" height="400"></canvas>
</template>

<style scoped>
#canvas {
  height: 400px;
  width: 400px;
  border: 1px solid gray;
}
</style>
