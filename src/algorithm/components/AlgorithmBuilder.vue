<script setup lang="ts">
import { useHashiAlgorithmStore } from '@/algorithm/stores/HashiAlgorithmStore';
import { vElementDeselected } from '@/directives/vElementDeselected';
import RuleBuilder from './RuleBuilder.vue';
import { createPathToRule } from '@/algorithm/services/AlgorithmPathService';
import type { Rule } from '../stores/HashiAlgorithm';
import { ref } from 'vue';

const hashiAlgorithmStore = useHashiAlgorithmStore();

const activeRuleIndex = ref(0);
const editedNameIndex = ref<number | null>(null);

function getName(rule: Rule, index: number): string {
  return rule.name ?? 'Rule ' + (index + 1);
}

function editName(index: number): void {
  activeRuleIndex.value = index;
  editedNameIndex.value = index;
}

function stopNameEditing(): void {
  console.log('stopNameEditing');
  editedNameIndex.value = null;
}

function newRule(): void {
  hashiAlgorithmStore.newRule();
  activeRuleIndex.value = hashiAlgorithmStore.rules.length - 1;
}
</script>

<template>
  <ul class="nav nav-pills">
    <li v-for="(rule, index) in hashiAlgorithmStore.rules" :key="index" class="nav-item">
      <a :ref="'a' + index" class="nav-link" :class="{ active: activeRuleIndex === index }">
        <span
          v-if="editedNameIndex === index"
          v-elementDeselected="{ exclude: ['a' + index], handler: stopNameEditing }"
          >EDIT</span
        >
        <span v-else @click="activeRuleIndex = index">{{ getName(rule, index) }} </span>
        <i @click="editName(index)" class="bi-pencil"></i>
        <i class="bi-trash"></i>
      </a>
    </li>
    <li class="nav-item"><a class="nav-link" @click="newRule">NEW</a></li>
  </ul>

  <RuleBuilder
    :rule="hashiAlgorithmStore.rules[activeRuleIndex]"
    :path="createPathToRule(activeRuleIndex)"
  />
</template>

<style scoped></style>
