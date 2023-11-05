import { RuleRunner } from './RuleRunner';
import { type Hashi } from '@/stores/hashi';
import type { HashiAlgorithm } from '@/stores/HashiAlgorithm';
import { HashiUtil } from './HashiUtil';

export class AlgorithmRunner {
  private hashiUtil: HashiUtil;

  constructor(
    private algorithm: HashiAlgorithm,
    hashi: Hashi
  ) {
    this.hashiUtil = new HashiUtil(hashi);
  }

  runStep(): boolean {
    const rule = this.algorithm.rules[0];
    const ruleRunner = new RuleRunner(rule, this.hashiUtil);
    const hadEffect = ruleRunner.runRuleStep(rule);
    return hadEffect;
  }
}
