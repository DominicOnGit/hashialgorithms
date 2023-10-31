<script setup lang="ts">
import { computed } from 'vue';
import Multiselect from 'vue-multiselect';

const props = defineProps<{
  options: unknown[];
  active: unknown;
  labelGetter?: (item: any) => string;
}>();

defineEmits<{ (e: 'update:modelValue', item: any, index: number): void }>();

defineSlots<{
  selected(props: { selectedItem: any }): any;
  option(props: { item: any }): any;
}>();

function getKey(item: unknown): string {
  return JSON.stringify(item);
}

const optionsData = computed(() => {
  const optionsAndKey = props.options.map((opt, index) => {
    return {
      item: opt,
      label: props.labelGetter != null ? props.labelGetter(opt) : 'undefined',
      key: getKey(opt),
      index: index
    };
  });
  // console.log(optionsAndKey);
  return optionsAndKey;
});

const activeData = computed(() => {
  const activeId = getKey(props.active);
  const found = optionsData.value.find((x) => x.key === activeId);
  //console.log('active: ' + activeId, found);
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
