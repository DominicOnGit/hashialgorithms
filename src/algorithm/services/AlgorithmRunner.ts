import { useAlgorithmRunnerStore } from './../stores/AlgorithmRunnerStore';
import { RuleRunner } from './RuleRunner';
import { type Hashi } from '@/hashi/stores/hashi';
import type { HashiAlgorithm } from '@/algorithm/stores/HashiAlgorithm';
import { HashiUtil } from '../../hashi/services/HashiUtil';

export class AlgorithmRunner {
  private hashiUtil: HashiUtil;

  constructor(
    private algorithm: HashiAlgorithm,
    hashi: Hashi
  ) {
    this.hashiUtil = new HashiUtil(hashi);
  }

  runStep(): boolean {
    const runnerStore = useAlgorithmRunnerStore();
    let ruleIndex = runnerStore.activeRule ?? 0;
    while (ruleIndex < this.algorithm.rules.length) {
      const rule = this.algorithm.rules[ruleIndex];
      const ruleRunner = new RuleRunner(rule, this.hashiUtil);
      const hadEffect = ruleRunner.runRuleStep();
      if (hadEffect) {
        runnerStore.setActiveRule(ruleIndex);
        return true;
      }
      ruleIndex++;
    }
    runnerStore.setActiveRule(null);
    return false;
  }
}
