<script setup lang="ts">
import { removeProxy } from '@/services/misc';
import { computed } from 'vue';
import Multiselect from 'vue-multiselect';

interface OptionData {
  item: any;
  label: string;
  key: string;
  // index: number;
}

const props = defineProps<{
  options: unknown[];
  active: unknown;
  keyGetter?: (item: any) => string;
  labelGetter?: (item: any) => string;
}>();

defineEmits<{ (e: 'update:modelValue', item: any, index: number): void }>();

defineSlots<{
  selected(props: { selectedItem: any }): any;
  option(props: { item: any }): any;
}>();

function getKey(item: unknown): string {
  return props.keyGetter != null ? props.keyGetter(item) : JSON.stringify(item);
}

function toOptionData(item: any): OptionData {
  return {
    item: item,
    label: props.labelGetter != null ? props.labelGetter(item) : 'undefined',
    key: getKey(item)
  };
}

const optionsData = computed(() => {
  const dataFromOptions = props.options.map(toOptionData);
  const activeData = toOptionData(props.active);
  const activeAt = dataFromOptions.findIndex((x) => x.key === activeData.key);
  if (activeAt === -1) {
    console.error('active item not found', removeProxy(props.active), props.options);
    throw new Error('active item not found in options');
  }
  dataFromOptions.splice(activeAt, 1, activeData);
  return dataFromOptions;
});

const activeData = computed(() => {
  const activeId = getKey(props.active);
  const found = optionsData.value.find((x) => x.key === activeId);
  if (found == null) {
    console.error(
      'no active item found',
      activeId,
      optionsData.value.map((x) => x.key)
    );
  }
  return found;
});
</script>

<template>
  <multiselect
    :options="optionsData"
    :modelValue="activeData"
    track-by="key"
    label="label"
    @update:modelValue="(e: any) => $emit('update:modelValue', e.item, e.index)"
    :searchable="false"
    :allow-empty="false"
    :show-labels="false"
  >
    <!-- <template #option="slotProps">
      {{ slotProps.option.term }}
    </template> -->
    <template #singleLabel="slotProps">
      <slot name="selected" :selectedItem="slotProps.option.item" />
    </template>
  </multiselect>
</template>

<!--
multiselect: field without popup
multiselect__content: entire popup
multiselect__option: an item in the popup
-->

<style>
.multiselect {
  position: relative;
  display: inline-block;

  color: black;
  padding: 2px;
  border: 1px solid rgb(118, 118, 118);
  border-radius: 2px;
}
.multiselect__content-wrapper {
  position: absolute;
  z-index: 1;
  background-color: white;
  border: 1px solid black;
  padding: 5px;
  box-shadow: 10px 5px 5px gray;
}
.multiselect__content {
  padding: 0;
  margin: 0;
  min-width: 100%;
  display: inline-block;
  list-style: none;
}

.multiselect__option {
  display: block;
  padding: 5px;
  cursor: pointer;
}

.multiselect__option--highlight {
  background: #41b883;
  color: #fff;
}
</style>
