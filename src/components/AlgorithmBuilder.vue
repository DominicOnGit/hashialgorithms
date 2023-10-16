<script lang="ts">
import { defineComponent } from 'vue';
import { mapStores } from 'pinia';
import { useHashiStore } from '@/stores/hashi';
import { useHashiAlgorithmStore } from '@/stores/HashiAlgorithm';
import RuleBuilder from './RuleBuilder.vue';

export default defineComponent({
  data() {
    return {};
  },
  computed: {
    ...mapStores(useHashiStore, useHashiAlgorithmStore)
  },
  methods: {},
  components: { RuleBuilder }
});
</script>

<template>
  <RuleBuilder
    v-for="(rule, index) in hashiAlgorithmStore.rules"
    :key="index"
    :rule="rule"
    :path="{ ruleIndex: index }"
  />
</template>

<style scoped></style>
