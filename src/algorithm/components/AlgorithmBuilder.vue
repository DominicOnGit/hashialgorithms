<script setup lang="ts">
import { useHashiAlgorithmStore } from '@/algorithm/stores/HashiAlgorithmStore';
import { vElementDeselected } from '@/directives/vElementDeselected';
import RuleBuilder from './RuleBuilder.vue';
import { createPathToRule } from '@/algorithm/services/AlgorithmPathService';
import type { Rule } from '../stores/HashiAlgorithm';
import { ref, nextTick } from 'vue';
import SlowPressButton from '@/components/SlowPressButton.vue';
import { useAlgorithmRunnerStore } from '../stores/AlgorithmRunnerStore';

const hashiAlgorithmStore = useHashiAlgorithmStore();
const runState = useAlgorithmRunnerStore();

const nameEditors = ref();
const activeRuleIndex = ref(0);
const editedNameIndex = ref<number | null>(null);

function getName(rule: Rule, index: number): string {
  return rule.name ?? 'Rule ' + (index + 1);
}

function editName(index: number): void {
  activeRuleIndex.value = index;
  editedNameIndex.value = index;
  nextTick(() => {
    if (nameEditors.value.length !== 1) throw new Error();
    nameEditors.value[0].focus();
    nameEditors.value[0].select();
  });
}

function stopNameEditing(): void {
  console.log('stopNameEditing');
  editedNameIndex.value = null;
}

function newRule(): void {
  hashiAlgorithmStore.newRule();
  activeRuleIndex.value = hashiAlgorithmStore.rules.length - 1;
}

function deleteRule(index: number): void {
  hashiAlgorithmStore.deleteRule(createPathToRule(index));
}
</script>

<template>
  <ul class="nav nav-pills">
    <li v-for="(rule, index) in hashiAlgorithmStore.rules" :key="index" class="nav-item">
      <a
        :ref="'a' + index"
        class="nav-link"
        :class="{ active: activeRuleIndex === index }"
        @click="activeRuleIndex = index"
      >
        <i v-if="runState.activeRule === index" class="bi-activity"></i>
        <!-- bi-bullseye bi-caret-right-square-->
        <template v-else>
          <i v-if="runState.ruleStates[index] == 'matching'" class="bi-crosshair"></i>
          <i v-else-if="runState.ruleStates[index] == 'noMatch'" class="bi-mic-mute"></i>
          <i v-else-if="runState.ruleStates[index] == 'unknown'" class="bi-hourglass"></i>
          <i v-else-if="runState.ruleStates[index] == 'infiniteLoop'" class="bi-infinity"></i>
        </template>
        <!-- <span
          v-if="runState.activeRule === index"
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span> -->
        <template v-if="editedNameIndex === index">
          <input
            ref="nameEditors"
            v-if="editedNameIndex === index"
            v-elementDeselected="{ handler: stopNameEditing, exclude: ['a' + index] }"
            v-model="rule.name"
            type="text"
          />
          <button class="btn" @click="stopNameEditing">
            <i class="bi-check-lg"></i>
          </button>
        </template>
        <template v-else>
          <span>{{ getName(rule, index) }} </span>
          <button class="btn" @click="editName(index)">
            <i class="bi-pencil"></i>
          </button>
          <SlowPressButton class="btn" @activated="() => deleteRule(index)">
            <i class="bi-trash"></i>
          </SlowPressButton>
        </template>
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
