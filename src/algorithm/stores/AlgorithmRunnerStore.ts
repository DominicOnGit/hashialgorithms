import { defineStore } from 'pinia';

export type RuleState = 'noMatch' | 'matching' | 'unknown' | 'infiniteLoop';

export interface RunState {
  activeRule: number | null;

  ruleStates: RuleState[];
}

export const useAlgorithmRunnerStore = defineStore('algorithmRunner', {
  state: (): RunState => {
    return {
      activeRule: null,
      ruleStates: []
    };
  },
  actions: {
    setActiveRule(ruleIndex: number | null): void {
      this.activeRule = ruleIndex;
    },
    setRuleState(ruleIndex: number, state: RuleState): void {
      console.log(`setRuleState(${ruleIndex}, ${state})`);
      this.ruleStates[ruleIndex] = state;
    }
  }
});
