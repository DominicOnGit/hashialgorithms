<script setup lang="ts">
import { ref } from 'vue';

interface OptionType {
  label: string;
  id: number;
}

const optRaw: OptionType[] = [
  {
    label: 'hello',
    id: 12
  },
  {
    label: 'other, longer',
    id: 44
  }
];

const opt = ref(optRaw);
</script>

<template>
  <h1>Test</h1>
  start
  <ComboboxSelection :options="opt" :selected="opt[0]">
    <template #default="slotProps"> {{ slotProps.selectedItem.label }} </template>
    <template #option="slotProps"> {{ slotProps.item.label }} </template>
  </ComboboxSelection>
  continue
  <!-- <TermBuilder :path="path" :term="term"></TermBuilder> -->
  <!-- 
  <Multiselect :options="opt" :modelValue="opt[1]" :searchable="false">
    <template #singleLabel="slotProps">
      {{ slotProps }}
    </template>
  </Multiselect>
  and here we -->
</template>

<style scoped></style>
