import { defineStore } from 'pinia';

export type RuleState = 'noMatch' | 'matching' | 'unknown' | 'infiniteLoop' | 'invalid';

export interface RunState {
  lastStepAt: Date | null;
  activeRule: number | null;

  ruleStates: RuleState[];
}

export const useAlgorithmRunnerStore = defineStore('algorithmRunner', {
  state: (): RunState => {
    return {
      lastStepAt: null,
      activeRule: null,
      ruleStates: []
    };
  },
  actions: {
    setActiveRule(ruleIndex: number | null): void {
      this.activeRule = ruleIndex;
      if (ruleIndex != null) {
        this.lastStepAt = new Date();
      }
    },
    setRuleState(states: RuleState[]): void {
      this.ruleStates = states;
    }
  }
});
