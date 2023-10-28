<script setup lang="ts">
import { computed, ref, toRef } from 'vue';

const props = defineProps<{
  options: unknown[];
  selected: unknown;
}>();

const emits = defineEmits<{ (e: 'update:modelValue', item: any, index: number): void }>();

defineSlots<{
  default(props: { selectedItem: any }): any;
  option(props: { item: any }): any;
}>();

const isOpen = ref(false);
const selectedValue = ref(props.selected); // toRef(props, 'selected');

function open(): void {
  isOpen.value = !isOpen.value;
}
function onSelected(): void {
  console.log('onSelected');
}
function clicked(item: any): void {
  console.log('selected', item);
  selectedValue.value = item;
  isOpen.value = false;
  emits('update:modelValue', item, 1);
}
</script>

<template>
  <span class="selection">
    <button @click="open()">
      <slot :selectedItem="selectedValue"></slot>
      &#x2335;
    </button>
    <div v-if="isOpen" class="options">
      <div v-for="(item, index) in options" :key="index" @click="clicked(item)" class="oneOption">
        <slot name="option" :item="item" />
      </div>
    </div>
  </span>
</template>

<style scoped>
.selection {
  position: relative;
}
.options {
  display: flex;
  flex-direction: column;
  width: auto;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 8px 5px;
  position: absolute;
  z-index: 1;
  top: 100%;
  left: 0%;
}

.oneOption :hover {
  background-color: blue !important;
  z-index: 4;
}

.oneOption {
  background-color: red;
}

/* Popup arrow */
.popup .popuptext::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}
</style>
