<script setup lang="ts">
import { ref } from 'vue';
import { vElementDeselected } from '@/directives/vElementDeselected';

const model = defineModel<string>();

defineProps<{
  displayNameIfNull?: string;
}>();

const editing = ref(false);
</script>

<template>
  <template v-if="editing">
    <input
      ref="nameEditors"
      v-elementDeselected="{ handler: () => (editing = false) }"
      v-model="model"
      type="text"
    />
    <button class="btn" @click="() => (editing = false)">
      <i class="bi-check-lg"></i>
    </button>
  </template>
  <template v-else>
    <span>{{ model ?? displayNameIfNull }} </span>
    <button class="btn" @click="() => (editing = true)">
      <i class="bi-pencil"></i>
    </button>
  </template>
</template>
