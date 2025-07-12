import { useAlgorithmRunnerStore } from './../stores/AlgorithmRunnerStore';
import { RuleRunner } from './RuleRunner';
import type { HashiAlgorithm } from '@/algorithm/stores/HashiAlgorithm';
import { HashiUtil } from '../../hashi/services/HashiUtil';
import { isRuleEnabled } from '../stores/HashiAlgorithmStore';

export class AlgorithmRunner {
  constructor(
    private algorithm: HashiAlgorithm,
    private hashiUtil: HashiUtil
  ) {}

  runStep(): boolean {
    const runnerStore = useAlgorithmRunnerStore();
    const startingRuleIndex = runnerStore.activeRule ?? 0;
    for (let i = 0; i < this.algorithm.rules.length; i++) {
      const ruleIndex = (startingRuleIndex + i) % this.algorithm.rules.length;
      if (isRuleEnabled(this.algorithm, ruleIndex)) {
        const rule = this.algorithm.rules[ruleIndex];
        const ruleRunner = new RuleRunner(rule, this.hashiUtil);
        const hadEffect = ruleRunner.runRuleStep();
        if (hadEffect) {
          runnerStore.setActiveRule(ruleIndex);
          return true;
        }
      }
    }
    runnerStore.setActiveRule(null);
    return false;
  }
}
