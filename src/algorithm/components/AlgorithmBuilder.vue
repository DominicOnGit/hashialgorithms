<script setup lang="ts">
import { useHashiAlgorithmStore } from '@/algorithm/stores/HashiAlgorithmStore';
import RuleBuilder from './RuleBuilder.vue';
import { createPathToRule } from '@/algorithm/services/AlgorithmPathService';

const hashiAlgorithmStore = useHashiAlgorithmStore();
</script>

<template>
  <RuleBuilder
    v-for="(rule, index) in hashiAlgorithmStore.rules"
    :key="index"
    :rule="rule"
    :path="createPathToRule(index)"
  />
</template>

<style scoped></style>
